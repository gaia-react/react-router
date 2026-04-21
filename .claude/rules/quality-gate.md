# Quality Gate

Before any `git commit` that touches source, run the steps in `.claude/commands/audit-code.md` — unless the gate has nothing to check (no staged `.ts|tsx|js|jsx|mjs|cjs|css` or gate-affecting config). Fix all warnings before reporting. STOP and report before committing. Full skip logic, steps, and rationale: `wiki/decisions/Quality Gate.md`.

Localization: no hardcoded user-facing strings in JSX, no keys without values.
