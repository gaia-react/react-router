#!/bin/bash
# Advisory reminder fired before `git commit`:
# evaluate whether the commit warrants a wiki update.
# Exit 0 always (non-blocking).

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // ""')

if [ "$tool_name" != "Bash" ]; then
  exit 0
fi

command=$(echo "$input" | jq -r '.tool_input.command // ""')

# Match `git commit` but not `git commit-tree`, `git commit-graph`, etc.
if ! echo "$command" | grep -qE '(^|[^[:alnum:]_-])git[[:space:]]+commit([[:space:]]|$)'; then
  exit 0
fi

cat <<'EOF' >&2
Reminder — evaluate a wiki update before committing.

File a wiki update if this commit introduces:
  - a new service, component family, hook, or pattern
  - an added/updated/removed dependency
  - an ADR-worthy decision (chose X over Y)
  - a non-obvious invariant, gotcha, or workaround
  - a breaking change to a documented interface
  - a change to .claude/agents/code-review-audit/ extensions
    (then also update wiki/concepts/Code Review Audit Agent.md)

Skip for: bug fixes in existing patterns, mental-model-preserving
refactors, typos/formatting, test additions, or duplicates of
existing wiki content.

Process: scan wiki/index.md → use /save, /wiki-ingest, or direct
edit → prepend one-line entry to wiki/log.md (newest on top). The
claude-obsidian Stop hook refreshes wiki/hot.md automatically.

Periodic drift cleanup: /audit-knowledge every few weeks.
EOF

exit 0
