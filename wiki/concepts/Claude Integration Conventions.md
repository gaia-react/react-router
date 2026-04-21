---
type: concept
title: Claude Integration Conventions
status: active
created: 2026-04-21
updated: 2026-04-21
tags: [claude, meta, configuration]
---

# Claude Integration Conventions

> Not auto-loaded. Consult on demand when a Claude-integration retrofit is in scope.

Conventions for GAIA's Claude Code config surface: extension points, monorepo retrofit, service swaps, domain isolation. For the inventory of what currently exists in this project, see [[modules/Claude Integration|the modules page]].

## 1. Directory overview

| Directory / File | Purpose | Loaded |
|---|---|---|
| `.claude/agents/` | Named subagents (`.md` per agent); extension dirs for review-type agents | Manual (Task tool) |
| `.claude/commands/` | Slash commands (`/new-route`, `/gaia-init`, etc.) | Manual (slash invocation) |
| `.claude/hooks/` | Bash scripts wired in `settings.json` | Auto on matched tool events |
| `.claude/rules/` | Coding rules; optionally path-scoped via `paths:` frontmatter | Auto (global) or path-scoped |
| `.claude/skills/` | Context-triggered skills (`react-code`, `typescript`, etc.) | Auto on context/intent match |
| `.claude/agent-memory/` | Persistent agent memory (versioned, committed) | Auto per named agent |
| `wiki/` | Knowledge base — architecture, decisions, patterns | Manual (on-demand fetch) |

See [[modules/Claude Integration|the modules page]] for the inventory of current commands, rules, hooks, and skills.

## 2. Agent extensions (review-type agents only)

Review-type agents — agents that spawn multiple specialist subagents — support a directory-based extension mechanism. Single-subagent agents do not need it.

**Contract:** `.claude/agents/{agent-name}/*.md` files with `subagents:` and `library:` YAML frontmatter.

```yaml
---
subagents: [react-patterns, typescript]
library: package-name
---
```

At dispatch the agent Globs `*.md` in its extension directory (skipping `README.md`), reads each file, and injects its content into the matching specialist subagent's prompt. To swap a library: delete its extension file, add one for the replacement. The main agent definition stays unchanged.

Convention applies to **review-type agents only** — currently just `code-review-audit`. Cross-link: [[Code Review Audit Agent]].

## 3. Skill references convention

`SKILL.md` is stack-agnostic lazy philosophy — it auto-loads into context, so it must stay concise.

Stack-specific or deep-dive content lives in `references/{topic}.md` inside the skill directory, loaded on demand. `SKILL.md` signals available references via markdown links. Adding support for a new stack = add a new reference file; `SKILL.md` stays unchanged.

Example: `skills/tdd/SKILL.md` links to `skills/tdd/references/tests-react.md`. A new Svelte reference would go in `skills/tdd/references/tests-svelte.md`.

Skill descriptions should hint at available references when useful.

Cross-link: [[Claude Skills]].

## 4. Rule `paths:` frontmatter

Rules in `.claude/rules/*.md` with a `paths:` YAML list auto-load **only** when a matching file is in scope. Rules without `paths:` auto-load every session. Keep the always-load list tight.

```yaml
---
paths:
  - 'app/pages/**/*'
  - 'app/components/**/*'
---
```

Examples of path-scoped rules: `i18n.md` (pages + components + languages), `new-route.md` (routes + pages), `state-pattern.md` (state directory). Always-load rules: `quality-gate.md`, `coding-guidelines.md`.

## 5. Monorepo retrofit playbook

**Container folder name is a project decision** — `apps/`, `projects/`, `packages/`, etc. Substitute `{CONTAINER}/{APP}` throughout.

Steps (all mechanical):

1. **Update `paths:` globs in rules** — prefix every `app/…` glob with `{CONTAINER}/{APP}/`. Example: `app/state/**/*` → `apps/web/app/state/**/*`.
2. **Update hook script regexes** — the advisory hooks match on file paths:
   - `check-i18n-strings.sh` — regex on `app/(pages|components)/…`
   - `check-story-exists.sh` — regex on `app/components/…`
   - `block-eslint-config-edit.sh` — already path-agnostic post GAP §2A-1; no change needed.
