#!/usr/bin/env bats

# Tests for .claude/hooks/lib/jq-availability.sh as the PreToolUse layer runs
# it: every blocking hook driven with jq off PATH, against a payload inside its
# remit and, where the hook carries binding literals, one outside it.
#
# The suite is per-layer rather than per-hook because the claim is a property of
# the layer: with no jq on PATH the fail-closed hooks refuse and the advisory
# ones stand down. A copy of these two assertions in each hook's own suite would
# be eighteen places for the claim to drift, and the arm they all reach is one
# function.
#
# WHAT A FAILURE HERE MEANS. The hook read its payload with jq under errexit and
# died at status 127, which the PreToolUse contract reads as a NON-BLOCKING
# error: the call it was written to deny proceeded, with no denial and no
# diagnostic. That is the defect the arm exists to close, and a green run of the
# hook's own suite says nothing about it, because every other test in those
# suites runs with jq present.
#
# Run under bash 5: `bash .gaia/scripts/bats5.sh .gaia/tests/hooks/jq-availability.bats`.
#
# Assertion style: bash-3.2-safe per .claude/rules/bats-assertions.md.

setup() {
  . "$BATS_TEST_DIRNAME/helpers/run-hook.sh"
  . "$(cd "$BATS_TEST_DIRNAME/../../.." && pwd)/.gaia/tests/helpers/path.sh"
  HOOKS_SRC=$(cd "$BATS_TEST_DIRNAME/../../../.claude/hooks" && pwd)
}

# The mirroring rebuild rather than the dropping one: jq shares a directory with
# the bash, grep and cat both the hooks and these assertions still need, so
# dropping the directory would take them too (.gaia/tests/helpers/path.sh).
scrub_jq_from_path() {
  local rebuilt
  rebuilt="$(path_shim_without jq)"
  export PATH="$rebuilt"
}

# without_jq <hook-basename> <payload>
#
# The payload is built by the caller while jq is still reachable; only the hook
# runs without it.
without_jq() {
  scrub_jq_from_path
  [ -z "$(command -v jq)" ]
  invoke_hook "$2" "$HOOKS_SRC/$1"
}

bash_payload() {
  jq -n --arg c "$1" '{tool_name: "Bash", tool_input: {command: $c}}'
}

edit_payload() {
  jq -n --arg p "$1" '{tool_name: "Edit", tool_input: {file_path: $p, new_string: "x"}}'
}

# The command that repairs the machine. Every literal set below is checked
# against it, because a hook whose refusal catches this one leaves the session
# with no way out from inside it.
readonly INSTALL_CMD="brew install jq"

# --- the matcher cannot reach the jq install, so the refusal is unconditional -

@test "jq absent: block-env-write refuses an edit rather than letting it through" {
  local json
  json=$(edit_payload ".env.local")
  without_jq block-env-write.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-eslint-config-edit refuses an edit" {
  local json
  json=$(edit_payload "eslint.config.ts")
  without_jq block-eslint-config-edit.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-invalid-yaml-write refuses an edit" {
  local json
  json=$(edit_payload ".github/workflows/ci.yml")
  without_jq block-invalid-yaml-write.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-lockfile-edit refuses an edit" {
  local json
  json=$(edit_payload "pnpm-lock.yaml")
  without_jq block-lockfile-edit.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-secrets-write refuses a write carrying a key" {
  local json
  json=$(edit_payload "app/config.ts")
  without_jq block-secrets-write.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-vitest-globals-tsconfig refuses an edit" {
  local json
  json=$(edit_payload "tsconfig.json")
  without_jq block-vitest-globals-tsconfig.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-worktree-path-mismatch refuses an edit" {
  local json
  json=$(edit_payload "app/foo.ts")
  without_jq block-worktree-path-mismatch.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-serena-cross-tree-activation refuses an activation" {
  local json
  json=$(jq -n '{tool_name: "mcp__serena__activate_project", tool_input: {project: "/tmp/other"}}')
  without_jq block-serena-cross-tree-activation.sh "$json"
  assert_blocked_by_exit
}

# --- the matcher CAN reach the jq install, so the refusal is narrowed ---------
#
# Each pair is the whole claim: the in-remit call is refused, and the install
# that repairs the machine is not.

@test "jq absent: block-bare-test refuses a payload carrying its literal" {
  local json
  json=$(bash_payload "pnpm test")
  without_jq block-bare-test.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-bare-test allows the jq install" {
  local json
  json=$(bash_payload "$INSTALL_CMD")
  without_jq block-bare-test.sh "$json"
  assert_allowed_by_exit
}

@test "jq absent: block-env-read refuses a dotenv read" {
  local json
  json=$(bash_payload "cat .env.local")
  without_jq block-env-read.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-env-read allows the jq install" {
  local json
  json=$(bash_payload "$INSTALL_CMD")
  without_jq block-env-read.sh "$json"
  assert_allowed_by_exit
}

