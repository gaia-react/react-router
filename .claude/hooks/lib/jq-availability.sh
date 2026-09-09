#!/usr/bin/env bash
# shellcheck shell=bash
#
# The shared jq-availability arm for the PreToolUse hook layer.
#
# CONTRACT WITH THE CALLER. Source this file, then call gaia_require_jq as the
# first thing after the payload is read. With jq on PATH the call returns 0 and
# the hook proceeds unchanged. With jq absent the call never returns: it writes
# a plain-text reason to stderr and exits 2, or exits 0 when the caller supplied
# binding literals and the region of the payload its own predicate reads carries
# none of them.
#
# WHY THE HOOK'S OWN jq READ CANNOT BE LEFT TO FAIL. Under `set -euo pipefail` a
# missing jq ends the payload read at status 127, and the PreToolUse contract
# (`wiki/concepts/Claude Hooks.md`) reads every non-zero status other than 2 as
# a NON-BLOCKING error: the tool call proceeds, with no denial and no diagnostic
# the operator will see. A fail-closed hook that cannot read its payload has to
# refuse loudly instead, and the refusal cannot route through the caller's own
# deny() helper, because that helper builds its JSON response with jq. The
# exit-code contract needs no interpreter at all, which is why this arm uses it.
#
# WHY THE LITERALS NARROW THE REFUSAL. A hook that cannot read its payload also
# cannot tell whether the call is one it binds, so an unconditional refusal on a
# hook registered against the Bash matcher denies every command in the session,
# the one that installs jq among them: a session with no way out from inside it.
# A caller on that matcher passes the literal, or literals, whose ABSENCE from
# the payload proves the call sits outside its remit; absence allows, exactly as
# a parsed non-member is allowed. Presence is not proof of membership, since an
# ordinary command merely naming one satisfies it, and that over-deny is the
# safe direction. A caller whose matcher cannot reach the install command passes
# no literal at all and refuses unconditionally within that matcher.
#
# WHY THE REGION IS THE CALLER'S TO NAME, and why the whole document is the
# wrong surface. A PreToolUse payload carries `session_id`, `transcript_path`
# and `cwd` alongside the field the caller's predicate actually reads, and every
# one of those is a filesystem path nobody chose for this purpose. Matched
# against the whole document, `rm` is satisfied by a checkout under a `terraform`
# directory and `env` by one under a `.venv`, so on such a machine the arm denies
# EVERY call on that matcher, the jq install included -- the exact session with
# no way out the literals exist to prevent, arrived at by the mechanism meant to
# prevent it. So the caller names the region: a JSON key to narrow at, or `-` for
# the whole document, which is right only for a caller whose predicate reads a
# top-level field.
#
# The narrowing is a prefix strip at the key, because a hook that has no jq has
# no JSON parser either. It drops every field emitted BEFORE the key, which is
# where the harness puts all three path-bearing fields, and it is honest about
# what it does not do: a field emitted after the key stays in the surface, and a
# payload that carries the key nowhere falls back to the whole document rather
# than to an empty one, because an empty haystack would allow instead of refuse.
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

# gaia_require_jq <what-cannot-be-checked> <raw-payload> <region-key> [binding-literal...]
#
# <region-key> is the JSON key whose value the caller's predicate reads, or `-`
# for the whole document. It is consulted only when binding literals follow;
# a caller that passes none refuses unconditionally and the region is unread.
#
# Returns 0 when jq is on PATH. Otherwise exits: 2 with a reason on stderr when
# the call is inside the caller's remit, 0 when the literals prove it is not.
gaia_require_jq() {
  # Arity is checked before the locals below read $3, and it refuses rather than
  # returning. A caller that omits an argument would otherwise expand an unset
  # positional under the `set -u` every armed hook arms, ending the hook at
  # status 1 -- which PreToolUse reads as a non-blocking error, so a mis-arity
  # call would fail open in exactly the way a missing call does. Refusing here
  # makes a wrong call loud instead of silent.
  if [ "$#" -lt 3 ]; then
    printf 'BLOCKED: gaia_require_jq was called with %s argument(s) and needs at least 3 (subject, payload, region key). Fail-loud, not fail-open -- fix the call site.\n' "$#" >&2
    exit 2
  fi

  if command -v jq >/dev/null 2>&1; then
    return 0
  fi

  local subject="$1" payload="$2" region_key="$3"
  shift 3

  if [ "$#" -gt 0 ]; then
    local haystack="$payload" needle matched=0 cut_head cut_tail
    if [ "$region_key" != '-' ]; then
      case "$payload" in
        # The key is quoted separately inside the strip so it is matched as a
        # literal rather than as a pattern; an unquoted expansion there would
        # read a glob metacharacter in the key as one.
        *"\"$region_key\""*) haystack="${payload#*\""$region_key"\"}" ;;
      esac
      # Cutting the ambient HEAD is only half of it. Inside tool_input the Bash
      # tool carries a model-authored `description` beside the command, and no
      # caller predicate reads it, so it is the same class of field as `cwd` one
      # level deeper: `rm` is satisfied by "Confirm", "form" or "terms", `test`
      # by "latest", `env` by "environment". Left in, it denies the jq install
      # on the wording of its own description.
      #
      # TWO-SIDED, not a suffix strip, and that is the whole of why the shape is
      # what it is. Cutting from the key to the end of the region holds only
      # while `description` is emitted after the field the predicate reads.
      # Emitted FIRST, that cut takes the command or path with it: nothing any
      # binding literal would match survives in the haystack, nothing matches,
      # and the arm allows. That is the fail-open direction on the guard whose
      # purpose is to close it, and its trigger is emitted key order, which GAIA
      # does not control. Keeping the text on BOTH sides and dropping only the
      # field's own value holds for either order.
      #
      # Giving up and leaving the description in on an unexpected shape is NOT
      # the safe fallback it looks like: the description is model-authored prose,
      # so it carries the literals as substrings almost unconditionally, and
      # leaving it in denies the jq install on the wording of its own
      # description. That is the session with no way out the literals exist to
      # prevent.
      #
      # LAST occurrence, and both expansions pick the same one: a command whose
      # own text carries the field name leaves the real description standing,
      # which only widens the haystack, while cutting at the first would drop
      # real command text, the under-deny direction.
      #
      # The pattern is the quoted KEY alone, with no leading comma and no
      # trailing colon, because the separators are not stable: a compact encoder
      # writes `,"description":` while a pretty-printing one writes a newline and
      # indent between the comma and the key. Matching the key by itself holds
      # for both, and for a payload that carries no description at all the case
      # below matches nothing and leaves the haystack whole.
      #
      # HONEST LIMIT of the value scan: it ends the value at the first `"` after
      # the opening one, so a description carrying an escaped quote ends it early
      # and leaves the remainder of the prose in the haystack. That is the
      # widening direction, the same one an unstripped description produces, and
      # it costs a denial rather than an allow.
      #
      # The two sides are joined with a space so the seam cannot spell a literal
      # that neither side carries on its own.
      case "$haystack" in
        *'"description"'*)
          cut_head="${haystack%\"description\"*}"
          cut_tail="${haystack##*\"description\"}"
          cut_tail="${cut_tail#*\"}"
          cut_tail="${cut_tail#*\"}"
          haystack="$cut_head $cut_tail"
          ;;
      esac
    fi
    haystack=$(printf '%s' "$haystack" | tr '[:upper:]' '[:lower:]')
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
