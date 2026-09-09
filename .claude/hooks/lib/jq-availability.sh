#!/usr/bin/env bash
# shellcheck shell=bash
#
# The shared jq-availability arm for the PreToolUse hook layer.
#
# CONTRACT WITH THE CALLER. Source this file, then call gaia_require_jq as the
# first thing after the payload is read. With jq on PATH the call returns 0 and
# the hook proceeds unchanged. With jq absent the call never returns: it writes
# a plain-text reason to stderr and exits 2, or exits 0 when the caller supplied
# binding literals and the raw payload carries none of them.
#
# WHY THE HOOK'S OWN jq READ CANNOT BE LEFT TO FAIL. Under `set -euo pipefail` a
# missing jq ends the payload read at status 127, and the PreToolUse contract
# (`wiki/concepts/Claude Hooks.md`) reads every non-zero status other than 2 as
# a NON-BLOCKING error: the tool call proceeds, with no denial and no diagnostic
# the operator will see. A fail-closed hook that cannot read its payload has to
# refuse loudly instead, and the refusal cannot route through the caller's own
# deny() helper, because that helper builds its JSON response with jq. The
# exit-code block contract needs no interpreter at all, which is why this arm
# uses it.
#
# WHY THE LITERALS NARROW THE REFUSAL. A hook that cannot read its payload also
# cannot tell whether the call is one it binds, so an unconditional refusal on a
# hook registered against the Bash matcher denies every command in the session,
# the one that installs jq among them: a session with no way out from inside it.
# A caller on that matcher passes the literal, or literals, whose ABSENCE from
# the raw payload proves the call sits outside its remit; absence allows, exactly
# as a parsed non-member is allowed. Presence is not proof of membership, since
# an ordinary command merely naming one satisfies it, and that over-deny is the
# safe direction. A caller whose matcher cannot reach the install command passes
# no literal at all and refuses unconditionally within that matcher.
#
# The literal set is a reading of the caller's own binding predicate rather than
# a policy choice about it, so it belongs at the call site and never here. Each
# caller states beside its call which spellings its literals cannot reach.
#
# Matching is case-insensitive and unanchored, which can only widen a refusal.
#
# Bash 3.2 compatible: no associative arrays, no `${x,,}`.

# Sourced by several hooks in one process only when one hook sources another,
# which none do; the guard is here so a caller may source it defensively.
if [ -n "${GAIA_JQ_AVAILABILITY_SH:-}" ]; then
  return 0
fi
GAIA_JQ_AVAILABILITY_SH=1

# gaia_require_jq <what-cannot-be-checked> <raw-payload> [binding-literal...]
#
# Returns 0 when jq is on PATH. Otherwise exits: 2 with a reason on stderr when
# the call is inside the caller's remit, 0 when the literals prove it is not.
gaia_require_jq() {
  if command -v jq >/dev/null 2>&1; then
    return 0
  fi

  local subject="$1" payload="$2"
  shift 2

  if [ "$#" -gt 0 ]; then
    local haystack needle matched=0
    haystack=$(printf '%s' "$payload" | tr '[:upper:]' '[:lower:]')
    for needle in "$@"; do
      needle=$(printf '%s' "$needle" | tr '[:upper:]' '[:lower:]')
      case "$haystack" in
        *"$needle"*)
          matched=1
          break
          ;;
      esac
    done
    if [ "$matched" -eq 0 ]; then
      exit 0
    fi
  fi

  printf 'BLOCKED: jq is not on PATH, so this call cannot be checked against %s. Fail-loud, not fail-open -- install jq and retry.\n' "$subject" >&2
  exit 2
}
