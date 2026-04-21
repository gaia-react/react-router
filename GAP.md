# GAP — GAIA ⇄ OLE Alignment

**Authored:** 2026-04-21 (Opus 4.7, Phase 2)
**Inputs:** `PLAN.md` (intent), `PLAN-inventory-gaia.md`, `/Users/stevensacks/Development/me/one-less-excuse/PLAN-inventory-ole.md`
**Status:** AWAITING USER REVIEW — do not begin Phase 3 until user signs off on scope.

---

## How to review this document

For each item in §2A and §2B: **strike, keep, or defer**. Add effort overrides if any estimate feels wrong. For §2C, pick A or B. §2C² and §2D are non-controversial recaps — skim for objection. §3 collects open questions only you can answer.

Reply format that the next Opus will consume cleanly:

```
2A-1 keep M
2A-2 strike — reason: ...
2A-3 keep L
2B-1 keep
...
2C option-B
2E-Q1: review-type agents only
```

---

## 2A — GAIA improvements (make GAIA OLE-ready)

Each item: **what's missing**, **why OLE proves it matters**, **proposed change**, **scope**, **effort** (S ≤30 min, M ~1 hr, L >2 hr).

### 2A-1 — Fix `block-eslint-config-edit.sh` wrong-path bug — S

**Missing:** The hook hardcodes `apps/web/eslint.config.mjs`. GAIA's eslint config is at repo root (`eslint.config.mjs`), so the hook **never fires in GAIA**. This is a latent bug introduced by a copy-paste from a monorepo context.

**Why OLE proves it:** OLE's version works correctly because OLE actually has `apps/web/eslint.config.mjs`. GAIA silently imported the monorepo assumption.

**Proposed change:** Make the hook detect both layouts — check if `apps/web/eslint.config.mjs` OR `eslint.config.mjs` OR `eslint.config.js/cjs/ts` at repo root is being edited, and block any of them. Portable via `$CLAUDE_PROJECT_DIR`.

**Scope:** `.claude/hooks/block-eslint-config-edit.sh`.

---

### 2A-2 — Generalize the agent extension-directory mechanism (scoped) — M

**Missing:** Only `code-review-audit.md` reads a sibling `code-review-audit/` directory for library-specific extensions. OLE has six other agents (`apple-guidelines-audit`, `ios-*-audit` × 3, `swift-code-review`, `uat-playwright`) with no extension hook. The pattern is informally obvious but not formalized.

**Why OLE proves it:** As soon as a project grows a second review-type agent (say an iOS `swift-code-review`), it needs the same "inject library-specific rules" capability. OLE had to reinvent it inline inside agent bodies instead of using a shared pattern.

**Proposed change:** Formalize the mechanism as a **documented convention**, not a code change to each agent. Ship one file: `wiki/concepts/Agent Extensions.md` that defines the contract (`.claude/agents/{agent-name}/*.md` with `subagents:` frontmatter). Update `code-review-audit/README.md` to reference it. When adding new GAIA agents in future, follow the convention — don't retrofit the existing six in OLE as part of this PR.

**Decision point for Q1:** Is the extension dir convention for **review-type agents only** (agents that spawn specialist subagents) or **every agent**? Recommendation: review-type only. Single-subagent agents don't need it.

**Scope:** New wiki page + small edit to existing `README.md`.

---

### 2A-3 — TDD skill: extract React-specific content to `references/tests-react.md` — M

**Missing:** GAIA's `SKILL.md` (123 lines), `tests.md` (145 lines), and `mocking.md` (68 lines) are all React/Vitest/MSW-specific. A stack-agnostic philosophy lives inside them but is entangled with `composeStory`, `renderHook`, `react-router`, `react-i18next`. A non-React consumer (OLE iOS, Supabase edge function) cannot use this skill without forking.

**Why OLE proves it:** OLE dropped the vendored GAIA TDD skill entirely and symlinked to an older generic upstream, because the GAIA version didn't fit three stacks. A GAIA project that ever adds a non-React stack hits the same wall.