@test "jq absent: block-main-destructive-git refuses a git command" {
  local json
  json=$(bash_payload "git push --force origin main")
  without_jq block-main-destructive-git.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-main-destructive-git allows the jq install" {
  local json
  json=$(bash_payload "$INSTALL_CMD")
  without_jq block-main-destructive-git.sh "$json"
  assert_allowed_by_exit
}

@test "jq absent: block-no-verify refuses a git command" {
  local json
  json=$(bash_payload "git commit --no-verify -m x")
  without_jq block-no-verify.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-no-verify allows the jq install" {
  local json
  json=$(bash_payload "$INSTALL_CMD")
  without_jq block-no-verify.sh "$json"
  assert_allowed_by_exit
}

@test "jq absent: block-manifest-write refuses a write to the manifest" {
  local json
  json=$(edit_payload ".gaia/manifest.json")
  without_jq block-manifest-write.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-manifest-write allows an edit naming no manifest" {
  local json
  json=$(edit_payload "app/foo.ts")
  without_jq block-manifest-write.sh "$json"
  assert_allowed_by_exit
}

@test "jq absent: block-rm-rf refuses a command carrying its literal" {
  local json
  json=$(bash_payload "rm -rf /")
  without_jq block-rm-rf.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-rm-rf allows the jq install" {
  local json
  json=$(bash_payload "$INSTALL_CMD")
  without_jq block-rm-rf.sh "$json"
  assert_allowed_by_exit
}

@test "jq absent: block-secrets-read refuses a read of a key path" {
  local json
  json=$(jq -n '{tool_name: "Read", tool_input: {file_path: "certs/server.pem"}}')
  without_jq block-secrets-read.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-secrets-read allows a read naming no secret class" {
  local json
  json=$(jq -n '{tool_name: "Read", tool_input: {file_path: "README.md"}}')
  without_jq block-secrets-read.sh "$json"
  assert_allowed_by_exit
}

@test "jq absent: block-spec-plan-chain refuses the skill it denies" {
  local json
  json=$(jq -n '{hook_event_name: "PreToolUse", tool_name: "Skill", tool_input: {name: "gaia-plan"}}')
  without_jq block-spec-plan-chain.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-spec-plan-chain allows the jq install" {
  local json
  json=$(bash_payload "$INSTALL_CMD")
  without_jq block-spec-plan-chain.sh "$json"
  assert_allowed_by_exit
}

@test "jq absent: block-fourth-audit-round refuses a member dispatch" {
  local json
  json=$(jq -n '{hook_event_name: "PreToolUse", tool_name: "Agent", tool_input: {subagent_type: "code-audit-frontend"}}')
  without_jq block-fourth-audit-round.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-fourth-audit-round allows a dispatch naming no member" {
  local json
  json=$(jq -n '{hook_event_name: "PreToolUse", tool_name: "Agent", tool_input: {subagent_type: "general-purpose"}}')
  without_jq block-fourth-audit-round.sh "$json"
  assert_allowed_by_exit
}

@test "jq absent: block-selfheal-paths refuses a member edit" {
  local json
  json=$(jq -n '{agent_type: "code-audit-frontend", tool_name: "Edit", tool_input: {file_path: "test/foo.ts"}}')
  without_jq block-selfheal-paths.sh "$json"
  assert_blocked_by_exit
}

@test "jq absent: block-selfheal-paths allows the jq install" {
  local json
  json=$(bash_payload "$INSTALL_CMD")
  without_jq block-selfheal-paths.sh "$json"
  assert_allowed_by_exit
}

# --- the advisory hooks stand down, which is the opposite obligation ---------
#
# They nudge and never deny, so refusing on a missing interpreter would trade a
# lost reminder for a blocked session. The pair below is what keeps a later
# uniformity pass from "fixing" them into refusals.

@test "jq absent: check-i18n-strings stands down silently" {
  local json
  json=$(edit_payload "app/pages/Home/index.tsx")
  without_jq check-i18n-strings.sh "$json"
  assert_allowed_by_exit
}

@test "jq absent: check-story-exists stands down silently" {
  local json
  json=$(edit_payload "app/components/Button/index.tsx")
  without_jq check-story-exists.sh "$json"
  assert_allowed_by_exit
}

# --- the arm's own library is unreachable ------------------------------------

@test "the library missing refuses too, rather than running the hook unguarded" {
  # A hook resolves the library from its own on-disk location, so a copy in a
  # tree with an empty lib/ reproduces a broken install without touching the
  # real one. jq stays on PATH here: the claim is about the load, not about the
  # interpreter.
  local dir json
  dir="$BATS_TEST_TMPDIR/no-lib"
  mkdir -p "$dir/lib"
  cp "$HOOKS_SRC/block-lockfile-edit.sh" "$dir/block-lockfile-edit.sh"

  json=$(edit_payload "pnpm-lock.yaml")
  invoke_hook "$json" "$dir/block-lockfile-edit.sh"
  [ "$status" -eq 2 ]
  grep -qF -- 'cannot load lib/jq-availability.sh' <<<"$output"
}
