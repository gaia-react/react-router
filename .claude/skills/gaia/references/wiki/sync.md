# wiki-sync playbook

Dispatched by the `/gaia-wiki` router (`references/wiki.md` → "Sync"). Runs in a Sonnet subagent context.

## Playbook

Evaluate every commit between `wiki/.state.json` `last_evaluated_sha` and HEAD. For each, decide whether the wiki needs an update. Edit pages, log decisions, advance state, commit.

`wiki/.state.json` is written by two workflows: this one writes the sync-related fields (`last_evaluated_sha`, `last_evaluated_at`); `/gaia-wiki consolidate` writes the consolidate-related field (`last_consolidated_sha`). Each must preserve fields owned by the other when writing. The hooks (`wiki-drift-check`, `wiki-commit-nudge`, `wiki-session-stop`) are read-only consumers.

## Step 1: Read state and compute drift

Run `.gaia/cli/gaia wiki state --json` and parse the result. Use `head_short`, `state_sha`, `commits_ahead`, `reachable`, and `suggested_base` directly.

Throughout this playbook, **the evaluation baseline** is the ref Steps 2, 3, and 8 evaluate from. On the normal path it is `last_evaluated_sha`; on the recovery path (below) it is `suggested_base`. Each branch states which.

- If the command exits non-zero with a `state_missing` (or equivalent) reason, this is a fresh project (no prior sync). Treat the first commit as the baseline. Run `.gaia/cli/gaia wiki state-init "$(git rev-list --max-parents=0 HEAD | tail -1)"` to create `wiki/.state.json` with `{version, last_evaluated_sha, last_evaluated_at}`, then commit as `wiki: initialize state at {short_sha}`. Stop, no commits to evaluate yet.
- If `commits_ahead === 0`: skip the evaluation pass (no commits to evaluate) but DO NOT exit yet, fall through to Step 9 (consolidate gate). The gate may still trigger consolidate based on accumulated page-adds since last consolidate run, even when this sync is a no-op. The Step 8 report still prints; just substitute `Wiki already in sync at {short_sha}.` for the regular summary block, then run Step 9.
- If `reachable === false`: the recorded `last_evaluated_sha` is not in HEAD's history. GAIA's squash-merge flow orphans it on **every** merge, the evaluated branch SHA is replaced by a new squash commit on `main`, so this is the common case, not just a manual rebase. Recover the un-evaluated window instead of discarding it:
  - **Recovery path, when `suggested_base` is non-empty.** The CLI resolved `suggested_base` to the newest commit on HEAD's **first-parent chain** at or older than `last_evaluated_at`. That can sit before where the orphaned SHA left off, so expect some already-catalogued commits in the window; Step 5's dedup guard skips them. Adopt `suggested_base` as the evaluation baseline and run the normal pass (Steps 2–9) from it. Do NOT jump to HEAD and do NOT log a `RE_ANCHOR` line, the window is evaluated, not abandoned. Step 6 advances `last_evaluated_sha` to HEAD as usual.
  - **Fallback path, when `suggested_base` is empty.** Only when the CLI cannot resolve a baseline (no `last_evaluated_at`, or it predates all history) revert to the lossy-but-safe re-anchor: run `.gaia/cli/gaia wiki state-bump last_evaluated_sha "$(git rev-parse HEAD)"`, then `.gaia/cli/gaia wiki log-prepend --sha "$(git rev-parse --short HEAD)" --decision RE_ANCHOR --reason "re-anchored after history rewrite (no recoverable baseline)"`, commit, exit. Skip Step 9, there is no recovered range to consolidate against.
- Otherwise proceed with the evaluation pass on the normal baseline (`last_evaluated_sha`).

## Step 2: Drift cap check

If drift > 30 commits, ASK the user via `AskUserQuestion`:

