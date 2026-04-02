#!/bin/bash

# Block modifications to eslint.config.mjs
# Exit 2 = block the tool call, stderr is shown to Claude as the reason

file_path=$(jq -r '.tool_input.file_path // ""' < /dev/stdin)

if echo "$file_path" | grep -q 'apps/web/eslint\.config\.mjs'; then
  echo "BLOCKED: Do not modify eslint.config.mjs to fix lint errors. Fix the ESLint error in the source file where it occurs." >&2
  exit 2
fi

exit 0
