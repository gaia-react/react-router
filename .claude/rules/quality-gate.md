# Quality Gate Process

Before executing `git commit` (or any commit command), run the steps defined in `.claude/commands/audit-code.md` — **unless the gate has nothing to check**.

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

## When the gate runs

- **Fix issues as you encounter them** rather than just reporting them.
- All warnings/issues (typecheck errors, lint errors/warnings, test console warnings like missing i18n keys or HydrateFallback, runtime errors) must be resolved before the commit — never commit with known warnings.
- After fixing, **STOP and report results to the user** — do not commit until the user reviews and approves.

Localization: all user-facing strings must be localized — no hardcoded strings in JSX, no keys without values.
