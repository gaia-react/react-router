---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, ci, review]
---

# PR Merge Workflow

Source: `.claude/rules/pr-merge-workflow.md`. Mandatory before any `gh pr merge`.

## Steps

1. **Spawn the `code-review-audit` agent** on the PR's changes — security, performance, smells, anti-patterns.
2. **Fix all identified issues.** Re-run lint + typecheck. Re-run the audit if fixes are non-trivial.
3. **Commit the fixes** to the PR branch.
4. **Merge** only after Steps 1-3 are clean.

No exceptions — even for "small" PRs. If the user explicitly requests skipping the audit, confirm once before proceeding.

See [[Code Review Audit Agent]], [[Quality Gate]].
