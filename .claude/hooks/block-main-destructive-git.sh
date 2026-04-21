#!/usr/bin/env bash
# PreToolUse Bash hook: block commits to main/master and force-push to main/master.
# Policy: wiki/concepts/Git Workflow.md
set -euo pipefail

payload=$(cat)
cmd=$(echo "$payload" | jq -r '.tool_input.command // empty')

# Only act on git commands — short-circuit everything else
[[ "$cmd" =~ (^|[[:space:]&;|])git([[:space:]]|$) ]] || exit 0

deny() {
  jq -n --arg r "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $r
    }
  }'
  exit 0
}

# 1. Block commits while HEAD is on main or master.
if [[ "$cmd" =~ git[[:space:]]+commit([[:space:]]|$) ]]; then
  branch=$(git symbolic-ref --short HEAD 2>/dev/null || echo "")
  if [[ "$branch" == "main" || "$branch" == "master" ]]; then
    deny "Commits to '$branch' are forbidden (wiki/concepts/Git Workflow.md). Create a feature branch first."
  fi
fi

# 2. Block force-push when target mentions main or master.
if [[ "$cmd" =~ git[[:space:]]+push ]] \
   && [[ "$cmd" =~ (--force|--force-with-lease|[[:space:]]-f([[:space:]]|$)) ]] \
   && [[ "$cmd" =~ (main|master)([[:space:]]|$|:) ]]; then
  deny "Force-push to main/master is forbidden (wiki/concepts/Git Workflow.md)."
fi

exit 0
