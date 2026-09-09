#!/usr/bin/env bash
# Shared harness for the .gaia/tests/hooks bats suites: one quote-safe hook
# invocation, one assertion form per decision mechanism, and one assertion that
# a hook is registered in `.claude/settings.json` at all.
#
# The directive below is the one thing this file needs that a suite does not:
# `status` and `output` are set by bats' own `run`, which is invisible to the
# linter here because this is a `.sh` held to the strictest severity floor
# rather than a `.bats` file (see .gaia/tests/shell-lint.sh). Scoped to the one
# code, so every other finding in this file still fires.
# shellcheck disable=SC2154
#
# Source it from `setup()`, never `setup_file()`. bats runs `setup_file` in a
# separate process, so functions defined there are invisible to test bodies:
#
#   setup() {
#     . "$BATS_TEST_DIRNAME/helpers/run-hook.sh"
#     HOOK_ABS="$(cd "$BATS_TEST_DIRNAME/../../../.claude/hooks" && pwd)/x.sh"
#   }
#
# A suite keeps its own payload-building wrapper and calls the invocation here
# to deliver it, so `run_hook`-style suite-local names never collide with these.
#
# WHY THE PAYLOAD IS POSITIONAL. `invoke_hook` passes the payload and the hook
# path as arguments to the inner `bash -c`, rather than interpolating them into
# an outer quoted string. Interpolation is not a style choice: a fixture
# carrying a quote of its own terminates the wrapper early and the hook then
# reads a DIFFERENT payload than the one the fixture spells. The hook denies for
# the wrong reason, or never parses the payload at all, and the test greens
# having proved nothing about the case it is named for.
#
# ASSERTIONS ARE NAMED FOR THE MECHANISM, not for the verdict, because the
# suites here test hooks with three incompatible decision contracts: the exit
# code carries the verdict, JSON on stdout carries it, or JSON on stdout defers
# it to the human. A generic `assert_denied` hides which contract is under test,
# and a suite that picks the wrong one asserts against a mechanism its hook never
# uses. Mechanisms 1 and 2 come as pairs; mechanism 3 is a single function,
# because a hook that asks has no allow verdict of its own to assert.
#
# Every form below is bash-3.2 safe per .claude/rules/bats-assertions.md: `[ ]`
# for status and emptiness, `grep -qF` for a substring, `<positive> && return 1`
# for an absence. A bare `[[ ]]` and a `!`-negation both fail to fail on a
# non-final assertion line.

# THE TWIN, deliberately not shared. The INV-7 concurrency meter carries the
# same one-line idiom as `gaia_deliver_hook` in
# .gaia/tests/concurrency/lib/concurrency-harness.sh. The two are not merged
# because the forms below call bats' `run` themselves, which every suite here
# wants and that suite cannot use: its scenarios wrap delivery in a
# tree-scoped or environment-scoped runner, capture stdout alone, or drive a
# hook purely for its side effect. Keep the two in step by name; a change to
# the invocation below almost certainly applies there too.

# `GAIA_HOOK_NAME_RE`, which the registration assertion at the foot of this file
# matches with, comes from the gates' own library rather than a copy here: it is
# the one spelling of a hook name inside a registration command, and a copy of it
# would drift from the original silently, because each holder keeps passing
# against the copy it reads. Rooted at this file's own on-disk location, so it
# resolves however a suite is invoked.
# shellcheck source=../../../scripts/hook-registration-lib.sh
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../../../scripts/hook-registration-lib.sh"

# invoke_hook PAYLOAD HOOK
# Pipes PAYLOAD to HOOK, capturing status/output through bats' `run`.
invoke_hook() {
  run bash -c 'printf %s "$1" | bash "$2"' _ "$1" "$2"
}

# invoke_hook_in DIR PAYLOAD HOOK
# Same, with DIR as the working directory. Hooks that resolve their own
# libraries or repo state relative to cwd need this rather than `invoke_hook`.
invoke_hook_in() {
  run bash -c 'cd "$1" && printf %s "$2" | bash "$3"' _ "$1" "$2" "$3"
}

