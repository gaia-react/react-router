#!/bin/bash
# GAIA project-scoped statusline.
#
# Reads JSON from stdin (Claude Code convention), prints a single line with
# left segments (project | branch | model | context-bar) and right-aligned
# hints (outdated packages, GAIA release available) when the cache file
# indicates either condition.
#
# The hot path stays fast (target <50ms): no network calls, no `pnpm` calls.
# A background refresher (.gaia/statusline/check-updates.sh) writes the cache.
#
# Partial failures are silent — a broken statusline disappears in Claude Code,
# which is the worst UX. Do NOT add `set -e`.

# Resolve script directory so cache lookups work regardless of caller cwd.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GAIA_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CACHE_FILE="$GAIA_DIR/cache/statusline-update-check.json"
CHECK_SCRIPT="$SCRIPT_DIR/check-updates.sh"

# Read JSON input once.
input=$(cat)

# ---------- Left side ----------
# Resolve cwd from the Claude payload (workspace.current_dir, then cwd).
if command -v jq >/dev/null 2>&1; then
  cwd=$(printf '%s' "$input" | jq -r '.workspace.current_dir // empty' 2>/dev/null)
  [ -z "$cwd" ] && cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null)
  model=$(printf '%s' "$input" | jq -r '.model.display_name // empty' 2>/dev/null | sed 's/^Claude //')
  effort=$(printf '%s' "$input" | jq -r '.effortLevel // empty' 2>/dev/null)
  used_pct=$(printf '%s' "$input" | jq -r '.context_window.used_percentage // empty' 2>/dev/null)
else
  cwd=""
  model=""
  effort=""
  used_pct=""
fi
[ -z "$cwd" ] && cwd="$PWD"

# Project name + branch from git, fallback to cwd basename.
if git -C "$cwd" rev-parse --git-dir >/dev/null 2>&1; then
  git_root=$(git -C "$cwd" --no-optional-locks rev-parse --show-toplevel 2>/dev/null)
  project=$(basename "$git_root")
  branch=$(git -C "$cwd" --no-optional-locks rev-parse --abbrev-ref HEAD 2>/dev/null)
  git_info=$(printf '\033[01;34m%s\033[00m | \033[01;32m%s\033[00m' "$project" "$branch")
else
  project=$(basename "$cwd")
  git_info=$(printf '\033[01;34m%s\033[00m' "$project")
fi

# Effort suffix on the model.
if [ -n "$effort" ]; then
  effort_cap=$(printf '%s' "$effort" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
  model="${model} (${effort_cap})"
fi

# Context bar.
context_bar=""
if [ -n "$used_pct" ]; then
  filled=$(printf '%s' "$used_pct" | awk '{printf "%d", ($1 / 10 + 0.5)}')
  [ -z "$filled" ] && filled=0
  [ "$filled" -gt 10 ] && filled=10
  empty=$((10 - filled))
  bar=""
  for i in $(seq 1 "$filled" 2>/dev/null); do bar="${bar}▓"; done
  for i in $(seq 1 "$empty" 2>/dev/null); do bar="${bar}░"; done
  pct_int=$(printf '%.0f' "$used_pct" 2>/dev/null)
  [ -z "$pct_int" ] && pct_int=0
  if [ "$pct_int" -ge 80 ]; then
    color="\033[01;31m"
  elif [ "$pct_int" -ge 50 ]; then
    color="\033[01;33m"
  else
    color="\033[01;32m"
  fi
  context_bar=$(printf "${color}%s\033[00m %d%%" "$bar" "$pct_int")
fi

# Assemble left.
left=""
sep=""
[ -n "$git_info" ] && { left="${left}${sep}${git_info}"; sep=" | "; }
[ -n "$model" ] && { left="${left}${sep}\033[01;36m${model}\033[00m"; sep=" | "; }
[ -n "$context_bar" ] && { left="${left}${sep}${context_bar}"; sep=" | "; }
[ -z "$left" ] && left="Claude Code"

# ---------- Right side from cache ----------
right=""
if [ -f "$CACHE_FILE" ] && command -v jq >/dev/null 2>&1; then
  outdated_count=$(jq -r '.outdatedCount // 0' "$CACHE_FILE" 2>/dev/null)
  gaia_has_update=$(jq -r '.gaiaHasUpdate // false' "$CACHE_FILE" 2>/dev/null)
  gaia_latest=$(jq -r '.gaiaLatest // empty' "$CACHE_FILE" 2>/dev/null)

  segments=()
  if [ -n "$outdated_count" ] && [ "$outdated_count" -gt 0 ] 2>/dev/null; then
    segments+=("$(printf '\033[01;33m[Run /migrate (%d outdated)]\033[00m' "$outdated_count")")
  fi
  if [ "$gaia_has_update" = "true" ] && [ -n "$gaia_latest" ]; then
    segments+=("$(printf '\033[01;36m[GAIA %s available — /gaia-update]\033[00m' "$gaia_latest")")
  fi
  if [ "${#segments[@]}" -gt 0 ]; then
    right="${segments[0]}"
    for ((i=1; i<${#segments[@]}; i++)); do
      right="${right}  ${segments[$i]}"
    done
  fi
fi

# Fire the background refresher; never block.
if [ -x "$CHECK_SCRIPT" ]; then
  (cd "$(dirname "$GAIA_DIR")" && nohup bash "$CHECK_SCRIPT" >/dev/null 2>&1 &) >/dev/null 2>&1
fi

# ---------- Compose with right-alignment ----------
if [ -z "$right" ]; then
  printf '%b' "$left"
  exit 0
fi

cols="${COLUMNS:-120}"
left_visible=$(printf '%b' "$left" | sed 's/\x1b\[[0-9;]*m//g' | awk '{print length}')
right_visible=$(printf '%b' "$right" | sed 's/\x1b\[[0-9;]*m//g' | awk '{print length}')
pad=$((cols - left_visible - right_visible))
if [ "$pad" -lt 2 ]; then
  pad=2
fi
spaces=$(printf '%*s' "$pad" '')
printf '%b%s%b' "$left" "$spaces" "$right"
