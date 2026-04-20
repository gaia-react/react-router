---
type: meta
title: Log
updated: 2026-04-20
---

# Log

Append-only. New entries at the TOP.

## [2026-04-20] delete | Phase D — remove entire auth stack

Deleted all auth code: `app/routes/_auth+/`, `app/routes/_session+/profile+/`, `app/routes/actions+/logout.ts`, `app/services/gaia/auth/`, `app/services/gaia/user/`, `app/sessions.server/auth.ts`, `app/pages/Auth/`, `app/pages/Session/`, `app/state/user.tsx`, `app/languages/{en,ja}/auth.ts`, `app/languages/{en,ja}/pages/profile/`, `test/mocks/auth/`, `test/mocks/user/`, `wiki/flows/Auth Flow.md`, `wiki/dependencies/remix-auth.md`. Dropped deps: `remix-auth`, `remix-auth-form`, `spark-md5` (+ `@types/spark-md5`). `app/routes/_session+/_layout.tsx` rewritten as minimal stub preserving the folder as a hook point for consumer auth guards. `app/state/index.tsx` trimmed to `ThemeProvider` only; `UserProvider` and `User` type removed. Form components `InputEmail`/`InputPassword` migrated default label namespace from `auth` → `common`; `email`, `emailPlaceholder`, `password` keys added to both `en/common.ts` and `ja/common.ts`. `database.user` factory and `resetTestData` deleted from `test/mocks/database.ts` (orphaned after auth removal). `SESSION_SECRET` retained in env — still used by `remix-toast`, theme cookie, and language cookie. Wiki updated: [[Sessions]] rewritten for theme/language only, [[Routing]] documents `_session+/` hook point, [[State]]/[[Services]]/[[Pages]]/[[overview]]/[[GAIA Philosophy]]/[[Folder Structure]]/[[React Router 7]] surgically cleaned.

## [2026-04-20] delete | Phase C — remove all non-auth example/teaching code

Deleted the `things` service and all associated example code: `app/services/gaia/things/`, `app/components/ExampleConsumer/`, `app/state/example.tsx`, `app/pages/Public/Things/`, `app/pages/Public/IndexPage/Examples/`, `app/pages/Public/IndexPage/TechStack/`, `app/routes/_public+/things+/`, `app/languages/{en,ja}/pages/things.ts`, `test/mocks/things/`, `.playwright/e2e/things.spec.ts`, `.react-router/`. Rewired all dependents: `app/state/index.tsx` (ExampleProvider removed), `app/services/gaia/index.server.ts` (things export removed), `app/services/gaia/urls.ts` (things/thingsId removed), `app/languages/{en,ja}/pages/index.ts` (things removed), `app/languages/{en,ja}/pages/_index.ts` (serviceExample + techStack keys removed), `test/mocks/index.ts` + `database.ts` (things handlers/factory removed), `test/stubs/state-stub.tsx` (simplified to `() => (Story) => <State><Story /></State>`), `app/pages/Session/Profile/ProfilePage/UserCard/index.tsx` (ExampleConsumer import+usage removed), `app/pages/Public/IndexPage/index.tsx` (reduced to minimal `<section><h1>{t('title')}</h1></section>` placeholder). Wiki updated: [[Services]], [[Pages]], [[Components]], [[Testing]], [[i18n]], [[remix-flat-routes]].

## [2026-04-20] update | Phase A — rules + wiki pattern synthesis (pre-deletion gap-fill)

Prepared the template to delete example code and VitePress docs without losing the lessons they teach. 6 parallel Sonnet agents synthesized patterns from existing code into durable rules + self-contained wiki pages.

- New rules: `state-pattern.md`, `tailwind.md`, `storybook.md`, `playwright.md` — all auto-apply via path globs
- Updated rule: `api-service.md` — generalized `things`→`resources`, dropped `auth` from barrel example, added optional `state.tsx` to checklist (inconsistency flagged by agent vs real code)
- Wiki rewrites (fully self-contained, no example-code refs): [[API Service Pattern]], [[MSW]], [[State]], [[Storybook]], [[Playwright]]
- Service↔MSW contract explicitly documented — `url()` helper, snake_case-on-wire vs camelCase-after-ky-hooks, dev/test/CI init paths
- `/new-service` command — replaced "following the things pattern" strings with `[[API Service Pattern]]` / `[[MSW]]` wikilinks; removed `login` from URL example

## [2026-04-20] update | wiki-coherence hooks + /init interceptor