**Proposed change (Option B from PLAN §2C):**
- Keep `SKILL.md` as stack-agnostic philosophy (red-green-refactor, vertical slices, behavior-not-implementation). Add a short "Selecting a stack reference" section that says: "consult `references/tests-{stack}.md` for your stack."
- Keep `deep-modules.md`, `interface-design.md`, `refactoring.md` at root — already stack-agnostic.
- Move React-specific material out of `SKILL.md`, `tests.md`, `mocking.md` into `references/tests-react.md`.
- Delete the now-empty `tests.md` and `mocking.md` OR keep them as thin stack-agnostic overviews that point to the reference (pick one in implementation; my default: delete, consolidate everything into `references/tests-react.md`).
- No attribution inside the skill body — MIT credit already lives in `README.md`.

**Scope:** `.claude/skills/tdd/SKILL.md`, `tests.md`, `mocking.md`, new `references/tests-react.md`.

---

### 2A-4 — Nested-path resilience (monorepo awareness, minimal) — S

**Missing:** Ten rule files reference `app/` as if repo root. When a GAIA project becomes a monorepo (`apps/web/app/`), the auto-load `paths:` globs stop matching.

**Why OLE proves it:** OLE's rules all use `apps/web/app/**` instead of `app/**`. This divergence means you can't just copy a GAIA rule into OLE — you have to hand-rewrite every glob.

**Proposed change:** Two options, pick one:
- **A (recommended):** Document the monorepo retrofit as a single-page playbook in `wiki/concepts/Claude Integration.md`: "When a project monorepos, prefix all `paths:` globs in `.claude/rules/*.md` with `apps/{app-name}/`." No code change. Low cost.
- **B:** Ship glob patterns that match both (`**/app/**` instead of `app/**`). Risk: over-matches in packages that happen to have an `app/` directory.

**Recommendation:** A. Don't pay complexity tax for monorepo paths that GAIA itself will never use.

**Scope:** New wiki page OR updated CLAUDE.md section.

---

### 2A-5 — External-service rule convention — S

**Missing:** GAIA has no guidance for "we added an external service, where does its rule live?" OLE has `rules/supabase.md` and `code-review-audit/google-api.md` — two different extension points for external services.

**Why OLE proves it:** Any GAIA project that adds Supabase/Firebase/Auth0/Stripe will need both (a) a `rules/` file for conventions and (b) optionally a `code-review-audit/` extension for library-specific review checks. The convention is two-tiered and undocumented.

**Proposed change:** One paragraph in `wiki/concepts/Claude Integration.md`: "For external services, add `rules/{service}.md` with `paths:` scoped to directories touching the service, and optionally `.claude/agents/code-review-audit/{service}.md` with `subagents:` frontmatter for specialist review hooks." No new code.

**Scope:** Same wiki page as 2A-4.

---

### 2A-6 — Per-stack quality gate pattern — S

**Missing:** GAIA has one `quality-gate.md`. OLE has `quality-gate.md` AND `quality-gate-ios.md` with `paths:` frontmatter scoping each. The convention "multiple gates can coexist, discriminated by path" is only demonstrated in OLE, not documented.

**Why OLE proves it:** A GAIA project that adds any second stack (native, WASM, server-only) needs this pattern and will reinvent it.

**Proposed change:** One bullet in the new `wiki/concepts/Claude Integration.md`: "Add a `quality-gate-{stack}.md` with `paths:` scoped to that stack's tree. Each gate defines its own runner commands. CLAUDE.md's `Quality Gate Process` rule stays stack-neutral and delegates."

**Scope:** Same wiki page.

---

### 2A-7 — Wiki schema extensibility — S

**Missing:** GAIA wiki is dev-focused (`modules/components/concepts/dependencies/decisions/flows/entities/sources/meta`). OLE added `brand/business/competitors/users/roadmap/app/`. No documented convention for when to add a top-level folder.

**Why OLE proves it:** OLE's vault shape is what a "real product" wiki looks like. GAIA's template should signal "this structure is a starting point; add folders for your domain."

**Proposed change:** Short paragraph in `wiki/CLAUDE.md` (if present; inventory shows GAIA has `wiki/CLAUDE.md` with vault schema) OR in `wiki/index.md` header: "Top-level folders are domains. Add `brand/`, `business/`, `roadmap/` as the project grows. Register every top-level folder in `wiki/index.md`."

**Scope:** Edit existing `wiki/index.md` header.

---

### 2A-8 — `/gaia-init` wiki hook verification — S

**Missing:** Plan §2A flagged "does `/gaia-init` set up wiki hooks correctly for a fresh project?" Unverified.

