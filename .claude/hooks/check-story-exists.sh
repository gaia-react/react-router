#!/bin/bash
# Advisory check: remind to add Storybook story for new components
# Exit 0 always (advisory, non-blocking)

file_path=$(jq -r '.tool_input.file_path // ""' < /dev/stdin)

# Only check component index files
if ! echo "$file_path" | grep -qE 'app/components/[^/]+/index\.tsx$'; then
  exit 0
fi

# Check if story exists
dir=$(dirname "$file_path")
if [ ! -f "$dir/tests/index.stories.tsx" ]; then
  echo "Reminder: Consider adding a Storybook story at ${dir}/tests/index.stories.tsx" >&2
fi

exit 0
