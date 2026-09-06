#!/usr/bin/env bats
# SC2016 is intentional file-wide: every fixture body is single-quoted precisely
# so the `$` expansions inside it reach the fixture file as literal text. The
# unexpanded pipeline IS the thing under test, so letting this shell expand one
# would delete the evidence.
# shellcheck disable=SC2016
#
# Tests for .gaia/scripts/lint-sigpipe-readers.sh: the static gate that flags a
# short-circuiting reader standing downstream of a pipe in a file that arms
# `pipefail`, the shape whose pipeline status INVERTS on a match because the
# quiet reader closes the pipe and the upstream dies of SIGPIPE.
#
# THIS SUITE IS THE BLOCKING RUNNER. shell-lint.sh invokes the gate a second,
# advisory way, but a gate run against a tree that is already clean reports
# clean whether its predicate works or not, so a broken predicate is
# indistinguishable from an honest tree there. Every test below drives the gate
# against a fixture tree shaped one way at a time.
#
# Three jobs. Prove the detector fires on the class, in each spelling the flag
# cluster takes and across the line breaks a real pipeline uses; prove it stays
# quiet on the legitimate shapes, which for this gate includes the repair it
# advertises, since a gate that reds on its own advice cannot ship; and assert
# the real scanned tree is clean so a regression fails CI.
#
# Two tests are load-bearing beyond coverage. "reds against the historical
# wiki-session-stop shape" carries the exact line gaia-react/gaia#1810 was filed
# against, so the gate is proven to reach the instance it was written for rather
# than a tidied stand-in. And "quiet on the here-string repair" carries the
# shape the gate prints as its fix.
#
# Assertion style: bash-3.2-safe per .claude/rules/bats-assertions.md.
#
# The gate resolves its scan surface with `git ls-files` relative to cwd, so
# every fixture is a real git repository with its files added.

setup() {
  THIS_DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" && pwd )"
  REPO_ROOT="$( cd "$THIS_DIR/../../.." && pwd )"
  LINTER="$REPO_ROOT/.gaia/scripts/lint-sigpipe-readers.sh"
  TMP=""
}

teardown() {
  [ -n "$TMP" ] && [ -d "$TMP" ] && rm -rf "$TMP"
  return 0
}

# fixture_repo_bare: an initialized git repo in $TMP with no files yet and no
# seeded surface. Point a test that needs an empty scan set here.
fixture_repo_bare() {
  TMP="$(mktemp -d -t sigpipe-lint-XXXXXX)"
  git -C "$TMP" init -q .
}

# fixture_repo: fixture_repo_bare with one benign tracked script, so the
# discovery is non-empty and a test reaches class detection rather than the
# empty-surface error. The seed is `seed.sh` rather than `check.sh` so
# fixture_script below can overwrite the latter without emptying the surface.
fixture_repo() {
  fixture_repo_bare
  fixture_file seed.sh 'true'
}

# fixture_file <relpath> <body>: write <body> verbatim to $TMP/<relpath> and
# track it. `printf %s` never interprets an escape, so the body reaches the file
# as the characters the gate is meant to read. Call fixture_repo first.
fixture_file() {
  local dest="$TMP/$1"
  mkdir -p "$( dirname "$dest" )"
  printf '%s\n' "$2" > "$dest"
  git -C "$TMP" add -A
}

# fixture_script <body>: the common case, a tracked shell script that arms
# pipefail. The `set` line is prepended here rather than repeated in every
# fixture, so a test body is the pipeline under test and nothing else; line 1 is
# the shebang, line 2 the `set`, so a one-line body reports at line 3.
fixture_script() {
  fixture_file check.sh "#!/usr/bin/env bash
set -euo pipefail
$1"
}

# fixture_script_unarmed <body>: the same, with no pipefail anywhere.
fixture_script_unarmed() {
  fixture_file check.sh "#!/usr/bin/env bash
set -eu
$1"
}

# run_linter: run the gate from inside the fixture repo.
run_linter() {
  run bash -c "cd '$TMP' && bash '$LINTER' 2>&1"
}

# --- the class fires -------------------------------------------------------

@test "reds against the historical wiki-session-stop shape" {
  fixture_repo
  fixture_script 'if git log "$start_sha..HEAD" --name-only --pretty=format: 2>/dev/null | grep -q '"'"'^wiki/'"'"'; then
  echo changed
fi'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:3:" <<<"$output" || return 1
  grep -qF -- "short-circuits a pipeline under pipefail" <<<"$output"
}

@test "flags a printf feeding a quiet grep" {
  fixture_repo
  fixture_script 'printf "%s\n" "$labels" | grep -q needle'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:3:" <<<"$output"
}

