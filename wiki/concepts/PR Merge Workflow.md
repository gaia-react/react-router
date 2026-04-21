---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-21
tags: [concept, ci, review]
---

# PR Merge Workflow

Mandatory before any `gh pr merge`. Machine-enforced by `.claude/hooks/pr-merge-audit-check.sh` — the hook blocks `gh pr merge` calls that have not been preceded by a `code-review-audit` run on the current branch.

## Four-step protocol

### 1. Run code-review-audit

Spawn the agent on the PR's changes:

```
Task(
  subagent_type="code-review-audit",
  prompt="Review all changes in the current branch compared to main. Identify security vulnerabilities, performance issues, code smells, anti-patterns, and refactoring opportunities."
)
```

### 2. Fix all issues

- Fix every issue the audit identifies (security, performance, code quality).
- Re-run linting and type checking after fixes.
- If fixes are non-trivial, re-run the audit to confirm resolution.

### 3. Commit fixes

- Stage and commit all fixes before merging.
- Push the commit to the remote branch so the PR includes the fixes.

### 4. Merge

- Only after steps 1-3 are complete and clean, proceed with the merge.

## No exceptions

- Never skip the audit, even for "small" PRs.
- Never merge with known issues from the audit.
- If the user explicitly requests skipping the audit, confirm once before proceeding.

## Source of truth

Stub: `.claude/rules/pr-merge-workflow.md` (redirects here).

See [[Code Review Audit Agent]], [[Quality Gate]], [[Git Workflow]].
