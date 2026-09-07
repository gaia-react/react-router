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