# --- mechanism 1: the exit code carries the verdict ------------------------
# The hook blocks by exiting 2 with a BLOCKED message, and allows by exiting 0
# silently. PreToolUse reads exit 2 as a block and shows the message to Claude.
# Under this contract a hook says nothing at all when it allows, so the allow
# assertion is an assertion of silence.

assert_blocked_by_exit() {
  [ "$status" -eq 2 ]
  grep -qF -- 'BLOCKED' <<<"$output"
}

assert_allowed_by_exit() {
  [ "$status" -eq 0 ]
  [ -z "$output" ]
}

# --- mechanism 2: JSON on stdout carries the verdict -----------------------
# The hook always exits 0; a deny is a `"permissionDecision": "deny"` field in
# the JSON it writes to stdout, and an allow writes no deny. A suite whose hook
# is additionally silent on an allow asserts that on top of the pair here,
# rather than trading this assertion for that one.

assert_denied_by_json() {
  [ "$status" -eq 0 ]
  grep -qF -- '"permissionDecision": "deny"' <<<"$output"
}

assert_allowed_by_json() {
  [ "$status" -eq 0 ]
  grep -qF -- '"permissionDecision": "deny"' <<<"$output" && return 1
  return 0
}

# --- mechanism 3: JSON on stdout defers the verdict to the human -----------
# The hook always exits 0 and writes `"permissionDecision": "ask"`, which
# prompts the operator instead of ruling. It is a separate mechanism rather
# than a third verdict under mechanism 2 because the two failure directions are
# opposite: `assert_allowed_by_json` passes on an `ask` (there is no deny in the
# output), so a suite that reached for it to mean "not blocked" would green on a
# hook that had stopped asking entirely. Assert the ask positively.

assert_asked_by_json() {
  [ "$status" -eq 0 ]
  grep -qF -- '"permissionDecision": "ask"' <<<"$output"
}

# --- registration: is the hook wired into settings.json at all? ------------
# Separate from the three mechanisms above: those drive a hook and read its
# verdict, this one reads the file that decides whether the hook is reached.
#
# It answers REGISTRATION and nothing else, deliberately. Whether a registration
# names its script in a form that resolves independently of the shell's working
# directory is a different question, and it already has an owner:
# .gaia/scripts/check-hook-command-rooting.sh tests it as a property over every
# registered command, under .gaia/tests/whole-tree-invariants.sh, and
# .claude/rules/maintainers/hook-registration.md states the sanctioned form in
# prose. A suite that pinned the spelling here instead would hold a second,
# weaker copy of that claim, one that goes green against itself while the form
# it encodes moves, which is exactly what having the form named once prevents.
#
# hook_registered SETTINGS EVENT_FILTER HOOK_NAME
# Asserts that the entries EVENT_FILTER selects in the settings file SETTINGS
# carry a command that runs HOOK_NAME. EVENT_FILTER is a jq expression,
# `.hooks.PreToolUse[] | select(.matcher == "Bash")` for a matcher-scoped event
# or `.hooks.PostCompact[]` for one registered without a matcher; HOOK_NAME is
# the bare script name. Fails when the event key is absent, when the filter
# selects nothing, and when nothing it selects runs the hook, so an assertion
# cannot pass over an empty set.
#
# SETTINGS is an argument rather than the `SETTINGS_ABS` every suite here
# already resolves, because a suite whose only remaining read of that variable
# happened inside this function would assign it and never mention it again,
# which is an unused-variable warning at the `.bats` severity floor.
hook_registered() {
  local settings="$1" filter="$2" hook="$3"
  run jq -e --arg re "$GAIA_HOOK_NAME_RE" --arg hook "$hook" \
    "[ $filter | .hooks[] | .command // empty ] |
       any([match(\$re; \"g\").string] | any(. == \".claude/hooks/\" + \$hook))" \
    "$settings"
  [ "$status" -eq 0 ]
}
