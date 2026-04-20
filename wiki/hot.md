---
type: meta
title: Hot Cache
updated: 2026-04-20T00:00:00
---

# Recent Context

## Last Updated

2026-04-20. Initial ingest of the GAIA React Router project. Wiki vault scaffolded from scratch in Mode B (codebase) + decisions/ADRs.

## Key Recent Facts

- GAIA is a React Router 7 starter template — heavy on infrastructure, deliberately ships **no component library**. Form components are the star.
- Quality is enforced by tooling: 20+ ESLint plugins, pre-commit Husky+lint-staged (typecheck + lint + tests), zero-warning [[Quality Gate]] before merge.
- Single MSW mocking layer drives Vitest, Storybook, and (optionally) the dev server. `composeStory` shares setup between Storybook and Vitest tests.
- TypeScript files (not JSON) for i18n strings — for type safety and lint-staged enforcement of missing keys.
- Claude integration is first-class: 8 commands, 10 rules, 4 hooks, `code-review-audit` agent + 3 specialist subagents, 4 local skills.
- Project version: 1.0.0-beta. Author: Steven Sacks.

## Recent Changes

- Created: vault scaffold (`wiki/CLAUDE.md`, `index.md`, `log.md`, `hot.md`, `overview.md`)
- Created: 13 module pages, 4 flow pages, 2 entity pages, 19 dependency pages, 6 decision pages, 13 concept pages, 1 source summary
- Created: `wiki/sources/Initial Ingest.md` documenting what was read

## Active Threads

- None — vault is freshly scaffolded
- Suggested next ingests: a deeper read of `app/components/Form/*` (each form component as its own wiki page), individual route walkthroughs, real example flows from `things/` before they're stripped by `/gaia-init`
