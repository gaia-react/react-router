#!/usr/bin/env bash
# Shared bats primitives for building a PATH with a named tool absent.
#
# Sourced from a suite's `setup()`, in any of the three bats directories:
#   . "$REPO_ROOT/.gaia/tests/helpers/path.sh"
#
# This is a CROSS-DIRECTORY helper, alongside `files.sh` and distinct from the
# per-suite-directory `.gaia/tests/lib/helpers/` and `.gaia/tests/hooks/helpers/`,
# which hold executable fixture builders invoked as subprocesses rather than
# functions to source.
#
# API:
#   path_dir_provides DIR NAME  - true when DIR/NAME is something bash's PATH
#                                 lookup would run as a command
#   path_without NAME           - print $PATH with every directory that
#                                 provides NAME removed
#
# WHY THIS EXISTS, and why the obvious predicate is the bug it replaces.
#
# A suite that drives a "tool is not installed" arm has to guarantee the tool is
# absent, and cannot assume it: a real `uvx`, `specify` or `pnpm` may live
# anywhere further down a developer's PATH. The construct both suites reached
# for was to rebuild PATH from only the directories that do not hold the tool,
# with membership written as:
#
#   [ -x "$dir/$name" ]
#
# `-x` is true for a searchable DIRECTORY named for the tool, not only for an
# executable file. So a PATH entry that merely holds a directory called `uvx`
# was dropped, taking every real tool that entry provides with it. bash's own
# lookup accepts a regular file that is executable, which is `-f` and `-x`
# together, and that is what `path_dir_provides` tests.
#
# The direction is safe: an over-strip removes a tool the command under test
# needs and fails it, rather than greening a test that should be red. So the
# reason this is a shared primitive rather than a fix applied twice is the
# DUPLICATION. A rule with two homes gets repaired in one of them, and the copy
# nobody edited has nothing red to catch the drift, so the two disagree with no
# gate anywhere between them. Two homes for one rule is the condition; a single
# home is the repair.
#
# `.gaia/scripts/tests/bats-path-helper.bats` holds this file to the standard
# the copies could not be held to, driving the over-strip case directly with a
# control that proves the old predicate accepts it.

# path_dir_provides <dir> <name>: true when <dir>/<name> is a command bash's
# PATH lookup would accept -- a regular file with the execute bit -- and false
# for a directory of that name, a non-executable file, or nothing at all.
path_dir_provides() {
  [ -f "$1/$2" ] && [ -x "$1/$2" ]
}

# path_without <name>: print $PATH with every directory that provides <name>
# removed, order preserved and empty entries dropped. A caller assigns the
# result, either for the rest of the test (`PATH="$(path_without uvx)"`) or for
# one command (`PATH="$(path_without pnpm)" run bash "$HOOK"`).
path_without() {
  local name="$1" kept="" dir
  while IFS= read -r dir; do
    [ -n "$dir" ] || continue
    path_dir_provides "$dir" "$name" && continue
    kept="${kept:+$kept:}$dir"
  done <<<"${PATH//:/$'\n'}"
  printf '%s\n' "$kept"
}
