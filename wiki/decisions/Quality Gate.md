---
type: decision
status: active
priority: 1
date: 2026-04-20
created: 2026-04-20
updated: 2026-04-21
tags: [decision, ci, quality]
---

# Decision: Mandatory Quality Gate

Every change must pass the Quality Gate. Pre-commit hooks enforce a subset; the `/audit-code` command runs the full pipeline. Claude must run the gate before any `git commit` that touches source — **unless the gate has nothing to check**.

## Steps

1. **Localization check** — no hardcoded user-facing strings or unfilled keys.
2. `npm run typecheck` — zero errors.
3. `npm run lint` — zero errors, zero warnings.
4. `npm run test -- --run` — all tests pass with **zero console warnings** (missing keys, HydrateFallback, etc. count as failures).
5. `npm run pw` — all Playwright E2E tests pass.
6. **Dev smoke test** — start `npm run dev`, curl a route, verify HTTP 200.
7. `npm run build` — confirms production build.
8. **Fix all warnings before reporting** — never hand off with known warnings.
9. **Stop and report** — wait for user approval.

## When to skip the gate

Skip the gate entirely if no staged file is something typecheck / lint / tests / build can inspect. The gate runs only when at least one staged file matches:

- **Source**: `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.mjs`, `*.cjs`, `*.css`
- **Gate-affecting config**: `package.json`, `package-lock.json`, `tsconfig*.json`, `vite.config.*`, `vitest.config.*`, `playwright.config.*`, `eslint.config.*`

Pure markdown, `.claude/**`, `wiki/**`, image, or other non-source-affecting commits skip straight to the commit step.

Quick check:

```bash
git diff --cached --name-only | grep -E '\.(ts|tsx|js|jsx|mjs|cjs|css)$|^(package(-lock)?\.json|tsconfig.*\.json|vite\.config\.|vitest\.config\.|playwright\.config\.|eslint\.config\.)'
```

If the grep returns nothing, skip the gate.

## Behavior when the gate runs

- **Fix issues as you encounter them** rather than just reporting them.
- All warnings/issues (typecheck errors, lint errors/warnings, test console warnings like missing i18n keys or HydrateFallback, runtime errors) must be resolved before the commit — never commit with known warnings.
- After fixing, **STOP and report results to the user** — do not commit until the user reviews and approves.

Localization: all user-facing strings must be localized — no hardcoded strings in JSX, no keys without values.

## Source of truth

Stub: `.claude/rules/quality-gate.md` (redirects here). Full pipeline steps: `.claude/commands/audit-code.md`.

> [!key-insight] Zero warnings is non-negotiable
> Most projects accept warnings as "noise we'll clean up later." GAIA treats warnings as **failures**. Console warnings in tests count too. The cost of fixing one missing i18n key now is trivial; the cost of finding it in production after 200 keys silently broke is not.

See [[Pre-commit Hooks]], [[PR Merge Workflow]], [[Task Orchestration]].
