# PR Merge Workflow (Mandatory)

Before executing `gh pr merge` or any PR merge command, **always** follow these steps:

## Step 1: Run Code Review Audit

Spawn the `code-review-audit` agent on the PR's changes:

```
Task(
  subagent_type="code-review-audit",
  prompt="Review all changes in the current branch compared to main. Identify security vulnerabilities, performance issues, code smells, anti-patterns, and refactoring opportunities."
)
```

## Step 2: Fix All Issues

- Fix every issue the audit identifies (security, performance, code quality)
- Re-run linting and type checking after fixes
- If fixes are non-trivial, re-run the audit to confirm resolution

## Step 3: Commit Fixes

- Stage and commit all fixes before merging
- Push the commit to the remote branch so the PR includes the fixes

## Step 4: Merge

- Only after Steps 1-3 are complete and clean, proceed with the merge

## No Exceptions

- Never skip the audit, even for "small" PRs
- Never merge with known issues from the audit
- If the user explicitly requests skipping the audit, confirm once before proceeding
