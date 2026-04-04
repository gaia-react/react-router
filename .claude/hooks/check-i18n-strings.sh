#!/bin/bash
# Advisory check: warn about potential hardcoded strings in JSX
# Exit 0 always (advisory, non-blocking)

file_path=$(jq -r '.tool_input.file_path // ""' < /dev/stdin)

# Only check page and component files
if ! echo "$file_path" | grep -qE 'app/(pages|components)/.*\.tsx$'; then
  exit 0
fi

# Reminder (non-blocking)
echo "Reminder: Ensure all user-facing strings use t() from useTranslation(). Add keys to all language files." >&2
exit 0
