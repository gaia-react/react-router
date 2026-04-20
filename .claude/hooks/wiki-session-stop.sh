#!/bin/bash
# Prompt Claude to refresh wiki/hot.md if any commits between the session-start
# marker and HEAD touched wiki/. Pairs with wiki-session-start.sh and
# compensates for a gap in the claude-obsidian plugin: its PostToolUse hook
# auto-commits wiki/ changes, so by Stop time the plugin's diff check against
# HEAD is always empty and its refresh prompt never fires.

[ -d wiki ] || exit 0
GIT_DIR=$(git rev-parse --git-dir 2>/dev/null) || exit 0
marker="$GIT_DIR/claude-session-start"
[ -f "$marker" ] || exit 0

start_sha=$(cat "$marker")
head_sha=$(git rev-parse HEAD 2>/dev/null) || exit 0

# No commits since session start — nothing to check.
[ "$start_sha" = "$head_sha" ] && exit 0

# If the marker SHA is no longer reachable (rebase, reset, shallow clone),
# reset the marker silently rather than emitting a spurious prompt.
if ! git merge-base --is-ancestor "$start_sha" HEAD 2>/dev/null; then
  echo "$head_sha" > "$marker"
  exit 0
fi

if git log "$start_sha..HEAD" --name-only --pretty=format: 2>/dev/null | grep -q '^wiki/'; then
  echo 'WIKI_CHANGED: Wiki pages were modified this session. Please update wiki/hot.md with a brief summary of what changed (under 500 words). Use the hot cache format: Last Updated, Key Recent Facts, Recent Changes, Active Threads. Keep it factual. Overwrite the file completely. It is a cache, not a journal.'
fi

# Advance the marker so repeated Stops in the same session do not re-prompt
# for commits that have already been processed.
echo "$head_sha" > "$marker"
exit 0
