# Quality Gate Process

Before executing `git commit` (or any commit command), run the steps defined in `.claude/commands/audit-code.md`.

Differences from `/audit-code`:

- **Fix issues as you encounter them** rather than just reporting them.
- All warnings/issues (typecheck errors, lint errors/warnings, test console warnings like missing i18n keys or HydrateFallback, runtime errors) must be resolved before the commit — never commit with known warnings.
- After fixing, **STOP and report results to the user** — do not commit until the user reviews and approves.

Localization: all user-facing strings must be localized — no hardcoded strings in JSX, no keys without values.
