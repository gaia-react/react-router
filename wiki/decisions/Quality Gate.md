---
type: decision
status: active
priority: 1
date: 2026-04-20
tags: [decision, ci, quality]
---

# Decision: Mandatory Quality Gate

Every change must pass the Quality Gate. Pre-commit hooks enforce a subset; the `/audit-code` command runs the full pipeline.

## Steps

1. **Localization check** — no hardcoded user-facing strings or unfilled keys
2. `npm run typecheck` — zero errors
3. `npm run lint` — zero errors, zero warnings
4. `npm run test -- --run` — all tests pass with **zero console warnings** (missing keys, HydrateFallback, etc. count as failures)
5. `npm run pw` — all Playwright E2E tests pass
6. **Dev smoke test** — start `npm run dev`, curl a route, verify HTTP 200
7. `npm run build` — confirms production build
8. **Fix all warnings before reporting** — never hand off with known warnings
9. **Stop and report** — wait for user approval

## Source of truth

`.claude/rules/quality-gate.md` — automatically applied by Claude Code.

> [!key-insight] Zero warnings is non-negotiable
> Most projects accept warnings as "noise we'll clean up later." GAIA treats warnings as **failures**. Console warnings in tests count too. The cost of fixing one missing i18n key now is trivial; the cost of finding it in production after 200 keys silently broke is not.

See [[Pre-commit Hooks]], [[PR Merge Workflow]].