3. **Update scaffolding templates** — in `.claude/commands/new-*.md`, path outputs must become `{CONTAINER}/{APP}/app/…`.
4. **Split CLAUDE.md** — add a per-app `CLAUDE.md` at `{CONTAINER}/{APP}/CLAUDE.md` with stack-specific commands; keep root `CLAUDE.md` as the monorepo overview (see §9).
5. **Verify hook scripts** — confirm no script hardcodes a specific container folder name. If found, fix.
6. **Leave wiki hooks alone** — `wiki-session-start.sh` / `wiki-session-stop.sh` are git-level and path-agnostic.

## 6. External-service rule pattern

When adding an external service (Supabase, Firebase, Stripe, Auth0, etc.):

- Add `.claude/rules/{service}.md` with `paths:` scoped to directories touching the service.
- Optionally add `.claude/agents/code-review-audit/{service}.md` with `subagents:` frontmatter for specialist review hooks.
- Document the service in `wiki/dependencies/{Service}.md`.

## 7. Per-stack quality gate

Multiple gates coexist via path scoping:

- `.claude/rules/quality-gate.md` — shared/default gate (stack-neutral, always loaded)
- `.claude/rules/quality-gate-{stack}.md` — stack-specific gate with `paths:` frontmatter

Each gate defines its own runner commands. The default `quality-gate.md` stays stack-neutral and delegates to stack-specific gates. Cross-link: [[Quality Gate]].

## 8. API service layer swap

When replacing the default API layer (Ky + Zod) with Supabase, Firebase, GraphQL, or another REST client:

1. Delete or archive `.claude/rules/api-service.md` (GAIA's default Ky pattern).
2. Delete `.claude/commands/new-service.md` if it scaffolds the outgoing pattern.
3. Add `.claude/rules/{new-service}.md` with `paths:` scoped to affected directories.
4. Add `.claude/agents/code-review-audit/{new-service}.md` with `subagents: [react-patterns, typescript]`.
5. Update `{CONTAINER}/{APP}/CLAUDE.md` (or root) with dev-server commands for the new service.
6. Update `test/mocks/` — remove MSW handlers that shimmed the old layer if the new layer has its own test fakes.

## 9. Per-app CLAUDE.md hierarchy (monorepo)

GAIA ships single-app; do not preemptively split `CLAUDE.md`. When monorepo-converting:

- **Root `CLAUDE.md`** — monorepo overview, cross-cutting rules (wiki, memory discipline).
- **`{CONTAINER}/{APP}/CLAUDE.md`** — per-app stack specifics, dev commands, local env notes.

Loading is cwd-based: the closest-up `CLAUDE.md` wins per Claude Code's convention.

## 10. Domain isolation (MANDATORY)

The governing rule from root `CLAUDE.md`: **don't cross-load domains.**

- Technical work → `wiki/app/` + related technical folders only.
- Brand/business work → `wiki/brand/`, `wiki/business/` only.
- Only cross-load when the task genuinely spans both.

When adding new wiki top-level folders, keep them single-domain. Claude must refuse to auto-include cross-domain content during normal operation. When in doubt, ask rather than load.

See root `CLAUDE.md` § Wiki for the authoritative directive.

## 11. React Doctor (per-machine install)

Do **not** vendor `react-doctor` into the repo. Do not symlink it. Install per-machine via the upstream install script, invoked by `/gaia-init`.

The `code-review-audit` agent dispatches react-doctor **in parallel** with its specialist subagents:

```bash
npx -y react-doctor@latest . --verbose --diff
```

`--diff` scopes the scan to changed files, keeping pre-merge passes cheap.

---

## Cross-links

[[Code Review Audit Agent]] · [[Claude Skills]] · [[Claude Hooks]] · [[Quality Gate]] · [[Pre-commit Hooks]]