**Why OLE proves it:** OLE's wiki hooks are wired correctly in `settings.json` (inventory §4). If GAIA ships the same set, a fresh GAIA project needs them present at init.

**Proposed change:** Read `gaia-init.md` + confirm it (a) leaves the three `wiki-*.sh` hooks in place and (b) leaves the `SessionStart` + `Stop` matchers wired. Document in the init command's verification step. No behavioral change expected; this is a spot-check with a tiny doc update if a gap surfaces.

**Scope:** `.claude/commands/gaia-init.md` verification step.

---

### 2A-9 — Document skill `references/` as formal extension pattern — S

**Missing:** Three GAIA skills (`react-code`, `typescript`, `playwright-cli`) use `references/` for lazy-loaded content. Three don't (`tdd`, `tailwind`, `skeleton-loaders`). No rule says "references/ is how skills extend."

**Why OLE proves it:** The TDD refactor in 2A-3 **is** the references/ pattern applied to the right skill. Formalizing the pattern once means future stack adds (Supabase, iOS) follow it automatically.

**Proposed change:** One paragraph in `wiki/concepts/Claude Skills.md` (GAIA inventory shows this page exists in `wiki/concepts/`): "Skill-specific content that varies by stack/context lives in `references/{topic}.md`. `SKILL.md` stays small and lazy-loads references via markdown links. The skill trigger description should hint at available references."

**Also:** decide whether `wiki-maintenance.md` should mention `skills/*/references/` as a "what warrants a wiki update" category. Recommendation: **no** — references are skill-internal and don't need wiki mirroring.

**Scope:** Edit existing `wiki/concepts/Claude Skills.md`.

---

### 2A-10 — STRUCK: Agent-memory portability audit

Inventory §1 shows `agent-memory/code-review-audit/MEMORY.md` has no hardcoded paths. Only `code-review-audit` uses agent memory today. Nothing to fix.

---

### 2A-11 — STRUCK: Generalize extension mechanism to non-review agents

Discussed in 2A-2. Not every agent needs extensions. Keeping it scoped to review-type agents.

---

### 2A-12 — Add `wiki/concepts/Claude Integration.md` — M (aggregator)

**Missing:** The consolidation page that 2A-4, 2A-5, 2A-6 all point at. Not currently present.

**Why OLE proves it:** Four conventions emerged from the inventory diff (monorepo path retrofit, external-service rule pattern, per-stack quality gates, per-app CLAUDE.md hierarchy). Without a single home, they get lost across individual rule files.