- Added `intercept-init.sh` (UserPromptSubmit) — blocks built-in `/init`, auto-invokes `/gaia-init`. Self-removes on `/gaia-init` completion.
- Added `wiki-session-start.sh` + `wiki-session-stop.sh` — compensate for a claude-obsidian plugin gap where `PostToolUse` auto-commits wiki changes, leaving the plugin's own Stop diff-check empty and its `wiki/hot.md` refresh prompt never firing. Our Stop hook checks commits between a session-start SHA marker and HEAD, covering the auto-commit case. Plugin's Stop still catches working-tree (uncommitted) changes — the two complement each other.
- Added `wiki-maintenance.md` rule — judgment-based wiki update check that fires pre-commit alongside `quality-gate`.
- Pages updated: [[Claude Integration]] (Hooks section restructured by event type, 3 new hooks documented)

## [2026-04-20] update | /audit-knowledge command added

- Adapted `.claude/commands/audit-knowledge.md` from another project; portable path resolution (no hardcoded user paths); `.claude/audit/` gitignored
- Pages created: [[audit-knowledge command]]
- Pages updated: [[Claude Integration]] (commands table), [[overview]] (Knowledge Hygiene section), [[index]]
- Also referenced in `README.md` and `docs/general/claude.md` commands tables

## [2026-04-20] ingest | Form components deep dive + things service

- Sources: `app/components/Form/*` (all 15 components + Field subparts + YearMonthDay utils), `app/services/gaia/things/*`
- Pages created: [[Form Field]], [[Form Text Inputs]], [[Form Select]], [[Form YearMonthDay]], [[Form Choices]], [[Form Layout]], [[things Service]]
- Pages updated: [[Form Components]] (deep-dive column), [[Services]] (things cross-link), [[API Service Pattern]] (things cross-link), [[index]], [[hot]]
- Key insight: YearMonthDay's Conform integration requires two non-obvious workarounds — native `input` event stop-propagation at the container div (React's synthetic delegation routes through `document`, same node as Conform's listener, so React-level `stopPropagation` is a no-op) and DOM-level hidden input value sync before `onChange` fires so Conform's FormData read returns the new value.

## [2026-04-20] ingest | Claude commands handoff + pickup

- Sources: `.claude/commands/handoff.md`, `.claude/commands/pickup.md`
- Pages created: [[handoff command]], [[pickup command]]
- Pages updated: [[Claude Integration]] (commands table), [[index]], [[hot]]
- Key insight: Session continuity loop — `/handoff` writes a synthesized end-of-session doc to `.claude/handoff/`, `/pickup` reads the latest one at session start, archives it once work resumes. `wiki/hot.md` is the fallback.

## [2026-04-20] ingest | Initial Ingest of GAIA React Router

- Source: project codebase + docs + .claude/
- Summary: [[Initial Ingest]]
- Pages created:
  - Top-level: [[overview]], [[index]], [[hot]], [[CLAUDE]]
  - Modules: [[Folder Structure]], [[Routing]], [[Pages]], [[Components]], [[Form Components]], [[Services]], [[Sessions]], [[State]], [[Middleware]], [[Hooks]], [[Utils]], [[Styles]], [[i18n]], [[Testing]], [[Storybook]], [[MSW]], [[Claude Integration]]
  - Flows: [[Auth Flow]], [[Theme Flow]], [[Language Flow]], [[Form Submit Flow]]
  - Entities: [[GAIA]], [[Steven Sacks]]
  - Dependencies: [[React Router 7]], [[remix-flat-routes]], [[remix-auth]], [[remix-i18next]], [[remix-toast]], [[Conform]], [[Zod]], [[Ky]], [[i18next]], [[Tailwind]], [[FontAwesome]], [[Vitest]], [[React Testing Library]], [[Playwright]], [[Chromatic]], [[Storybook]], [[MSW]], [[Husky]], [[VitePress]]
  - Decisions: [[No Component Library]], [[TypeScript Language Files]], [[Thin Routes]], [[Co-located Tests Folder]], [[composeStory Pattern]], [[Quality Gate]]
  - Concepts: [[GAIA Philosophy]], [[Coding Guidelines]], [[Component Testing]], [[API Service Pattern]], [[Accessibility]], [[ESLint Fixes]], [[test-runner]], [[Pre-commit Hooks]], [[PR Merge Workflow]], [[Code Review Audit Agent]], [[Claude Hooks]], [[Claude Skills]], [[Chromatic Opt-Out]]
- Pages updated: n/a (vault was empty)
- Key insight: GAIA's value is the **integration**, not any single tool — 20+ ESLint plugins, pre-commit hooks, four-layer testing, MSW everywhere, Storybook + Chromatic, end-to-end dark mode + i18n + auth, plus Claude Code tooling, all wired together and working out of the box.
