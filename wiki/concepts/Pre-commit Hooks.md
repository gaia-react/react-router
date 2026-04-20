---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, ci, quality]
---

# Pre-commit Hooks

GAIA uses [[Husky]] + `lint-staged` to run typecheck, lint, and tests on staged files before commit.

## Configuration

`.lintstagedrc` — runs against staged files only:

- ESLint (`--fix --max-warnings=0`)
- Prettier (`--write`)
- Stylelint (`--fix`)
- Vitest (`--run --changed --bail 1`) — runs only tests affected by staged changes

`.husky/` holds the actual git hook scripts. Set up by `npm run prepare` (skipped in CI via `is-ci`).

## Why tests run on commit

Most projects only lint on commit. GAIA also runs the relevant tests because the cost of a broken test reaching CI is way higher than the seconds it takes to run them locally.

See [[Quality Gate]], [[Husky]].
