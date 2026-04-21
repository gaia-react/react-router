# PLAN — GAIA ⇄ OLE Claude Integration Alignment

**Authored:** 2026-04-21 (Opus 4.7)
**Supersedes:** `.claude/handoff/HANDOFF-2026-04-21-gaia-ole-alignment.md` (archive when Phase 1 kicks off)
**Execute with:** Opus (this file's orchestrator role) + Sonnet (bulk edits) + Haiku (mechanical mirroring)

---

## Intent

Two-way alignment:

1. **GAIA → OLE** — take the recent Claude-integration improvements in GAIA (agent extensibility, `$PROJECT_ROOT` portability, new rules, new commands, wiki hooks, wiki-maintenance trigger) and apply them to OLE. OLE keeps all its project-specific surface: iOS/Swift agents + hooks + skills + rules, Supabase rule, Google API rule, monorepo layout, per-app `CLAUDE.md`.
2. **OLE → GAIA** — use OLE's divergence as a forcing function to make GAIA's Claude integration *extensible* enough that a future GAIA project evolving into something OLE-shaped (monorepo, external services, non-React stack) can do so without forking or rewriting Claude scaffolding.

OLE is a living example of where a GAIA project can end up. GAIA's Claude layer should anticipate that trajectory.

---

## Guardrails

- **Sequence GAIA before OLE.** GAIA lands its improvements and commits. Then OLE consumes a frozen GAIA reference. No moving target.
- **Pause at gap synthesis (Phase 2) for user review.** Some "gaps" may be intentional (GAIA deliberately ships without Swift, without Supabase). Don't act on the gap doc until the user approves what's in scope.
- **Don't overreach on monorepo.** GAIA stays single-app. The monorepo-related work is about making extension points *not break* in nested paths (`apps/web/.claude/...`) and documenting escape hatches. Not scaffolding a monorepo template.
- **Portable paths everywhere.** `$PROJECT_ROOT` / `${CLAUDE_PROJECT_DIR:-$(pwd)}` — no hardcoded `/Users/...` or project-name assumptions in any agent/hook/rule/skill that ships.
- **Wiki is the source of durable knowledge.** New patterns are documented in the relevant project's `wiki/`, not in memory files or ad-hoc READMEs.
- **Quality gate always applies.** Any phase that touches `*.ts/*.tsx/*.sh` runs the gate per `.claude/rules/quality-gate.md` before commit.
- **Separate PRs.** GAIA improvements = one PR. OLE migration = one PR (possibly split if it grows > ~30 files).

---

## Phase 0 — Setup (this session)

- [x] Write `PLAN.md` (this file)
- [ ] User reviews PLAN.md → gives go/no-go
- [ ] On go: archive the current handoff: `mv .claude/handoff/HANDOFF-2026-04-21-gaia-ole-alignment.md .claude/handoff/archive/`
- [ ] Clear context. Next session resumes from `PLAN.md`.

---

## Phase 1 — Parallel inventory (Sonnet × 2)

Goal: produce two structured inventories that feed the gap synthesis in Phase 2. These must be **self-contained reports** so Opus in Phase 2 doesn't need to re-read every file.

Dispatch in a **single message, two `Agent` calls** (both Sonnet, run concurrently).

### Agent 1.A — GAIA inventory

**Prompt outline:**
- Working dir: `/Users/stevensacks/Development/gaia/framework/react-router`
- Produce `PLAN-inventory-gaia.md` at the repo root with the following sections. For every item in every section, one line: `filename — what it does (1 sentence) — [tags: portability, extension-points, project-specific]`.
  - `.claude/agents/` (both `.md` and any extension directory)
  - `.claude/commands/`
  - `.claude/hooks/` (note matcher/event from `settings.json`)
  - `.claude/rules/`
  - `.claude/skills/` (just names + one-line purpose)
  - `.claude/settings.json` (summarize env + hook wiring)
  - `CLAUDE.md` (summarize key directives)
  - `wiki/` (top-level folders + hot.md/index.md/log.md shape)
- For each item, note whether it uses `$PROJECT_ROOT` / `CLAUDE_PROJECT_DIR` (portable) or has hardcoded paths.
- Explicitly identify the **extension points** already in GAIA (e.g. `.claude/agents/code-review-audit/` directory-based extensions; are there others?).

### Agent 1.B — OLE inventory

Same format, working dir: `/Users/stevensacks/Development/me/one-less-excuse`. Output: `PLAN-inventory-ole.md` at OLE repo root.

Additionally capture:
- Monorepo shape (`apps/web/`, `apps/ios/`, `supabase/`)
- Per-app `CLAUDE.md` files (root + `apps/web/CLAUDE.md` + `apps/ios/CLAUDE.md`)
- iOS/Swift-specific agents, hooks, rules, skills (flag as "project-specific, must be preserved")
- Supabase/Google API rules (flag as "external-service-specific, must be preserved")
- Anything in OLE that looks like it was copy-pasted from GAIA but not fully wired (per the user: they pasted `wiki-*` hooks and `wiki-maintenance.md` but haven't integrated or run them)

### Deliverable

Two markdown files at the root of each repo respectively. Phase 2 reads both.

---

## Phase 2 — Gap synthesis (Opus, **pause for user review**)

Opus reads both inventories. Produces `GAP.md` at the GAIA repo root with three sections:

### 2A — GAIA improvements (to make GAIA OLE-ready)

For each: what's missing/limiting in GAIA, why OLE's existence makes it matter, proposed change, scope (rule file / hook / agent / wiki page / all of the above), and effort (S / M / L). Candidate areas based on what I've already seen:

- **Agent extension mechanism generalized** — currently only `code-review-audit` has `.claude/agents/code-review-audit/*.md` extensions. OLE has 5 other agents (`apple-guidelines-audit`, `ios-accessibility-audit`, `ios-performance-audit`, `ios-security-audit`, `swift-code-review`, `uat-playwright`) with no extension hook. Should every agent GAIA ships support a sibling extension dir?
- **Skills extension mechanism** — the handoff flagged `skills/*/references/` as an existing but undocumented extensibility pattern. Formalize it: decide if/how `wiki-maintenance.md` should trigger on `skills/*/references/` changes. **Concrete forcing function: the TDD skill** (see §2D below).
- **Per-app CLAUDE.md convention** — document the pattern in GAIA's CLAUDE.md or a dedicated `wiki/modules/Claude Integration.md` page so a GAIA project that becomes a monorepo knows how to split.
- **Nested-path resilience** — audit every hook and rule for the assumption that `app/` is at repo root. Any hook checking `app/**/*.stories.tsx`, `app/languages/`, etc., will break when the frontend moves to `apps/web/app/`. Propose env-var or glob patterns that work in both.
- **External-service rule scaffolding** — OLE has `rules/supabase.md`. GAIA has no pattern for "add a rule when you add an external service". Propose a `rules/_external-services/` convention or a rule-authoring command.
- **Quality gate per stack** — OLE has `quality-gate-ios.md` alongside `quality-gate.md`. Does GAIA need a "quality gate discovery" pattern so multiple gates can coexist?
- **Wiki schema extensibility** — GAIA wiki is framework-focused (`modules/components/concepts/dependencies`). OLE's wiki added `brand/business/competitors/users/roadmap`. Document the convention for adding top-level wiki folders.
- **`/gaia-init` cleanup completeness** — `/gaia-init` removes itself. Does it also set up the wiki-start/stop hooks correctly for a fresh project? Verify.
- **Agent-memory portability** — any hardcoded paths in agent-memory lookups across all agents.

### 2B — OLE migration (what to pull from GAIA)

For each: which GAIA file, what OLE already has, what's missing, how to adapt for OLE's monorepo (`apps/web/`) and Swift/iOS presence. Candidates:

- **`code-review-audit.md` agent body rewrite** — extension-loading section, two-layer parallel dispatch, scope gates, parallel react-doctor. Per the existing handoff. Preserve OLE's Supabase/Google/superadmin dimensions.
- **Missing rules** — `accessibility.md`, `api-service.md`, `i18n.md`, `new-route.md`, `playwright.md`, `state-pattern.md`. Adapt any path assumptions for `apps/web/`.
- **Missing commands** — `new-component.md`, `new-hook.md`, `new-route.md`, `new-service.md`, `audit-code.md`, `setup-chromatic-mcp.md`. Adapt for `apps/web/` working directory.
- **Missing hooks** — `check-i18n-strings.sh`, `check-story-exists.sh`. Adapt path patterns.
- **`settings.json` hook wiring** — add the missing `PreToolUse` matchers for the new hooks. Preserve OLE's existing iOS/Supabase matchers.
- **Wire up already-pasted-but-unintegrated files** — per user, the `wiki-*` hooks and `wiki-maintenance.md` are pasted but not run. Verify wiring in `settings.json` and test.
- **Wiki concept page for Code Review Audit Agent** — needs the "extension mechanism" section listing OLE's 6 extensions (`supabase.md`, `google-api.md`, `conform.md`, `tailwind.md`, `react-i18next.md`, `form-components.md`).
- **Portable-path sweep** — any residual `gym-assistant` / `one-less-excuse` hardcoded paths in `.claude/**`.

### 2C — TDD skill: stack-aware refactor

The TDD skill is the sharpest concrete example of GAIA's skills needing to survive OLE-style stack growth. Call it out explicitly so it doesn't get lost in the "skills extension mechanism" bullet.

**Current state:**
- GAIA's `.claude/skills/tdd/` — forked/customized from Matt Pocock's MIT-licensed original, reshaped for Vitest + RTL + Storybook `composeStory` + MSW. `SKILL.md` reads "Test-Driven Development (GAIA)" and the layer table is React-only. Reference files: `tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md`.
- OLE's `.claude/skills/tdd/` — older copy of the same upstream (dates: Feb 2026). Diverged; does not reflect GAIA's customizations. User wants to discard this and consume GAIA's version — but only if GAIA's version isn't locked to React.

**Design decision to make in Phase 2:**

The philosophy (red-green-refactor, vertical slices, behavior-not-implementation, deep modules, mocking discipline) is stack-agnostic. The **layer table** and **examples** are stack-specific. Two options:

- **Option A — one SKILL.md, stack-selection inline.** `SKILL.md` carries core philosophy; a "Stacks" section branches on working directory (web/iOS/Supabase) with one subsection each. Pros: single file, easy to diff. Cons: grows unboundedly as stacks are added; violates the skills-as-lazy-references pattern.
- **Option B — SKILL.md core + stack reference files.** `SKILL.md` carries stack-agnostic TDD philosophy. Stack-specific layer tables, examples, mocking guidance live in `references/tests-react.md`, `references/tests-ios.md`, `references/tests-supabase.md`. The skill's trigger description notes "consult the reference matching your stack." Pros: matches the `skills/*/references/` pattern already emerging; new stacks = new reference file, no SKILL.md churn. Cons: splits files, requires a routing hint.

**Recommendation going in:** Option B. It's the concrete instance of the skills extension mechanism, and it makes the TDD skill durable across GAIA's single-stack life and OLE's multi-stack life. Finalize in Phase 2 review.

**Derived tasks:**
- Phase 3 (GAIA): refactor `.claude/skills/tdd/SKILL.md` — strip React-specific material to `references/tests-react.md`, leave philosophy + refactoring + deep-modules + interface-design at root. Add a short "Selecting a stack reference" section at the top. Delete OLE-irrelevant content only if it's already pure-React. **No attribution inside the skill** — it wastes model tokens on every invocation. The MIT-source credit already lives in GAIA's `README.md`; that's sufficient.
- Phase 4 (OLE): replace `.claude/skills/tdd/` wholesale with GAIA's refactored version, then add OLE-only reference files: `references/tests-ios.md` (Swift Testing or XCTest + SwiftUI snapshot conventions) and `references/tests-supabase.md` (edge function testing, pgTAP or Deno test, seed fixtures). These files are authored from scratch against OLE's actual test setup — audit what OLE uses before writing.

### 2C² — React Doctor: align OLE to GAIA's model

Decision already made: OLE matches GAIA exactly. No team or CI constraints — any engineer touching OLE is assumed to have run the same per-machine install a GAIA user runs in `/gaia-init`.

**GAIA pattern (target state for both projects):**
- Installed per-machine into `~/.claude/skills/` via the upstream install script
- Dispatched **in parallel** with the specialist subagents (single tool-call message, alongside the Agent calls)
- Invoked with `npx -y react-doctor@latest . --verbose --diff` — `--diff` scopes to changed files

**OLE current state (drift):**
- Vendored at `.agents/react-doctor/` (SKILL.md + AGENTS.md in-repo)
- Invoked **sequentially after** manual review
- No `--diff` — full-repo scan

**Derived tasks:**
- **Phase 3 (GAIA):** confirm `/gaia-init` step 9 install instructions are current and the upstream install-script URL resolves. No other changes.
- **Phase 4B (OLE agent rewrite):** baked into the rewrite — parallel dispatch, `--diff`, `@latest`. Non-negotiable.
- **Phase 4 (OLE, mechanical):** delete `.agents/react-doctor/` wholesale. Grep for any doc references to the vendored path and strip them.

### 2D — Items explicitly NOT in scope

List everything Opus considered but ruled out, with reason. Keeps the user's review focused.

### Review gate

**STOP.** User reads `GAP.md`, edits the scope (strikes items, adds items, changes effort estimates), signs off. Only then proceed to Phase 3.

---

## Phase 3 — GAIA improvements (Sonnet, concurrent where safe)

Work against GAIA repo on a branch `feat/claude-ole-readiness` (or similar).

Each sub-task becomes an Agent call. Group independent sub-tasks in a single message for parallelism. Sequential where a later task reads from an earlier one.

**Task types and model assignments:**

| Task | Model | Rationale |
|---|---|---|
| Write a new rule file | Sonnet | Structured prose with correctness-critical details |
| Generalize agent extension mechanism to more agents | Sonnet | Multi-file refactor, needs judgment |
| Add missing wiki pages documenting new patterns | Sonnet | Prose with wikilink cross-refs |
| Portable-path audit + fixes | Haiku | Mechanical grep + edit |
| Inventory diffs, checklist generation | Haiku | Mechanical |
| Sign-off on architectural choices | Opus (user in the loop) | Judgment, tradeoffs |

After each sub-task:
- Run the quality gate if source files are staged (`.claude/rules/quality-gate.md`)
- Commit with `feat(claude):` prefix
- Don't merge the branch yet

At end of Phase 3:
- Push branch, open PR against `main`
- Run `code-review-audit` agent on the diff per `.claude/rules/pr-merge-workflow.md`
- User reviews + merges

---

## Phase 4 — OLE migration (Sonnet + Haiku, sequential sub-phases)

Work against OLE repo on a branch like `claude/gaia-alignment`.

**4A — Portable paths + hook wiring (Haiku, ~15 min)**
- Sweep for hardcoded paths, fix in place
- Wire any paste-but-not-integrated files into `settings.json`
- Test: run `claude --resume` locally to verify hooks fire without errors
- Commit: `chore(claude): portable paths, hook wiring`

**4B — code-review-audit agent body rewrite (Sonnet, ~20 min)**
- Rewrite to mirror finalized GAIA structure
- Preserve OLE's Supabase/Google/superadmin review dimensions
- Preserve OLE's references to monorepo paths (`apps/web/` for React code)
- Commit: `feat(claude): extension-ready code-review-audit agent`

**4C — Missing rules + commands (Sonnet, ~30 min)**
- Copy + adapt each file identified in GAP 2B
- For monorepo: each rule/command that references `app/` should use `apps/web/app/` in OLE
- If OLE's existing analog exists but is stale (e.g. `storybook.md`, `tailwind.md`), diff-and-merge rather than overwrite
- Commit: `feat(claude): add GAIA-aligned rules and commands`

**4D — Missing hooks (Sonnet, ~15 min)**
- Copy `check-i18n-strings.sh`, `check-story-exists.sh`, adapt glob patterns for `apps/web/`
- Wire in `settings.json`
- Commit: `feat(claude): i18n and story-existence hooks`

**4E — Wiki concept page (Sonnet, ~10 min)**
- Create `wiki/app/dev-practices/Code Review Audit Agent.md` (or matching slot for OLE's wiki shape — check `wiki/index.md` first)
- Add "Extension mechanism" section listing all OLE extensions with one-line purpose each
- Update `wiki/index.md`, prepend `wiki/log.md` entry
- Commit: `wiki: document code-review-audit extension mechanism`

**4F — Verification (user-driven)**
- User runs `/pickup` in OLE — confirms hot cache updates correctly
- User runs `/audit-code` in `apps/web/` — confirms quality gate passes
- User runs `code-review-audit` agent manually — confirms extensions load, subagents dispatch in parallel
- User reviews full branch diff against main
- User merges

---

## Phase 5 — Cross-project consistency check (Haiku)

After both projects are merged, one final Haiku pass:

- Diff `ls .claude/{agents,commands,hooks,rules,skills}/` between GAIA and OLE
- For every OLE-extra file, verify it's legitimately project-specific (iOS, Supabase, Google API) — not an oversight
- For every GAIA file not in OLE, verify it's legitimately GAIA-only (unlikely — most should be mirrored)
- Produce `alignment-report.md` as deliverable

---

## Risk register

| Risk | Mitigation |
|---|---|
| Gap doc is too ambitious; scope blows up | Phase 2 review gate is the hard stop. User strikes items aggressively. |
| OLE's already-pasted files have drifted from what they paste from | Phase 1.B flags "pasted but unintegrated". Phase 4A reconciles against current GAIA state (post Phase 3). |
| Hook changes break both projects mid-session | Each hook-touching commit tested against `claude --resume` before the next commit |
| Monorepo path assumptions leak into GAIA | Phase 3 explicitly avoids mono-specific changes; ships glob/env-var patterns that work for both |
| Wiki log.md / hot.md thrash from auto-commits | `wiki-squash-autocommits.sh` already handles this; verify it's wired in OLE |
| A "mirror" turns into a rewrite and drifts | Each Phase 4 sub-task takes GAIA's file as input; diff-review before commit |

---

## Open questions (surface in Phase 2)

1. Does every agent get a sibling extension dir, or only review-type agents where rules vary by library?
2. Should `wiki-maintenance.md` trigger on `skills/*/references/` changes, and if so, where is that rule hosted?
3. Is per-app `.claude/` (e.g. `apps/web/.claude/`) a pattern we want, or does the monorepo stay with a single root `.claude/`?
4. Should `/gaia-init` grow a `--monorepo` flag, or stay focused on single-app init?

---

## Deliverables

- `PLAN.md` (this file) — checked in, deleted after Phase 5
- `PLAN-inventory-gaia.md`, `PLAN-inventory-ole.md` — Phase 1 outputs, deleted after Phase 2
- `GAP.md` — Phase 2 output, deleted after Phase 4
- `alignment-report.md` — Phase 5 output, archived to `.claude/handoff/archive/`
- Merged PR on GAIA (Phase 3) and OLE (Phase 4)

---

**To resume after context clear:** start with `/pickup` — the handoff-archive step in Phase 0 should be done before clearing, or `/pickup` will see the old handoff instead of this plan. If that happens, point it at `PLAN.md` directly.
