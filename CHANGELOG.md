# Changelog

All notable changes to the GAIA React Template are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- **Major** — breaking changes to skill/command API, Node/React/React Router major bumps, removed or renamed `.claude/` paths.
- **Minor** — new skills, commands, or wiki concept pages; opt-in features.
- **Patch** — bugfixes, docs, and in-range dependency bumps.

Run `/gaia-update` inside your project to pull GAIA changes without clobbering your customizations.

## [Unreleased]

### Changed

- Bump claude-obsidian plugin baseline to v1.6.0.
- Formalize wiki Mode B (Codebase) + E (Research) per upstream `references/modes.md`.

### Added

- `wiki/decisions/DragonScale Opt-Out.md` — ADR documenting why GAIA does not adopt the DragonScale memory layer.

## [1.0.0] — 2026-04-22

First public release. The template pivots from an example-app starter to a Claude-native foundation: skills, commands, hooks, and a wiki are first-class, and the example-code/auth/docs surface area has been removed so the clone is an empty canvas rather than something to delete.

### Added

- **Claude integration surface** — `.claude/` ships with rules, settings, hooks, a skills bundle, and an agent commands catalog. `claude.md` is curated for context economy and left intact by `/gaia-init`.
- **Commands** — `/gaia-init` (project scaffolding), `/audit-code` (quality gate), `/audit-knowledge` (wiki/memory audit), `/handoff` + `/pickup` (session continuity), `/migrate` (dep upgrade workflow), `/new-route`, `/new-component`, `/new-hook`, `/new-service`, `/setup-chromatic-mcp`.
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

[Unreleased]: https://github.com/gaia-react/react-router/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/gaia-react/react-router/releases/tag/v1.0.0
