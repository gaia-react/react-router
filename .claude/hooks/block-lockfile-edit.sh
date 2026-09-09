#!/usr/bin/env bash
# PreToolUse Edit/Write hook: deny direct edits to package lockfiles.
# Lockfile changes must come from `pnpm install` (or equivalent), never from
# manual edits, which routinely produce broken/inconsistent lockfiles.
set -euo pipefail

payload=$(cat)
# jq-availability arm: refuse loudly rather than fail open when the interpreter
# this hook reads its payload with is absent. What that buys, and the contract
# the literals below satisfy, live in .claude/hooks/lib/jq-availability.sh.
_jq_lib_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/lib" 2>/dev/null && pwd)" || _jq_lib_dir=''
set +e
# shellcheck source=lib/jq-availability.sh
[ -n "$_jq_lib_dir" ] && [ -f "$_jq_lib_dir/jq-availability.sh" ] && . "$_jq_lib_dir/jq-availability.sh" 2>/dev/null
set -e
if ! type gaia_require_jq >/dev/null 2>&1; then
  printf 'BLOCKED: block-lockfile-edit.sh cannot load lib/jq-availability.sh, so this call cannot be checked. Fail-loud, not fail-open -- restore the library.\n' >&2
  exit 2
fi
gaia_require_jq 'the lockfile guard' "$payload" tool_input

file_path=$(jq -r '.tool_input.file_path // empty' <<<"$payload")
[[ -n "$file_path" ]] || exit 0

base=$(basename "$file_path")

case "$base" in
  pnpm-lock.yaml)
    jq -n --arg r "BLOCKED: direct edits to pnpm-lock.yaml are forbidden. Run 'pnpm install' (or 'pnpm add/remove') and let pnpm regenerate the lockfile." '{
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: $r
      }
    }'
    exit 0
    ;;
esac

exit 0
