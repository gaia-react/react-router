#!/bin/bash
# Record HEAD at session start so the Stop hook can detect wiki changes
# committed during this session (by claude-obsidian's PostToolUse auto-commit
# or by the user). Without this marker, the plugin's own Stop diff check
# misses auto-committed changes because the working tree equals HEAD.

GIT_DIR=$(git rev-parse --git-dir 2>/dev/null) || exit 0
git rev-parse HEAD > "$GIT_DIR/claude-session-start" 2>/dev/null || true
exit 0
