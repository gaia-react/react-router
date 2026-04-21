#!/bin/bash

# Block `npm test` / `npm run test` without `--run` (starts vitest watch mode in CI contexts).
# Exit 2 = block the tool call, stderr is shown to Claude as the reason.

command=$(jq -r '.tool_input.command // ""' < /dev/stdin)

if echo "$command" | grep -Eq '(^|[^[:alnum:]_-])npm[[:space:]]+(run[[:space:]]+)?test([[:space:]]|$)'; then
  if ! echo "$command" | grep -Eq -- '--run([[:space:]]|$)'; then
    echo "BLOCKED: bare \`npm test\` / \`npm run test\` starts vitest watch mode. Use \`npm run test -- --run\` for one-shot runs." >&2
    exit 2
  fi
fi

exit 0