@test "flags an echo feeding a quiet grep" {
  fixture_repo
  fixture_script 'echo "$out" | grep -qE needle'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:3:" <<<"$output"
}

# Coverage is per element: every cluster spelling this gate claims to reach gets
# its own fixture, because a detector keyed on the bare `-q` token passes a
# one-spelling suite while missing every cluster the tree actually writes.
@test "flags each -q-bearing flag cluster" {
  fixture_repo
  fixture_script 'printf "%s" "$a" | grep -qF one
printf "%s" "$b" | grep -qxF two
printf "%s" "$c" | grep -qvF three
printf "%s" "$d" | grep -qiE four
printf "%s" "$e" | grep -nq five'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:3:" <<<"$output" || return 1
  grep -qF -- "check.sh:4:" <<<"$output" || return 1
  grep -qF -- "check.sh:5:" <<<"$output" || return 1
  grep -qF -- "check.sh:6:" <<<"$output" || return 1
  grep -qF -- "check.sh:7:" <<<"$output"
}

@test "flags the long-form quiet flags" {
  fixture_repo
  fixture_script 'printf "%s" "$a" | grep --quiet one
printf "%s" "$b" | grep --silent two'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:3:" <<<"$output" || return 1
  grep -qF -- "check.sh:4:" <<<"$output"
}

@test "flags rg as well as grep" {
  fixture_repo
  fixture_script 'printf "%s" "$a" | rg -q needle'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:3:" <<<"$output"
}

@test "flags a path-qualified reader" {
  fixture_repo
  fixture_script 'printf "%s" "$a" | /usr/bin/grep -q needle'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:3:" <<<"$output"
}

@test "flags a reader negated with !, which still reads the pipeline status" {
  fixture_repo
  fixture_script 'some_command | ! grep -q needle'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:3:" <<<"$output"
}

@test "flags the right half of a |& pipe" {
  fixture_repo
  fixture_script 'some_command |& grep -q needle'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:3:" <<<"$output"
}

# The continuation shapes are the reason the scan carries line state at all. A
# per-line detector that only looks for a pipe to the LEFT of the reader on the
# same line misses the trailing-bar form entirely, and the tree writes both.
@test "flags a reader on a continuation line opened by a leading bar" {
  fixture_repo
  fixture_script 'some_command \
    "$arg" \
    | grep -qvF needle'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:5:" <<<"$output"
}

@test "flags a reader on the line after a trailing bar" {
  fixture_repo
  fixture_script 'some_command |
  grep -q needle'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:4:" <<<"$output"
}

@test "flags a reader whose open pipeline is carried across a comment line" {
  fixture_repo
  fixture_script 'some_command |
  # bash accepts a comment where a newline is accepted
  grep -q needle'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:5:" <<<"$output"
}

# The buffered-until-END property. `pipefail` is routinely armed by a caller
# below, or by a `set` line an author moved, so a scan that decided armedness on
# the way past would report this file clean on the strength of line order alone.
@test "flags a pipeline whose file arms pipefail on a LATER line" {
  fixture_repo
  fixture_file check.sh '#!/usr/bin/env bash
printf "%s" "$a" | grep -q needle
set -o pipefail'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:2:" <<<"$output"
}

@test "reports every hit in a file, not only the first" {
  fixture_repo
  fixture_script 'printf "%s" "$a" | grep -q one
printf "%s" "$b" | grep -q two
printf "%s" "$c" | grep -q three'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "check.sh:3:" <<<"$output" || return 1
  grep -qF -- "check.sh:4:" <<<"$output" || return 1
  grep -qF -- "check.sh:5:" <<<"$output"
}

@test "the report carries the remedy footer" {
  fixture_repo
  fixture_script 'printf "%s" "$a" | grep -q needle'
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "removing the pipeline rather than making the race safer" <<<"$output"
}

# --- the class does not fire -----------------------------------------------

# The load-bearing half. This gate advertises a repair, and a detector that read
# `grep -q` plus "somewhere on a line with a bar in it" would red on the very
# line it told the author to write.
@test "quiet on the here-string repair the gate advertises" {
  fixture_repo
  fixture_script 'grep -q needle <<<"$a"
grep -qvF other <<<"${b%$'"'"'\n'"'"'}"'
  run_linter
  [ "$status" -eq 0 ]
}

@test "quiet on a file that arms no pipefail" {
  fixture_repo
  fixture_script_unarmed 'printf "%s" "$a" | grep -q needle'
  run_linter
  [ "$status" -eq 0 ]
}

# `set +o pipefail` DISARMS, so it must not arm. The reverse case, a file that
# arms pipefail and then disarms it before the pipeline, still reads as armed
# and is reported; that direction costs a correct edit rather than a missed
# defect, which is the direction a guard is allowed to be wrong in.
@test "quiet on a file whose only pipefail mention disables it" {
  fixture_repo
  fixture_file check.sh '#!/usr/bin/env bash
set +o pipefail
printf "%s" "$a" | grep -q needle'
  run_linter
  [ "$status" -eq 0 ]
}

