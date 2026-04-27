# Changelog

All notable changes to GAIA React are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- **Major** — breaking changes to skill/command API, Node/React/React Router major bumps, removed or renamed `.claude/` paths.
- **Minor** — new skills, commands, or wiki concept pages; opt-in features.
- **Patch** — bugfixes, docs, and in-range dependency bumps.

Run `/gaia-update` inside your project to pull GAIA changes without clobbering your customizations.

## [Unreleased]

### Changed

- **Dark mode rewrite (cookie + client hints).** Replaces the React context + `localStorage` + inline-script approach with `@epic-web/client-hints` + cookie-as-truth + optimistic `useFetchers()` UI. New files: `app/utils/{theme.server,client-hints,request-info}.{ts,tsx}` and `app/routes/resources+/theme-switch.tsx`. Removed: `app/state/theme.tsx`, `app/sessions.server/theme.ts`, `app/routes/actions+/set-theme.ts`, `app/components/ThemeSwitcher/index.tsx`. Cookie name `__theme` preserved. New deps: `@epic-web/client-hints`, `cookie`. ADR: `wiki/decisions/Dark Mode Modernization.md`.
- **Package manager: npm → pnpm.** `package.json` pins via `packageManager: pnpm@10.33.0`; `overrides` moves to `pnpm.overrides` with `parent>child` syntax. `.npmrc` rewritten with `strict-peer-dependencies=false` and `minimumReleaseAge=10080` (7-day supply-chain quarantine). `package-lock.json` deleted; `pnpm-lock.yaml` is the lockfile. CI workflows use `pnpm/action-setup@v4` + `pnpm install --frozen-lockfile`. `/gaia-init` adds Step 0 to bootstrap pnpm via corepack (with `npm install -g pnpm` fallback).
- **`/migrate` rewritten as autonomous Dependabot.** No prompts. Discovers all outdated packages via `pnpm outdated --json`, audits `pnpm.overrides` for obsolete entries, batches minor/patch into one wave, processes major bumps per-group with WebFetch migration guides (Storybook uses `pnpm dlx storybook@latest upgrade`), re-audits overrides post-update, runs the quality gate. ESLint 9.x cap retained.
- `block-bare-npm-test.sh` renamed `block-bare-test.sh`; matches both `pnpm *` and `npm *`. Test-runner messaging updated.
- Bump claude-obsidian plugin baseline to v1.6.0.
- Formalize wiki Mode B (Codebase) + E (Research) per upstream `references/modes.md`.

### Added

- `wiki/decisions/pnpm.md` — ADR documenting the pnpm migration, supply-chain quarantine rationale, and override audit flow.
- `wiki/decisions/DragonScale Opt-Out.md` — ADR documenting why GAIA does not adopt the DragonScale memory layer.
- **`/gaia-init` README replacement.** New `.gaia/templates/README.md` template is copied to the project root with `{{PROJECT_TITLE}}` substituted, replacing GAIA's own marketing README so adopters start with a project-focused readme.
- **`/gaia-init` runs `/migrate` after install** so new projects start on the freshest compatible package versions.
- **`/gaia-init` resets `wiki/log.md`** to a single seed entry instead of prepending to GAIA's development log — adopters' logs are about their project only.
- **GAIA statusline (default, opt-out).** `.gaia/statusline/gaia-statusline.sh` ships a project-scoped statusline that renders project, branch, model, and context bar (left) plus right-aligned hints when `pnpm` packages are outdated (`Run /migrate (N outdated)`) or a new GAIA release is available (`GAIA <ver> available — /gaia-update`). Update checks are TTL-cached (6 hours) in `.gaia/cache/statusline-update-check.json` so the hot-path stays fast. Wired into project `.claude/settings.json` by `/gaia-init`; users with an existing `statusLine` are not clobbered.

### Removed