- Question: `Wiki is {N} commits behind HEAD. Syncing all may cost ~${estimated} in tokens. Proceed?`
- Options:
  - `Sync all {N} commits` (description: full evaluation)
  - `Sync recent N commits only` (description: evaluate the last 20 commits, re-anchor state)
  - `Cancel` (description: do nothing)

Only proceed automatically when drift ≤ 30.

The drift count is `commits_ahead` on the normal path. On the recovery path `commits_ahead` is `0` (the recorded SHA is unreachable, so the CLI cannot count from it); use the recovered range size instead, `git rev-list --count <suggested_base>..HEAD`, and apply this same cap to it. A batch that landed since the last sync (worst case, a whole release) shows up here and is gated exactly like normal drift.

## Step 3: First-pass, classify commits

Run, using the evaluation baseline from Step 1 (normal path: `last_evaluated_sha`; recovery path: `suggested_base`):

```bash
# Normal path: BASE=$(jq -r .last_evaluated_sha wiki/.state.json)
# Recovery path: BASE=<suggested_base from `.gaia/cli/gaia wiki state --json`>
.gaia/cli/gaia wiki commit-classify --since "$BASE" --json
```

On the recovery path, classify from `suggested_base`, NOT the orphaned `last_evaluated_sha`. The orphaned SHA's `..HEAD` range is topologically unreliable after a squash; `suggested_base` is reachable and time-anchored.

The CLI emits a deterministic `suggestion` field per commit (`WORTHY` or `SKIP`) along with `subject`, `body`, file stats, and `suggestion_reason`. Treat the `WORTHY` subset as candidates for deep-read. Trust the CLI's classification, do not re-derive WORTHY/SKIP rules in prose. Log the `suggestion_reason` verbatim alongside the decision in Step 5.

### Step 3b: Check the classifier health block

The same JSON carries a `health` object: `evaluated`, `deferred` (commits that reached a fail-open default rather than a discriminating rule), `deferral_rate`, `worthy_rate`, and `inert`.

When `health.inert` is `true`, the rule table has stopped matching the subjects this repo writes. Every commit still gets a plausible per-commit reason, so nothing else in this playbook will notice; the failure mode is that the first pass silently stops filtering and Step 4 deep-reads the whole range at full cost. The CLI also writes a warning to stderr.

