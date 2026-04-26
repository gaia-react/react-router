#!/bin/bash
# GAIA-owned wiki hook. Upstream contract: claude-obsidian/hooks/hooks.json::Stop
# Why GAIA overrides: upstream diffs working tree vs HEAD, but its PostToolUse
# already auto-commits wiki/ changes, so its Stop diff is always empty and the
# refresh prompt never fires. We diff a session-start HEAD marker against HEAD
# instead, catching the auto-committed changes. Reminder text uses GAIA's 200-
# word hot-cache cap (upstream caps at 500).

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
  echo 'WIKI_CHANGED: Wiki pages were modified this session. Please update wiki/hot.md with a brief summary of what changed (under 200 words). Use the hot cache format: Last Updated, Key Recent Facts, Recent Changes, Active Threads. Keep it factual. Overwrite the file completely. It is a cache, not a journal.'
fi

# Advance the marker so repeated Stops in the same session do not re-prompt
# for commits that have already been processed.
echo "$head_sha" > "$marker"
exit 0