- **`/setup-chromatic-mcp` command and Chromatic MCP integration.** GAIA is an app template, not a component library, so the Chromatic MCP isn't appropriate to ship here (per Chromatic's CTO). The Storybook MCP isn't ready for primetime, so we're not adding it either. Visual regression via the Chromatic SaaS (`chromatic` package, `.github/workflows/chromatic.yml`, `chromatic.config.json`, `.storybook/chromatic/`) stays unchanged. The `storybook` rule (`.claude/rules/storybook.md`) stays. Removed: `.claude/commands/setup-chromatic-mcp.md`, the Chromatic MCP step in `/gaia-init`, MCP subsections in `wiki/dependencies/Chromatic.md` + `wiki/modules/Claude Integration.md` + `wiki/concepts/Agentic Design.md`, the `/setup-chromatic-mcp` reference in `wiki/concepts/Chromatic Opt-Out.md`, and the README "Chromatic MCP" section + `/init` bullet.

## [1.0.0] — 2026-04-22

First public release. The template pivots from an example-app starter to a Claude-native foundation: skills, commands, hooks, and a wiki are first-class, and the example-code/auth/docs surface area has been removed so the clone is an empty canvas rather than something to delete.

### Added

- **Claude integration surface** — `.claude/` ships with rules, settings, hooks, a skills bundle, and an agent commands catalog. `claude.md` is curated for context economy and left intact by `/gaia-init`.
- **Commands** — `/gaia-init` (project scaffolding), `/audit-code` (quality gate), `/audit-knowledge` (wiki/memory audit), `/handoff` + `/pickup` (session continuity), `/migrate` (dep upgrade workflow), `/new-route`, `/new-component`, `/new-hook`, `/new-service`.
- **Bundled skills** — `typescript`, `react-code`, `tailwind`, `tdd`, `skeleton-loaders`, `playwright-cli`. Each scoped to the directories it governs.
- **Hooks governance** — PreToolUse hooks guard destructive git on `main`, block bare `npm test`, advise on PR merge + wiki maintenance. Stop hooks auto-commit wiki and maintain the hot cache.
- **Wiki vault** — architecture overview, decisions (Quality Gate), modules (Routing, Styling, i18n, Form Components), concepts (API Service Pattern, Component Testing, Task Orchestration), and a log/hot-cache pair for session continuity.
- **Form system** — Conform + Zod integration for type-safe forms, standardized across the template.
- **i18n** — `remix-i18next` middleware, English + Japanese language scaffolding, `LanguageSelect` component, Storybook locale switcher.
- **Components** — `TextArea` with autosize, `LanguageSelect`, `Header`/`Footer` scaffolding, theme toggle.

### Changed

- **Framework** — migrated from Remix to **React Router 7** across routing, data loading, and build pipeline.
- **Runtime** — upgraded to **React 19**, **Tailwind v4**, **ESLint 9**, **Vite 8**, **Vitest 4**, **TypeScript 6**.
- **HTTP client** — swapped native `fetch` for **ky** across API services.
- **Utilities** — replaced `lodash` with `lodash-es`; replaced `isObject` and similar helpers with native type guards.
- **Routes** — modernized to React Router 7 patterns; removed legacy `Meta` component and unnecessary `data()` wrappers.
- **Template scope** — pivoted from demo/example code (auth flow, "things" CRUD pages, VitePress docs site) to a Claude-native empty canvas.
- **Linting** — introduced TypeScript enum rule; tightened ESLint config; added Storybook/Playwright/TDD-aware plugins.

### Removed

- Auth example pages and supporting code.
- VitePress docs site (now lives outside the template).
- `pnpm` / `packageManager` field — template standardizes on npm.
- `remix.init` functionality — replaced by `/gaia-init`.
- `Meta` component and `cross-fetch` shim (native/ky replaces both).

### Fixed

- Vite 8 runtime issues uncovered during the major upgrade.
- npm peer-dependency warnings after Tailwind v4 / ESLint 9 bumps.
- `tsconfig` paths and import resolution cleanup.
- Login redirect issues uncovered during the auth removal.

[Unreleased]: https://github.com/gaia-react/gaia/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/gaia-react/gaia/releases/tag/v1.0.0