@test "quiet on a filtering grep with no quiet flag" {
  fixture_repo
  fixture_script 'printf "%s" "$a" | grep -v -e one -e two'
  run_linter
  [ "$status" -eq 0 ]
}

@test "quiet on a reader that is not downstream of anything" {
  fixture_repo
  fixture_script 'grep -q needle "$file"'
  run_linter
  [ "$status" -eq 0 ]
}

@test "quiet on a reader after a logical OR, which is not a pipe" {
  fixture_repo
  fixture_script 'some_command || grep -q needle "$file"'
  run_linter
  [ "$status" -eq 0 ]
}

@test "quiet on a full-line comment showing the shape" {
  fixture_repo
  fixture_script '# printf "%s" "$a" | grep -q needle is the shape this gate forbids
true'
  run_linter
  [ "$status" -eq 0 ]
}

# The command word decides, so a -q sitting in some other command'"'"'s argument is
# never read as a flag of a reader. Without the head test this line reports a
# hit that names a command the gate has no opinion about.
@test "quiet on a downstream command whose argument merely contains -q" {
  fixture_repo
  fixture_script 'printf "%s" "$a" | awk "/-q/ { print }"'
  run_linter
  [ "$status" -eq 0 ]
}

# --- the scan surface ------------------------------------------------------

@test "an untracked file carrying the class is not scanned" {
  fixture_repo
  printf '%s\n' '#!/usr/bin/env bash
set -o pipefail
printf "%s" "$a" | grep -q needle' > "$TMP/untracked.sh"
  run_linter
  [ "$status" -eq 0 ]
}

# bats-core enables no pipefail, so a suite is not a place the class can fire,
# and every consuming suite writes the shape deliberately as a fixture.
@test "a tracked bats suite carrying the class is not scanned" {
  fixture_repo
  fixture_file probe.bats 'set -o pipefail
printf "%s" "$a" | grep -q needle
@test "t" { true; }'
  run_linter
  [ "$status" -eq 0 ]
}

# `.husky/_/h` runs each hook as `sh -e`, which arms no pipefail either. The
# shared library owns this exclusion, so the assertion is that this gate asks
# for the `shell` set alone rather than for `shell husky`.
@test "a tracked husky hook carrying the class is not scanned" {
  fixture_repo
  fixture_file .husky/pre-commit '#!/usr/bin/env bash
set -o pipefail
printf "%s" "$a" | grep -q needle'
  run_linter
  [ "$status" -eq 0 ]
}

# --- discovery is armed, not merely correct --------------------------------

@test "an empty scan set is a hard error, never a clean tree" {
  fixture_repo_bare
  run_linter
  [ "$status" -eq 1 ]
  grep -qF -- "nothing was scanned" <<<"$output" || return 1
  # Names the set this gate asked for, not the phrase every empty-surface
  # message carries, so the assertion cannot be satisfied by some other
  # discovery reporting clean over nothing.
  grep -qF -- "the scan surface (shell)" <<<"$output"
}

# The `|| exit $?` on the discovery call is the whole mechanism here. `|| exit 1`
# folds a discovery that never ran into the status this gate uses for a tree it
# read and found nothing in, and an operator handed that would go looking at the
# tree. Run outside any repository, so `git ls-files` fails rather than answering
# empty; that is the one discovery failure a fixture can produce without a stub.
@test "a discovery that never ran exits distinctly from a surface that came back empty" {
  TMP="$(mktemp -d -t sigpipe-lint-XXXXXX)"
  run bash -c "cd '$TMP' && bash '$LINTER' 2>&1"
  [ "$status" -eq 3 ]
  grep -qF -- "discovery failed" <<<"$output" || return 1
  grep -qF -- "nothing was scanned" <<<"$output"
}

# The gate resolves the shared library beside itself, so a copy standing alone
# has no discovery at all. It must say so rather than scan nothing quietly.
@test "a gate whose shared library is missing exits 2 rather than reporting clean" {
  fixture_repo
  cp "$LINTER" "$TMP/lone-gate.sh"
  run bash -c "cd '$TMP' && bash '$TMP/lone-gate.sh' 2>&1"
  [ "$status" -eq 2 ]
  grep -qF -- "guard-awk-lib.sh is missing beside this script" <<<"$output"
}

# --- the real tree ---------------------------------------------------------

@test "the real scanned tree passes the lint" {
  run bash -c "cd '$REPO_ROOT' && bash '$LINTER'"
  [ "$status" -eq 0 ]
}
