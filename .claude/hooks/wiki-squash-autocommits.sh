#!/bin/bash
# Collapse consecutive `wiki: auto-commit ...` commits at HEAD into one.
# The claude-obsidian plugin's PostToolUse hook commits after every Write/Edit,
# which produces N commits per turn when the wiki sees multiple edits. This
# hook runs on Stop and squashes the trailing run back into a single commit.

[ -d .git ] || exit 0

n=0
while git log "HEAD~$n" -1 --format='%s' 2>/dev/null | grep -q '^wiki: auto-commit '; do
  n=$((n + 1))
done

# Nothing to do unless there are 2+ consecutive auto-commits at HEAD.
[ "$n" -ge 2 ] || exit 0

git reset --soft "HEAD~$n" >/dev/null 2>&1 || exit 0
git commit -m "wiki: auto-commit $(date '+%Y-%m-%d %H:%M')" --no-verify >/dev/null 2>&1 || true
exit 0
