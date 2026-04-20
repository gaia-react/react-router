---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, testing]
---

# test-runner Rule

Source: `.claude/rules/test-runner.md`.

> [!warning] Never run bare `npm test` in CI
> Bare `npm test` starts vitest in **watch mode** — the process never exits.

## Use

- `npm run test` — vitest watch mode (interactive)
- `npm run test -- --run` — single CI-style run
- `npm run test:ci` — `--run --passWithNoTests --coverage --bail 1`
- `npm run test:lint-staged` — `--run --changed --passWithNoTests --bail 1` (used by Husky)

See [[Vitest]], [[Pre-commit Hooks]].
