#!/bin/bash
# Advisory reminder fired before `gh pr merge`:
# require a code-review-audit pass per wiki/concepts/PR Merge Workflow.md.
# Exit 0 always (non-blocking).

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // ""')

if [ "$tool_name" != "Bash" ]; then
  exit 0
fi

command=$(echo "$input" | jq -r '.tool_input.command // ""')

# Match `gh pr merge` (including `gh   pr   merge --squash` etc.)
if ! echo "$command" | grep -qE '(^|[^[:alnum:]_-])gh[[:space:]]+pr[[:space:]]+merge([[:space:]]|$)'; then
  exit 0
fi

cat <<'EOF' >&2
Reminder — run the code-review-audit before merging.

Per wiki/concepts/PR Merge Workflow.md:
  1. Spawn code-review-audit agent on the branch vs main
  2. Fix every issue (security, performance, code quality)
  3. Commit + push fixes to the PR branch
  4. Only then run `gh pr merge`

Never skip the audit. If the user explicitly requested skipping,
confirm once before proceeding.
EOF

exit 0
