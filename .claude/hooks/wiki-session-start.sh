#!/bin/bash
# GAIA-owned wiki hook. Upstream contract: claude-obsidian/hooks/hooks.json::SessionStart
# Why GAIA overrides: upstream cats wiki/hot.md and prompts a silent re-read; we
# instead record HEAD so the Stop hook can detect wiki commits (the plugin's own
# Stop diff misses changes already auto-committed by its PostToolUse hook).
# Hot-cache restoration is left to the model + claude-obsidian:wiki skill.

GIT_DIR=$(git rev-parse --git-dir 2>/dev/null) || exit 0
git rev-parse HEAD > "$GIT_DIR/claude-session-start" 2>/dev/null || true

# Both scripts below are located from this file's own directory, never from the
# process working directory: each existence test guards a silent side effect, so
# a session started anywhere under the repository root would skip both with
# nothing to say the residue was never swept.
_hook_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd)" || exit 0

# Bounded GC of .gaia/local working-state residue (orphaned audit markers,
# completed-but-unswept plan dirs, stray empty dirs). Side-effect only; never
# blocks the session. See local-janitor.sh for the provable-death contract.
[ -f "$_hook_dir/local-janitor.sh" ] && bash "$_hook_dir/local-janitor.sh" || true

# gaia:maintainer-only:start
# Bounded prune of the Code Audit Team re-spawn breadcrumb ledger: age-drops
# records past the retention window and caps the file's line count. Side-effect
# only; never blocks the session. The prune script is release-excluded, so this
# block is maintainer-only and the scrub strips it from the shipped hook; the
# guard keeps it inert on a maintainer clone that does not carry the script.
[ -f "$_hook_dir/../../.gaia/scripts/audit-respawn-prune.sh" ] && bash "$_hook_dir/../../.gaia/scripts/audit-respawn-prune.sh" || true
# gaia:maintainer-only:end

exit 0
