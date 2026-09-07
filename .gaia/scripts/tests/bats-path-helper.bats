#!/usr/bin/env bats
# The shared PATH primitives in .gaia/tests/helpers/path.sh.
#
# Two bats suites need the same thing: a PATH with a named tool guaranteed
# absent, so a test can drive the "tool is not installed" arm on a developer
# machine where the tool really is installed. Both hand-rolled the same loop,
# and both wrote the membership test as `[ -x "$dir/$name" ]`.
#
# That predicate is wrong in one direction. `-x` is true for a searchable
# DIRECTORY named for the tool, not only for an executable file, so a PATH
# entry that merely holds such a directory was dropped along with every real
# tool it provides. bash's own PATH lookup accepts a regular file that is
# executable, which is `-f` and `-x` together.
#
# The direction is safe -- an over-strip removes a needed tool and fails the
# command under test rather than greening it -- so what makes this worth a
# primitive is the DUPLICATION rather than the defect. A rule with two homes
# gets repaired in one of them, and the copy nobody edited has nothing red to
# catch the drift. This file holds the single home to the standard the copies
# could not be held to: it drives the over-strip case directly, with a control
# proving the old predicate really does accept it.
#
# Assertion style: bash-3.2-safe per .claude/rules/bats-assertions.md.

setup() {
  THIS_DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" && pwd )"
  REPO_ROOT="$( cd "$THIS_DIR/../../.." && pwd )"
  . "$REPO_ROOT/.gaia/tests/helpers/path.sh"

  DIR="$BATS_TEST_TMPDIR/dir"
  mkdir -p "$DIR"
}

# real_tool <dir> <name>: an executable regular file, what a real install looks
# like.
real_tool() {
  printf '#!/usr/bin/env bash\nexit 0\n' > "$1/$2"
  chmod +x "$1/$2"
}

@test "path_dir_provides accepts an executable regular file" {
  real_tool "$DIR" uvx
  path_dir_provides "$DIR" uvx
}

@test "path_dir_provides rejects a searchable directory named for the tool" {
  mkdir -p "$DIR/uvx"

  # The bad case as a positive match, per the bats-assertions rule: a helper
  # that accepts this has decayed back into the `-x`-only predicate.
  path_dir_provides "$DIR" uvx && {
    echo "the helper accepts a directory named for the tool; it has decayed into the -x-only predicate" >&2
    return 1
  }

  # The control: the predicate this replaced DOES accept it, so the fixture
  # demonstrates the real defect rather than a hypothetical one.
  [ -x "$DIR/uvx" ] || {
    echo "control broken: the fixture no longer demonstrates the -x over-strip" >&2
    return 1
  }

  # And the authority both agree they are modelling: bash's own lookup.
  PATH="$DIR" command -v uvx >/dev/null 2>&1 && {
    echo "control broken: bash resolves a directory as a command" >&2
    return 1
  }
  true
}

@test "path_dir_provides rejects a regular file that is not executable" {
  : > "$DIR/uvx"
  path_dir_provides "$DIR" uvx && return 1
  true
}

@test "path_dir_provides rejects a name the directory does not hold at all" {
  path_dir_provides "$DIR" uvx && return 1
  true
}

@test "path_without drops the directory that provides the tool" {
  local holds="$BATS_TEST_TMPDIR/holds" clean="$BATS_TEST_TMPDIR/clean"
  mkdir -p "$holds" "$clean"
  real_tool "$holds" uvx

  local result
  result="$(PATH="$holds:$clean" path_without uvx)"
  [ "$result" = "$clean" ]
}

@test "path_without keeps a directory whose only match is a directory named for the tool" {
  local decoy="$BATS_TEST_TMPDIR/decoy" clean="$BATS_TEST_TMPDIR/clean"
  mkdir -p "$decoy/uvx" "$clean"

  local result
  result="$(PATH="$decoy:$clean" path_without uvx)"
  [ "$result" = "$decoy:$clean" ]
}

@test "path_without leaves a PATH on which the tool does not resolve" {
  local holds="$BATS_TEST_TMPDIR/holds" clean="$BATS_TEST_TMPDIR/clean"
  mkdir -p "$holds" "$clean"
  real_tool "$holds" uvx

  # The property both call sites actually want, asserted through bash's lookup
  # rather than through the helper's own notion of membership.
  local result
  result="$(PATH="$holds:$clean" path_without uvx)"
  PATH="$result" command -v uvx >/dev/null 2>&1 && {
    echo "the tool still resolves on the rebuilt PATH" >&2
    return 1
  }
  true
}