**Proposed change:** Create `wiki/concepts/Claude Integration.md` with sections:
1. Directory overview (`.claude/{agents,commands,hooks,rules,skills}/`, `wiki/`, `agent-memory/`)
2. Agent extensions (points to `code-review-audit/README.md`; notes convention)
3. Skill references convention (§2A-9)
4. Rule `paths:` frontmatter (already in rule files; consolidates into one reference)
5. Monorepo retrofit (§2A-4)
6. External-service conventions (§2A-5)
7. Per-stack quality gates (§2A-6)
8. Per-app CLAUDE.md hierarchy (briefly — GAIA doesn't ship it, OLE demonstrates it)

Register in `wiki/index.md`.

**Scope:** New wiki page ~100–150 lines.

---

## 2B — OLE migration (pull from GAIA, preserve OLE-specific surface)

### 2B-1 — Rewrite `code-review-audit.md` body to finalized GAIA structure — L

OLE's agent body is mid-generation. GAIA has: extension-loading section, two-layer parallel dispatch, scope gates, parallel `react-doctor` via `npx -y react-doctor@latest . --verbose --diff`, agent-memory write-up.

Preserve OLE-specific: Supabase server-client pattern, Google API + cachified, PKCE callback route constraint, superadmin privileges, OLE's existing "Project-Specific Rules" section.

Fix the hardcoded `/Users/stevensacks/.claude/projects/…/` path on line 270.

---

### 2B-2 — Remove `.agents/react-doctor/` vendored copy (if present) — S

PLAN §2C² asserts OLE vendored react-doctor at `.agents/react-doctor/`. **Inventory §6 does not confirm this path exists** — inventory only mentions `.claude/skills/tdd` and `.claude/skills/swiftui-pro` as symlinks to `~/.agents/skills/`. Before Phase 4, grep OLE for `.agents/react-doctor` — if absent, strike this item; if present, delete the directory and grep for doc references.

---

### 2B-3 — Pull missing rules from GAIA — M

Candidates (adapt path globs to `apps/web/app/**` for OLE):
- `playwright.md` — OLE has Playwright but no rule (confirmed)
- `state-pattern.md` — React Context pattern (confirmed missing)
- `new-route.md` — thin-route architecture (confirmed missing from OLE inventory)
- `i18n.md` — confirmed missing
- `accessibility.md` — confirmed missing
- `api-service.md` — confirmed missing (OLE may have service pattern elsewhere; verify before copy to avoid duplication)

For `storybook.md`, `tailwind.md`, `test-runner.md`: OLE has these. Diff-and-merge, don't overwrite.

---

### 2B-4 — Pull missing commands from GAIA — M

OLE is missing: `new-component.md`, `new-hook.md`, `new-route.md`, `new-service.md`, `audit-code.md`, `setup-chromatic-mcp.md`. Adapt all working-directory assumptions to `apps/web/` for OLE.

OLE has: `audit-knowledge.md`, `handoff.md`, `migrate.md`, `pickup.md` (confirmed aligned), plus `dev.md`, `seed-exercise-images.md`, `update-react-router.md`, `work-log.md` (OLE-specific, preserve).

---

### 2B-5 — Pull missing hooks + wire in settings.json — S

Copy `check-i18n-strings.sh` and `check-story-exists.sh` to OLE's `.claude/hooks/`. Adapt regex paths to `apps/web/app/(pages|components)/...` and `apps/web/app/components/[^/]+/index.tsx`. Add two `PreToolUse` / `Edit|Write` entries to `settings.json`.

Do NOT port `intercept-init.sh` — OLE has no `gaia-init` skill, nothing to intercept.

---

### 2B-6 — Update OLE's `wiki-maintenance.md` — S

OLE's copy is stale (missing code-review-audit extension bullet + audit-knowledge reminder). Sync to GAIA's current version. Leave OLE's existing text otherwise intact.

---

### 2B-7 — Create `wiki/app/dev-practices/Code Review Audit Agent.md` in OLE — M

(Or slot matching OLE's wiki shape — verify against `wiki/index.md`.) Include the "Extension mechanism" section listing all OLE extensions (`supabase.md`, `google-api.md`, `conform.md`, `tailwind.md`, `react-i18next.md`, `form-components.md`) with one-line purpose each. Update `wiki/index.md`, prepend `wiki/log.md` entry.

---

### 2B-8 — Portable-path sweep — S

Fix (from inventory §10, §11):
- `.claude/agents/code-review-audit.md` line 270: replace machine-local transcript path with `$PROJECT_ROOT`-based path or remove
- `.claude/commands/work-log.md`: replace `~/.claude/projects/-Users-stevensacks-Development-me-one-less-excuse/*.jsonl` with `${CLAUDE_PROJECT_DIR:-$(pwd)}` + dynamic project-dir encoding (or accept that work-log is machine-local-by-design and document it)
- `.claude/settings.json`: replace `~/Development/me/one-less-excuse/.simulator-mcp` with `${CLAUDE_PROJECT_DIR}/.simulator-mcp` (or equivalent expansion pattern the harness supports)
- `.claude/settings.local.json`: **open question** — should it be gitignored? Currently committed with 10+ hardcoded paths. See §2E-Q6.

---

### 2B-9 — Vendor or document symlinked skills — S

`.claude/skills/tdd` and `.claude/skills/swiftui-pro` are symlinks to `~/.agents/skills/` — broken for any other clone. Two options:
- **Vendor:** copy content into `.claude/skills/{tdd,swiftui-pro}/` (replace symlinks with real dirs). This is what GAIA does with its TDD skill.
- **Document + install script:** keep the symlinks; add a bootstrap script that creates the targets on fresh clone (e.g. `scripts/install-skills.sh` referencing `skills-lock.json`).

**Recommendation:** Vendor. It aligns OLE with GAIA, makes the repo self-sufficient, and the skill content is small.

For `tdd`: after GAIA ships 2A-3, OLE adopts the new GAIA layout (SKILL.md + references/tests-react.md) and adds `references/tests-ios.md` + `references/tests-supabase.md` authored from scratch.

---

## 2C — TDD skill design decision

**Restated for explicit sign-off.** Two options from PLAN §2C:

- **Option A** — one `SKILL.md` with inline stack-selection section. Grows unboundedly; single-file; simple.
- **Option B** — `SKILL.md` is stack-agnostic philosophy; stack-specific content in `references/tests-{stack}.md`. Matches the references/ pattern; new stacks = new reference file; requires a routing hint in `SKILL.md`.

**Recommendation:** **Option B**. It's the forcing function that proves §2A-9 (formal skill-references convention) is real.

**Needs explicit pick:** `2C option-A` or `2C option-B`.

---

## 2C² — React Doctor alignment (recap)

Per PLAN §2C², already decided. OLE mirrors GAIA:
- Installed per-machine via upstream install script (invoked in `/gaia-init` step 9)
- Dispatched in parallel with specialist subagents (single tool-call message alongside the `Agent` calls)
- Invoked with `npx -y react-doctor@latest . --verbose --diff`

**Phase 3 (GAIA):** verify `/gaia-init` step 9 install-script URL still resolves.
**Phase 4B (OLE):** baked into agent rewrite.
**Phase 4 (OLE):** delete `.agents/react-doctor/` IF PRESENT (see §2B-2 caveat).

No sign-off needed unless you want to revisit.

---

## 2D — Explicitly OUT of scope

Considered and ruled out:

1. **Porting iOS agents to GAIA.** GAIA is React web. Apple HIG, Swift review, iOS security audits stay OLE-only.
2. **Porting Supabase/Google-API extensions to GAIA.** External-service couplings. GAIA ships a documented *pattern* (§2A-5), not pre-built service rules.
3. **Monorepo conversion of GAIA.** Single-app stays single-app. We document the retrofit (§2A-4) for projects that evolve.
4. **Porting OLE wiki domains (brand/business/competitors/users/roadmap) to GAIA.** GAIA is a template, not a product. We document that these folders are legitimate additions (§2A-7).
5. **Porting OLE's `work-log/`, `skills-lock.json`, `.claude/audit/` to GAIA.** Project-level conventions OLE needs, GAIA doesn't.
6. **`/gaia-init --monorepo` flag.** Out of scope. Single-app init is enough; monorepo retrofit is manual per §2A-4 playbook.
7. **Retrofitting extension dirs onto OLE's six existing agents (apple-guidelines-audit, ios-*-audit × 3, swift-code-review, uat-playwright).** None currently need library-specific extensions. Add extension dirs lazily if/when a second library needs custom rules in a given agent.
8. **Per-app `.claude/` directories** (e.g. `apps/web/.claude/`). OLE keeps a single root `.claude/`. We don't recommend splitting; see §2E-Q3.
9. **Portable fix for `swift-lint-format.sh` + other OLE iOS hooks.** They're correctly scoped to `apps/ios/` already; not a gap.
10. **Rewriting OLE's `.claude/skills/swiftui-pro`.** iOS-specific, out of GAIA's scope; only question is vendor-vs-symlink (§2B-9).

---

## 2E — Open questions for user

**These are blocking — answer inline in review.**

- **Q1:** Agent extension-dir convention scope — **review-type agents only** or **every agent**? *Recommendation: review-type only.*
- **Q2:** Should `wiki-maintenance.md` trigger on `skills/*/references/` changes? *Recommendation: no — skill-internal, no wiki mirror needed.*
- **Q3:** Per-app `.claude/` directories (e.g. `apps/web/.claude/`)? *Recommendation: no, stay single-root; document the retrofit.*
- **Q4:** `/gaia-init --monorepo` flag? *Recommendation: no.*
- **Q5:** Vendor symlinked skills in OLE (`tdd`, `swiftui-pro`) or keep symlinks + install script? *Recommendation: vendor.*
- **Q6:** Is `settings.local.json` supposed to be committed? GAIA doesn't commit it; OLE commits a machine-local version with 10+ hardcoded paths. *Recommendation: add `.claude/settings.local.json` to `.gitignore` in both projects; remove the committed copy from OLE.*

---

## Risk adjustments vs PLAN.md §Risk register

- **New risk:** 2B-2's assumption about `.agents/react-doctor/` may be wrong. Mitigation: verify in Phase 4, not Phase 3.
- **Heightened risk:** 2A-3 TDD refactor could conflict with in-flight OLE work if Phase 3 and Phase 4 overlap in time. Mitigation already in PLAN.md: sequence GAIA before OLE, no moving target.
- **Reduced risk:** "wiki log.md / hot.md thrash" — both repos have `wiki-squash-autocommits.sh` wired; confirmed by inventories.

---

## Phase 3 readiness checklist

Before executing Phase 3, all of the following must be done:

- [ ] User strikes/keeps items in §2A and §2B
- [ ] User picks Option A or B for §2C
- [ ] User answers Q1–Q6 in §2E
- [ ] User approves overall effort scope
- [ ] Next session resumes against this `GAP.md` + `PLAN.md`

Only then: Sonnet starts Phase 3 work on branch `feat/claude-ole-readiness`.

---

**STOP.** User review required.

---

## Decisions locked (user review, 2026-04-21)

### 2A
- **2A-1 keep** — but playbook in 2A-4 must cover updating this hook post-monorepo-conversion (container folder name is variable, not always `apps`).
- **2A-2 keep** — review-type agents only.
- **2A-3 keep** — Option B (confirmed in §2C).
- **2A-4 keep** — but the playbook page must **NOT** auto-load into CLAUDE.md. Only loads when monorepo conversion is explicitly requested. Must handle arbitrary container folder names (`apps`, `projects`, etc.).
- **2A-5 keep**.
- **2A-6 keep**.
- **2A-7 keep** — extra emphasis: **domain isolation is mandatory**. Coding work must not load brand/business wiki, and vice versa. The existing CLAUDE.md directive ("Don't cross-load domains") is the governing rule; document it in the new Claude Integration page.
- **2A-8 keep**.
- **2A-9 keep**.
- **2A-12 keep** (aggregator page).

### 2B
- **2B-1 keep**.
- **2B-2 deferred** — user clarified OLE has react-doctor symlinked; Phase 4 removes the symlink and requires per-machine install via `/gaia-init` (mirroring GAIA). No vendored `.agents/react-doctor/` to delete (PLAN.md §2C² assumption was stale).
- **2B-3 keep, with adjustments:**
  - `playwright.md` rule — add missing `paths:` frontmatter (it only just shipped today and was overlooked). Stays a rule, not a skill.
  - `state-pattern.md` rule — add missing `paths:` frontmatter.
  - `api-service.md` rule — **do not port to OLE**. OLE replaced GAIA's Ky service layer with Supabase + Google API. The "when a project swaps API service layer, what Claude config must adjust" case becomes a **playbook entry** in the new `wiki/concepts/Claude Integration.md` (same category as monorepo retrofit).
- **2B-4 keep, with adjustment:** OLE's `update-react-router.md` is an older version of `migrate.md`. Gap: `migrate.md` is missing the CHANGELOG verification step `update-react-router.md` has. Phase 3 adds that step to GAIA's `migrate.md`. Phase 4 deletes OLE's `update-react-router.md`.
- **2B-5 keep**.
- **2B-6 keep**.
- **2B-7 keep**.
- **2B-8 keep**.
- **2B-9 keep** — vendor `tdd` and `swiftui-pro` in OLE. React-doctor is different: NOT vendored, installed per-machine via `/gaia-init` (as GAIA does).

### 2C
- **Option B** confirmed.

### 2E (open questions)
- **Q1** review-type agents only.
- **Q2** no wiki-maintenance trigger for `skills/*/references/`.
- **Q3** no per-app `.claude/` directories.
- **Q4** no `--monorepo` flag.
- **Q5** vendor symlinked skills in OLE (`tdd`, `swiftui-pro`); react-doctor handled via per-machine install per §2C².
- **Q6** gitignore `.claude/settings.local.json` + remove committed copy from OLE.

### New items surfaced by user
- **2A-13 new** — add "API service swap" playbook to `wiki/concepts/Claude Integration.md` (rides along with 3E).
- **2A-14 new** — `wiki/concepts/Claude Integration.md` must be marked as "do not auto-load"; index entry + CLAUDE.md explicitly excludes it from preload.

Phase 3 readiness: **GO.** Branch: `feat/claude-ole-readiness`.
