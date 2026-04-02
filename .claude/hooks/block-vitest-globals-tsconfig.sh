#!/bin/bash

# Block adding vitest/globals to tsconfig.json
# Exit 2 = block the tool call, stderr is shown to Claude as the reason

input=$(cat /dev/stdin)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

if echo "$file_path" | grep -q 'tsconfig\.json'; then
  new_string=$(echo "$input" | jq -r '.tool_input.new_string // .tool_input.content // ""')
  if echo "$new_string" | grep -qi 'vitest/globals'; then
    echo "BLOCKED: Do not add vitest/globals to tsconfig.json. Instead, add explicit imports in each test file: import {describe, expect, test} from 'vitest'" >&2
    exit 2
  fi
fi

exit 0
