#!/bin/bash

# Block modifications to eslint.config.{js,cjs,mjs,ts} at any path.
# Single-app projects have it at repo root; monorepos nest it under each app
# (e.g. apps/web/eslint.config.mjs, projects/frontend/eslint.config.mjs).
# Match on the filename so the hook works in both layouts.
# Exit 2 = block the tool call, stderr is shown to Claude as the reason.

file_path=$(jq -r '.tool_input.file_path // ""' < /dev/stdin)

if echo "$file_path" | grep -Eq '(^|/)eslint\.config\.(js|cjs|mjs|ts)$'; then
  echo "BLOCKED: Do not modify eslint.config.* to fix lint errors. Fix the ESLint error in the source file where it occurs." >&2
  exit 2
fi

exit 0