**`inert` is not sufficient on its own.** It only trips once the sample is large enough for a rate to mean anything, and a routine sync evaluates far fewer commits than that, so on most runs it is structurally `false` and reading it tells you nothing. Read `deferral_rate` directly whenever `inert` is `false`: a high share on a small window is the same defect caught earlier, and it is worth investigating rather than waiting for a backlog big enough to trip the flag. (Do not restate the CLI's threshold or sample floor here. They live in the classifier, and a copy in prose is the drift this check exists to catch.)

Do not treat either signal as a reason to skip the sync. Keep going, and **carry the CLI's stderr warning verbatim into Step 8's `Classifier health:` field** (or, when the rate is high but `inert` is `false`, a one-line note naming `deferred`/`evaluated` and the rate). Step 8 owns why the delivery has to ride inside the block rather than beside it, and this step does not restate the reasoning. The fix itself is in the classifier's rule table or its `gaia.wikiClassify` path vocabulary (`package.json`), never in this playbook.

A high `worthy_rate` with a low `deferral_rate` is not a fault. It means the rules are discriminating and this repo's commits genuinely are wiki-relevant, which is the expected shape for a repo whose own source is the thing the wiki documents.

## Step 4: Second-pass, read diffs for WORTHY commits only

For each WORTHY commit:

```bash
git show <sha>
```

Read the diff. Decide what wiki page(s) need updating:

- New service in `app/services/`: edit or create `wiki/services/<name>.md`
- New hook in `app/hooks/`: edit or create `wiki/hooks/<name>.md`
- New route group: edit `wiki/decisions/Thin Routes.md` and/or `wiki/modules/Pages.md`
- Dependency change: edit `wiki/dependencies/<name>.md` (create if needed)
- Architectural pattern: edit relevant `wiki/concepts/<topic>.md`
- ADR-worthy: create new `wiki/decisions/<title>.md` with frontmatter:

  ```
  ---
  type: decision
  status: active
  priority: 1
  date: <commit date, YYYY-MM-DD>
  created: <commit date, YYYY-MM-DD>
  updated: <today, YYYY-MM-DD>
  tags: [decision, ...]
  ---
  ```

  Derive `<today>` from `date +%F` (shell), never guess the current date. Take the `date`/`created` commit-date values from the commit itself: `git show -s --format=%cs <sha>`.

Match the existing wiki voice: declarative, no preamble, concrete examples where useful. Don't paraphrase the commit message, extract the load-bearing facts and integrate them into the page's narrative.

**Follow `.claude/rules/wiki-style.md` when writing or editing prose.** Present tense only. Never reference UAT-NNN, SPEC-NNN, PR numbers, commit SHAs, or "changed from X to Y on date" inside body prose. The historical record lives in `wiki/log.md` (which Step 5 maintains) and in git, not in pages.

If a commit's diff turns out NOT to be wiki-worthy on closer inspection (e.g. subject suggested feature but it was a refactor), demote to SKIP and proceed.

## Step 5: Append to wiki/log.md

For each commit (worthy or skipped), first dedup against the existing ledger, then run:

```bash
# Skip commits a prior sync already catalogued, avoids double-logging.
# Grep the working-tree log so lines this sync already prepended count too.
grep -qF "<short_sha>" wiki/log.md && continue
.gaia/cli/gaia wiki log-prepend --sha <short_sha> --decision <WORTHY|SKIP> --reason "<one-line reason>"
```

The dedup guard matters most on the recovery path (Step 1), where the resolved `suggested_base` can sit behind commits a prior sync already logged. Skip any commit whose short SHA is already in `wiki/log.md` rather than appending a duplicate line.

The CLI inserts a single canonical line `- <YYYY-MM-DD> <sha> <decision>, <reason>` at the top of `wiki/log.md` (after frontmatter), atomically, newest entries on top. Examples:

- WORTHY: `.gaia/cli/gaia wiki log-prepend --sha abc1234 --decision WORTHY --reason "added /services/Gemini integration → wiki/services/Gemini.md"`
- SKIP: `.gaia/cli/gaia wiki log-prepend --sha def5678 --decision SKIP --reason "typo-only commit"`
- Serena-policy SKIP: `.gaia/cli/gaia wiki log-prepend --sha 9a0b1c2 --decision SKIP --reason "Serena handles inventory, added Button variant in app/components/Button"`

## Step 5b: Fabrication guard, verify edits landed on disk

Before advancing state or landing, prove the Step 4 decisions actually wrote to disk. This is the fabrication guard: a run that logged WORTHY decisions in Step 5 and is about to advance state (Step 6) and commit (Step 7) MUST have produced the corresponding page edits. Without this check a model can satisfy the workflow's success signal (summary + log + state) while writing no content, and Step 7 launders that empty sync into a green commit.

`CLAIMED` is the set of page paths Step 4 decided to edit or create for WORTHY commits, the same paths the Step 8 "Pages edited" / "ADRs created" lists report.

Check each claimed path individually (wiki filenames contain spaces, so do NOT field-split a combined listing):

```bash
# 1. No-empty-WORTHY check: WORTHY commits must produce at least one content change.
CONTENT_CHANGES=$(git status --porcelain -- wiki/ \
  ':(exclude)wiki/.state.json' ':(exclude)wiki/log.md' \
  ':(exclude)wiki/hot.md' ':(exclude)wiki/meta/')

# 2. Per-claim check: every CLAIMED path must show as changed/created.
#    git status --porcelain -- "<path>" is empty when the path is unmodified.
for p in "${CLAIMED[@]}"; do
  [ -z "$(git status --porcelain -- "$p")" ] && echo "MISSING: $p"
done
```

ABORT on either failure, do NOT run Step 6, do NOT run Step 7, leave the working tree untouched, and print the failure block below **instead of** the Step 8 summary, then stop:

1. **No empty WORTHY sync.** `N_worthy >= 1` but `CONTENT_CHANGES` is empty ⇒ edits were decided but none written. Abort.
2. **Every claimed page exists in the diff.** Any `MISSING:` line from the loop ⇒ that edit was narrated, not written. Abort, naming the missing pages.

The all-SKIP case is legitimate: `N_worthy == 0` with empty `CONTENT_CHANGES` and an empty `CLAIMED` passes both checks, proceed to Step 6 normally.

Failure block:

```
Wiki sync ABORTED, fabrication guard tripped.

  Worthy commits:   {N_worthy}
  Pages claimed:    {CLAIMED}
  Pages on disk:    {changed wiki content paths}
  Missing:          {CLAIMED minus on-disk}

State not advanced. Nothing committed. Re-run sync; if this recurs, the dispatched
model is narrating edits without performing them, escalate the model.
```

Because the run aborts before Step 8/9, no `CONSOLIDATE_TRIGGERED` line is emitted. The router (`references/wiki.md` → "Full chain") already treats an absent trigger line as a known-incomplete state and skips consolidate and lint, so an abort fails the whole chain safely without further wiring.

<!-- gaia:maintainer-only:start -->
## Step 5c: Shipped-surface boundary check

`wiki/` ships, so a page this run authored is a shipped file and carries two boundary obligations no other step in this playbook checks. Both are properties of authoring a page at all rather than of what a given page says, so they recur on every sync that writes one. Both are also maintainer-repo concerns: an adopter clone produces no release tarball and answers no distribution manifest, which is why this whole step is maintainer-only and an adopter sync goes from Step 5b straight to Step 6.

Skip the step entirely when Step 5b's `CONTENT_CHANGES` is empty. An all-SKIP run authored no page and owes neither obligation.

Skip it too when the tree does not carry the oracle. The check needs `.gaia/tests/distribution/lib/build-staging.sh` and the `.gaia/cli/gaia-maintainer` binary it calls, both maintainer-only, and a tree holding this playbook without them cannot run it at all; the reachable case is a smoke-test scaffold that copies this file verbatim into a fixture repo. Record `oracle absent, boundary check skipped` in Step 8's `Leaks not repaired:` field and go on to Step 6. This is not 5c.2's environment fault, which is a maintainer's own stale binary and is fixable where it stands.

It sits here, ahead of Step 6 and Step 7, so an abort has the same shape as Step 5b's, state not advanced, nothing committed, nothing pushed, and so it runs ahead of the pull request whichever caller opens one. Step 7 owns that split.

### 5c.1 Stage the authored pages first

```bash
git add -- wiki/
```

This is load-bearing, not tidiness. The staging build discovers its input with `git ls-files` (through `.gaia/scripts/list-tracked-paths.sh`), which reads the index, so a page this run just created is invisible to it while the page is untracked. Run the check against an unstaged page and it reports clean over an input set that never held the page, which is indistinguishable from a real pass and is the exact failure `.claude/rules/guards-must-fail.md` names for an index-reading discovery. Step 7 runs the same `git add wiki` itself, so staging here changes nothing about what lands.

### 5c.2 Run the staging build

```bash
staging="$(mktemp -d -t gaia-wiki-staging-XXXXXX)"
bash .gaia/tests/distribution/lib/build-staging.sh "$staging"
```

This is the same oracle CI's `Shipped-surface leak check` runs, moved ahead of the pull request. That job is advisory by its own design and never gates a merge, so what this step buys is not a gate but the report arriving while the run that wrote the prose is still holding it. The output directory has to exist and be empty, hence a fresh `mktemp -d` per attempt rather than a reused path.

**Branch on the section header the output carries, never on the exit status.** Exit 1 is not a synonym for "leak": the script spends it on three different report sections and on several environment faults alike, so the status alone cannot tell a prose defect from a missing binary.

- **Exit 0** is clean. Proceed to 5c.4.
- **Exit 1 carrying either repair section** routes to 5c.3, which owns both the repair and its three-attempt bound:
  - `leaks (N):`, lines shaped `[<check-id>] <path>:<line>  <match>`, a release-scrub check. Split the reported lines by who wrote the file. The ones naming a page this run wrote are the repair case and spend attempts against the bound. The rest are pre-existing, because the scrub reads the whole staged tree and no page this run could edit will clear a leak it did not cause: carry those into Step 8's `Leaks not repaired:` field and spend no attempt on them, so a report holding nothing else, including a re-run still red on nothing else, leaves 5c for 5c.4 rather than for the bound.
  - `unbalanced markers (N):`, lines shaped `<path>:<line>  <reason>`, a maintainer-only marker pair that does not close. **This section prints alongside the literal line `leaks: none`**, so a run keyed on the word "leak" reads it as clean-but-failing and finds no branch. 5c.3's own first repair is what produces it, since adding a marker pair is how a block gets unbalanced.
- **Exit 1 carrying `runtime-dependency leaks (N):`** is a shipped script reaching for something the bundle does not carry, and no wiki page can be the cause or the cure. That section comes from a separate verb whose scan set is `.sh` files under the shipped script directories, and `wiki/` is not one of them, so a sync that authored only pages cannot have produced it and no page edit will clear it. It is a pre-existing defect in a shipped script and belongs to whoever owns that script, so carry the section into Step 8's `Leaks not repaired:` field, spend no attempt against 5c.3's bound, and proceed to 5c.4.
- **Everything else** is an environment fault, not prose: exit 1 with none of those sections, and any other exit at all. Stated as a complement deliberately, because the script runs under `set -e` and a failing tool's own status propagates rather than being normalized, so an rsync or version-control failure surfaces as that tool's number and an enumeration would leave a reader holding an unlisted one. The commonest fault is a missing or non-executable maintainer binary, which the script names along with the `pnpm -C .gaia/cli bundle` that produces it, and which it deliberately does not rebuild for you. Fix the environment once, re-run, and do not count the attempt against 5c.3's bound: no edit to a wiki page can change the outcome.

Getting the repair/environment split wrong in either direction costs a run. Reading a repair case as an environment fault loops without bound on something a page edit would fix, because this arm is the one that says editing cannot help; reading an environment fault as a repair case spends three attempts editing prose and then aborts a sync over a build artifact.

Leave the staging tree where `mktemp` put it, exactly as the CI step does.

### 5c.3 Repair, then re-run

A leak is anything one of `.gaia/release-scrub.yml`'s checks flags in the staged tree, and each reported line names the check id that flagged it, so read that id rather than inferring the kind from the match. This step owns the lines naming a page this run wrote; 5c.2's `leaks (N):` bullet has already said where the rest go. Do not work from a remembered list of checks: the file holds more of them than the common cases below. The kinds a generated wiki page trips most often are a pointer at something the adopter never receives, a release-excluded path, a wikilink or a bare Title-Case mention of a release-excluded page, or a sibling-monorepo prefix.

The run that wrote the prose is the one positioned to repair it, so repair rather than abort. Which repair depends on what the check id says is wrong:

- **A real fact that is maintainer-only**: wrap the citation in the `gaia:maintainer-only` HTML-comment marker pair. The bundle-time scrub strips the block, so the page keeps the fact and the adopter copy loses the dangling pointer. `.claude/rules/wiki-style.md` spells the pair; this playbook names it instead, because the scrub matches those two comments as literal strings, and a copy of the **end** marker written inside a maintainer-only block closes that block early. That fails loudly rather than quietly, as an `end_without_start` unbalanced marker when the real end marker is reached, but it fails the whole scrub, so keep the literal end marker out of wrapped prose. A literal start marker inside a block is inert.
- **A pointer an adopter clone cannot follow**: rewrite the sentence to name something their clone has, or drop the pointer. Follow `.claude/rules/wiki-style.md`, which prefers naming what owns a fact over restating it, and a pointer that survives the scrub is usually the shorter sentence anyway.
- **Neither of those**: some checks flag something a marker would hide rather than fix, and wrapping them is the wrong repair even though it clears the check. An absolute filesystem literal is the worked case: wrapping it leaves a machine-specific path in a shipped page, which `.claude/rules/repo-relative-paths.md` bans outright, so make the path repo-relative instead. Read what the check id is actually asserting before reaching for the markers.

Re-stage and re-run 5c.1 and 5c.2 after each repair. **Bound this at three attempts.** On a third red, abort exactly as Step 5b aborts: do not run Step 6, do not run Step 7, leave the tree as it stands, and print the leak list in place of the Step 8 summary. Prose that survives three repairs is a judgment call about what the page should say, and that belongs to the maintainer.

### 5c.4 Record the distribution answer a new page owes

A page this run **created** is a newly-shipping file, and `Distribution Audit` is a declared-required check: it reds when a pull request carries a newly-shipping file `.gaia/manifest.json` does not answer. Ship-or-withhold is a human decision by design, so this step records the obligation and never discharges it. List the created pages:

```bash
git diff --cached --name-only --diff-filter=A -z -- wiki/ | tr '\0' '\n'
```

`-z` with the `tr` back to newlines for the same reason Step 9b needs it: under git's default `core.quotePath` a path carrying a non-ASCII byte prints C-quoted, and here that would misname the page in the field below.

When the listing is non-empty, it fills Step 8's `Distribution answers owed:` field:

```
  Distribution answers owed: <path>[, <path>…]  (run /distribution-audit on this branch before the PR merges)
```

That field is a conditional slot in the Step 8 template, so a run that created no page omits the line and prints the block otherwise unchanged. Step 8 owns why the delivery has to ride inside the block rather than beside it, and this step does not restate the reasoning.
<!-- gaia:maintainer-only:end -->

## Step 6: Advance state file

Run:

```bash
NEW_HEAD=$(git rev-parse HEAD)
NEW_HEAD_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
.gaia/cli/gaia wiki state-bump last_evaluated_sha "$NEW_HEAD"
.gaia/cli/gaia wiki state-bump last_evaluated_at "$NEW_HEAD_AT"
```

`state-bump` writes atomically, preserving sibling fields (`last_consolidated_sha` owned by `/gaia-wiki consolidate`) and key order.

If `last_consolidated_sha` is absent on the existing state (first sync ever): bootstrap it with `.gaia/cli/gaia wiki state-bump last_consolidated_sha "$NEW_HEAD"`. This gives the consolidate gate a baseline so subsequent runs accumulate from a known point.

## Step 7, Land

Run: `.gaia/cli/gaia wiki sync land --branch-aware` with an explicit Bash `timeout` of `600000`.

Exit codes:

- 0, landed (CLI summary line shows how)
- 1, refused (CLI stderr explains why; surface to user verbatim)
- 2, unexpected (surface to user; do NOT retry)

Do NOT inline branch logic, manual `gh pr` calls, or any push narrative. The CLI is authoritative.

The command is branch-aware: on `main`/`master` it cuts a branch, opens its own PR, and queues auto-merge; on any feature branch it commits in place. The no-arg `/gaia-wiki` full chain pre-cuts a `wiki-sync/<date>-<sha>` branch before sync runs, so this same step commits in place there and the chain opens one PR for all stages at the end. The wait mechanism and the in-session await belong to the parent router (`references/wiki.md`), not to this step; this step's obligations are unchanged.

## Step 8: Report

Print a brief summary:

```
Wiki sync complete.

  Range:    {baseline}..{head_sha}
  Total:    {N} commits
  Worthy:   {N_worthy}
  Skipped:  {N_skipped}
  Pages edited: {list}
  ADRs created: {list, if any}
  Classifier health: {Step 3b's warning, if any}
<!-- gaia:maintainer-only:start -->
  Leaks not repaired: {Step 5c.2's pre-existing lines, if any}
  Distribution answers owed: {Step 5c.4's list, if any}
<!-- gaia:maintainer-only:end -->
  State advanced to {head_sha}.
```

`{baseline}` is `state_sha` on the normal path and `suggested_base` on the recovery path, the ref the range was actually evaluated from.

Every field between `Pages edited:` and the state line is conditional: print it only when the step that owns it produced a value, and omit the whole line otherwise. `ADRs created:` already works this way, and `Classifier health:` is the same shape, owned by Step 3b. The two `gaia:maintainer-only` comment lines are not fields and are never printed: they bound the maintainer-only ones for the bundle scrub, here and in the 9d example alike.

**Those fields exist because this block is the only channel out.** The router dispatches this playbook as a subagent and asks it, literally, for the Step 8 summary block and the `CONSOLIDATE_TRIGGERED` line, and for nothing else. A line printed above or below the block is preamble or narration under that prompt, so a run that obeys its dispatch drops it and the signal reaches nobody. Anything a step needs to deliver to a human therefore rides inside this block, which is what these slots are for. A step that needs a new one adds a field here rather than printing beside the block.

(On the no-op path from Step 1's drift=0 branch: print `Wiki already in sync at {short_sha}.` instead of the block above.)

After the summary block, append the Step 9 result line `CONSOLIDATE_TRIGGERED: <true|false>` on its own line (no leading whitespace). The router (`references/wiki.md`) reads this to decide whether to invoke consolidate next.

## Step 9: Consolidate gate

Cheap precheck. Decides whether `/gaia-wiki consolidate` should fire next based on per-domain new-page accumulation since the last consolidate run.

### 9a. Read state

```bash
CONSOLIDATED_SHA=$(jq -r '.last_consolidated_sha // empty' wiki/.state.json)
HEAD_SHA=$(git rev-parse HEAD)
```

If `CONSOLIDATED_SHA` is empty (the bootstrap case from Step 6 wasn't reached because Step 6 was skipped on the drift=0 path AND no prior sync ever wrote the field): emit `CONSOLIDATE_TRIGGERED: false` and exit. Step 6 will bootstrap the field on the next non-zero-drift sync. Do not bootstrap from inside Step 9, keep this step read-only on the state file.

### 9b. Count added pages per domain

```bash
git diff --name-only --diff-filter=A -z "$CONSOLIDATED_SHA"..HEAD -- \
  wiki/decisions/ wiki/concepts/ wiki/modules/ wiki/flows/ wiki/components/ wiki/dependencies/ \
  | tr '\0' '\n'
```

`-z` and the `tr` back to newlines are both load-bearing, and the direction they fail in is a silent under-trigger. Under git's default `core.quotePath` a path carrying a non-ASCII byte prints C-quoted, so an added `wiki/concepts/Café.md` arrives as `"wiki/concepts/Caf\303\251.md"`. Its parent directory then reads as `"wiki/concepts`, a distinct key from the bare `wiki/concepts` its unquoted siblings group under, which splits one domain's pages across two keys and drops each below the threshold in 9c. `-z` turns the quoting off; the `tr` gives the grouping bare paths again.

Group the output by parent directory (the domain). Count pages per domain. Skip files in `wiki/_archived/` (handled by the path filter, `_archived/` is not in the list).

### 9c. Threshold check

If any single domain has ≥ 2 added pages since `CONSOLIDATED_SHA`: emit `CONSOLIDATE_TRIGGERED: true`. Otherwise: emit `CONSOLIDATE_TRIGGERED: false`.

The threshold rationale: cross-page redundancy emerges when multiple SPECs land in the same domain. One SPEC promoting to one domain has nothing to consolidate against. Two SPECs in the same domain is the minimum case where supersession or near-collision can occur.

### 9d. Append to summary

Add the trigger line to the report from Step 8. Example final summary on a triggered sync:

```
Wiki sync complete.

  Range:    abc123..def456
  Total:    5 commits
  Worthy:   3
  Skipped:  2
  Pages edited: wiki/decisions/auth-strategy.md, wiki/modules/Sessions.md
  ADRs created: wiki/decisions/auth-strategy.md
<!-- gaia:maintainer-only:start -->
  Distribution answers owed: wiki/decisions/auth-strategy.md  (run /distribution-audit on this branch before the PR merges)
<!-- gaia:maintainer-only:end -->
  State advanced to def456.

CONSOLIDATE_TRIGGERED: true
```

This example carries the conditional fields that happened to apply on that run. A run that created no page, or whose classifier reported nothing, omits the corresponding lines.

The router reads the last line and decides whether to invoke consolidate. The gate itself never invokes consolidate directly, it stays a read-only check.

### 9e. Edge cases

- **Drift=0 sync (no commits since last sync).** Gate still runs. The page-add count is computed against `last_consolidated_sha`, not against the sync's evaluation range, so accumulated adds from earlier syncs may still meet threshold.
- **Recovery re-anchor (Step 1, `suggested_base` resolved).** The run goes through the full pass, so Step 9 executes normally, the recovered range is evaluated and the gate counts page-adds as usual.
- **Fallback re-anchor (Step 1, `suggested_base` empty).** Step 1 exits before Step 9. After the fallback re-anchor, the next sync's Step 6 will preserve any existing `last_consolidated_sha`; the gate resumes counting from there. If the anchor change put `last_consolidated_sha` upstream of HEAD by an unreachable path, the next gate's `git diff` returns empty → `false`. Acceptable; the maintainer can run consolidate manually.
- **Consolidate's own commits in the diff.** If a previous consolidate run produced commits that landed (retirements moving pages to `wiki/_archived/`, near-collision renames inside an active domain), those appear in the next gate's diff. `_archived/` is excluded by path. Renames inside an active domain show as added paths and may trigger a redundant consolidate fire. Living with that, the false positive is cheap (consolidate runs, finds nothing new, advances state, returns).

## Failure modes

- **Mid-sync interruption.** If you've edited some pages but not all, do NOT advance state. Commit only the partial wiki edits with subject `wiki: partial sync (interrupted at {short_sha})` and stop. The next sync resumes from the original `last_evaluated_sha`, not the partial one.
- **Fabrication guard abort (Step 5b).** WORTHY commits were classified but the decided edits are absent from the working tree. State is not advanced and nothing is committed, so the next sync re-evaluates the same range from the unchanged `last_evaluated_sha`. Distinct from a mid-sync interruption: here the gap is between decided and written, not started and finished.
  <!-- gaia:maintainer-only:start -->
- **Boundary-check abort (Step 5c).** Generated prose points at a surface the adopter bundle does not carry, and three repair attempts did not clear it. State is not advanced and nothing is committed, so the next sync re-evaluates the same range. The authored pages stay in the working tree, staged, for the maintainer to repair by hand; the leak list names each file and line.
  <!-- gaia:maintainer-only:end -->
- **Merge conflict on `wiki/log.md`.** Two sync runs on different branches will both prepend to the log. Resolve by keeping both lines, sorted newest-first.
- **`wiki/.state.json` is corrupted or invalid JSON.** Stop and surface to the user. Do not auto-rewrite, they may have made manual edits worth preserving.
