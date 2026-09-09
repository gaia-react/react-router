#!/bin/bash
# Advisory check: remind to add Storybook story for new components
# Exit 0 always (advisory, non-blocking)

# Advisory, so this stands down rather than refusing: the arm a blocking hook
# takes instead is .claude/hooks/lib/jq-availability.sh.
command -v jq >/dev/null 2>&1 || exit 0

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
