# PR Merge Workflow

Before `gh pr merge`: run `code-review-audit` agent, fix all findings, commit fixes, then merge. No exceptions. Machine-enforced by `.claude/hooks/pr-merge-audit-check.sh`. Full four-step protocol: `wiki/concepts/PR Merge Workflow.md`.