@test "path_without preserves the order of the directories it keeps" {
  local a="$BATS_TEST_TMPDIR/a" b="$BATS_TEST_TMPDIR/b" c="$BATS_TEST_TMPDIR/c"
  mkdir -p "$a" "$b" "$c"
  real_tool "$b" uvx

  local result
  result="$(PATH="$a:$b:$c" path_without uvx)"
  [ "$result" = "$a:$c" ]
}

@test "path_without drops empty PATH entries rather than emitting bare colons" {
  local a="$BATS_TEST_TMPDIR/a"
  mkdir -p "$a"

  local result
  result="$(PATH="$a::" path_without uvx)"
  [ "$result" = "$a" ]
}

# The shim primitive builds a directory of symlinks, so unlike the pure-builtin
# `path_without` above it needs `mkdir` and `ln` on the PATH it RUNS under. The
# fixture directory therefore leads the real PATH rather than replacing it; a
# bare fixture PATH takes the two commands the primitive itself calls away from
# it. Prepending stays hermetic for what these tests assert: a real `uvx` further
# down is mirrored out exactly like the fixture's, which is the property under
# test, and the mate names are fixture-only.
@test "path_shim_without leaves the tool unresolvable while its directory-mates still resolve" {
  local shared="$BATS_TEST_TMPDIR/shared"
  mkdir -p "$shared"
  real_tool "$shared" uvx
  real_tool "$shared" mate

  local result
  result="$(PATH="$shared:$PATH" path_shim_without uvx)"

  # The property every caller actually wants, asserted through bash's lookup
  # rather than through the helper's own notion of membership.
  PATH="$result" command -v uvx >/dev/null 2>&1 && {
    echo "the tool still resolves on the shimmed PATH" >&2
    return 1
  }
  PATH="$result" command -v mate >/dev/null 2>&1 || {
    echo "a directory-mate stopped resolving; the shim took more than the tool" >&2
    return 1
  }
  true
}

@test "path_shim_without preserves a mate that path_without would have taken" {
  # The control for this primitive's whole reason to exist. Dropping the
  # directory wholesale is the cheaper rebuild and it takes every other command
  # that directory provides, which is why a caller whose subject still needs one
  # of them mirrors instead. If this control ever passes on the dropping form,
  # the two shapes have stopped differing and one of them is redundant.
  local shared="$BATS_TEST_TMPDIR/shared"
  mkdir -p "$shared"
  real_tool "$shared" uvx
  real_tool "$shared" mate

  local dropped
  dropped="$(PATH="$shared:$PATH" path_without uvx)"
  PATH="$dropped" command -v mate >/dev/null 2>&1 && {
    echo "control broken: path_without kept a mate of the dropped tool" >&2
    return 1
  }

  local shimmed
  shimmed="$(PATH="$shared:$PATH" path_shim_without uvx)"
  PATH="$shimmed" command -v mate >/dev/null 2>&1 || return 1
  true
}

@test "path_shim_without keeps a directory that does not provide the tool, rather than mirroring it" {
  local holds="$BATS_TEST_TMPDIR/holds" clean="$BATS_TEST_TMPDIR/clean"
  mkdir -p "$holds" "$clean"
  real_tool "$holds" uvx
  real_tool "$clean" other

  local result
  result="$(PATH="$holds:$clean:$PATH" path_shim_without uvx)"
  grep -qF ":$clean" <<<"$result" || {
    echo "a directory providing nothing was not kept by its own name" >&2
    return 1
  }
  grep -qF "$holds" <<<"$result" && {
    echo "the providing directory survived on the rebuilt PATH" >&2
    return 1
  }
  true
}

@test "path_shim_without refuses rather than writing outside a bats per-test temp dir" {
  # Sourced outside a test there is nowhere sanctioned to build the shim, and
  # picking one anyway would write where no caller asked. Asserted on the
  # diagnostic rather than on the status alone: a non-zero status is also what a
  # failed mkdir at an unwritable guessed path returns, so the status cannot
  # tell the refusal apart from the accident it exists to replace.
  local out rc=0
  out="$(BATS_TEST_TMPDIR="" path_shim_without uvx 2>&1)" || rc=$?
  [ "$rc" -ne 0 ]
  grep -qF 'BATS_TEST_TMPDIR is unset' <<<"$out"
}
