#!/usr/bin/env bash
# SC2016 is intentional file-wide: SCAN_AWK below is single-quoted precisely so
# every `$` and awk field reference reaches awk as literal program text rather
# than being expanded by this shell first.
# shellcheck disable=SC2016
#
# lint-sigpipe-readers.sh: flag a short-circuiting reader -- `grep` or `rg`
# carrying a `-q`-bearing flag cluster, `--quiet`, or `--silent` -- standing
# downstream of a `|` in a tracked shell script that arms `pipefail`. Run it
# directly from the repo root: `bash .gaia/scripts/lint-sigpipe-readers.sh`.
#
# Exit 0 when clean, and 1 either with a file:line report on any hit or on a
# scan surface that came back empty. Two statuses say the gate never ran at
# all: 2 when guard-awk-lib.sh is missing beside this script, and 3 when the
# scan-surface discovery failed.
# gaia:maintainer-only:start
#
# Enforced by the sibling bats suite
# .gaia/scripts/tests/lint-sigpipe-readers.bats, which the `Audit CI Tests`
# scripts shard runs, and folded into .gaia/tests/shell-lint.sh, whose
# `**/*.sh` paths-filter entry arms it across the whole surface it reads. Also
# runnable directly: `bats .gaia/scripts/tests/lint-sigpipe-readers.bats`.
# gaia:maintainer-only:end
#
# Why: a short-circuiting reader INVERTS the truth value of the pipeline it
# terminates. `grep -q` exits at its first match and closes the read end of the
# pipe. When the upstream has written more than the pipe buffer (~64KB) and the
# match lands early, the upstream takes SIGPIPE and exits 141; `set -o pipefail`
# promotes that to the pipeline's status, so an `if` or an `&&` reading it takes
# the FALSE branch BECAUSE a match was found. Nothing surfaces it: the pipeline
# is well-formed, both commands did what they were asked, and the wrong branch
# looks exactly like the right one.
#
# Whether a given upstream can outrun the buffer is a data-flow property no
# static check can decide, so this gate does not try. It flags the SHAPE, with
# no discrimination, and that is affordable because the remedy is unconditional
# and free: each repair removes the pipeline outright rather than making the
# race safer, so the class cannot recur on the repaired line. A printf or echo
# feeding the reader becomes a here-string; a command feeding it is captured
# into a variable first; a filter feeding it folds into a single awk pass.
#
# That is the same trade .gaia/scripts/lint-hook-array-guard.sh already makes
# for a class it likewise cannot fully discriminate: a flagged site the author
# believes is genuinely safe takes the fix anyway, so the gate stays
# zero-exception rather than carrying an inline suppression. There is
# deliberately NO pragma.
#
# One trap in the repair itself, because `<<<` appends a newline. That is
# byte-identical to a `printf` of the same value with a trailing newline and
# harmless for an ordinary pattern, but an INVERTED reader (`grep -qv`) reads
# the extra trailing blank line as a non-matching line and then succeeds
# unconditionally. Trim the newline off the value, or fold the whole pipeline
# into one awk pass.
#
# Provenance: four known occurrences before this gate existed, three of them in
# guard machinery, where the failure mode is a guard reporting clean over a live
# defect. gaia-react/gaia#745 (`audit-success-present.sh`, fixed by
# gaia-react/gaia#748), gaia-react/gaia#757 and gaia-react/gaia#761 (two shapes
# in `audit-noop-detect.sh`), and the first draft of
# .gaia/scripts/lint-hook-advisory-classification.sh, which classified with a
# filtering grep feeding a quiet one and reported clean over the very defect it
# was written for, on its first run against the live tree. Each of the first
# three was patched in place with no gate left behind, which is why the fourth
# had nothing to catch it. gaia-react/gaia#1810 is the issue that replaced the
# patches with this tree-wide gate.
#
# Nothing else in the tree reaches the class. shellcheck at the `*.sh` severity
# floor .gaia/tests/shell-lint.sh sets returns exit 0 on a fixture carrying both
# shapes, and the `code-audit-maintainer-shell` agent has caught it once but is
# model-dispatched and advisory, so nothing enforced it.
#
# Scan surface: tracked `*.sh`, the `shell` set the shared library defines.
# Three surfaces are deliberately outside it:
#
#   *.bats            bats-core does not enable pipefail, so a suite is not a
#                     place the class can fire.
#   the husky hooks   `.husky/_/h` runs each one as `sh -e`, which arms no
#                     pipefail either.
#   workflow YAML     a `run:` body inherits pipefail from the step's RESOLVED
#                     shell, not from any text in the body, so the armed test
#                     below cannot answer for it: GitHub's default `run:` shell
#                     is `bash -e`, an explicit `shell: bash` is `bash -eo
#                     pipefail`, and `defaults.run.shell` moves both. This
#                     tree's workflows do carry the shape, though nearly always
#                     in blocks that arm no pipefail at all: their only
#                     `set -o pipefail` sits inside a command substitution,
#                     which does not reach the block around it. The armed one
#                     that remains carries its own comment arguing it
#                     unreachable on a measured size margin. Extending the gate
#                     here needs that shell oracle, which is its own change and
#                     is tracked as gaia-react/gaia#1814.
#
# What this gate does NOT try to decide: whether the pipeline's status is read
# as a truth value at all. A status nobody reads makes the shape harmless rather
# than absent, and separating the two needs the surrounding control flow. The
# remedy costs the same either way, so the shape is reported wherever it stands.
#
# Bash 3.2 compatible. Never `cd`.

set -euo pipefail

# Script-relative, never cwd-relative: every fixture test runs this guard with
# cwd inside a throwaway repo that carries no .gaia/scripts/. Bracketed with
# set +e/-e because this file arms errexit itself, the shape
# .gaia/scripts/lint-errexit-source-guard.sh demands for an unbracketed load in
# an errexit-reachable file.
_gaia_guard_lib_dir="${BASH_SOURCE[0]%/*}"
if [ "$_gaia_guard_lib_dir" = "${BASH_SOURCE[0]}" ]; then _gaia_guard_lib_dir="."; fi
# shellcheck source=.gaia/scripts/guard-awk-lib.sh
set +e; [ -f "$_gaia_guard_lib_dir/guard-awk-lib.sh" ] && . "$_gaia_guard_lib_dir/guard-awk-lib.sh" 2>/dev/null; set -e
type gaia_guard_scan_files >/dev/null 2>&1 || {
  printf 'lint-sigpipe-readers: guard-awk-lib.sh is missing beside this script\n' >&2
  exit 2
}

# The scan surface comes from the shared library rather than from a read loop
# here, so every gate consuming it discovers the same set the same way and a
# widened pathspec cannot reach one of them and miss the others. The call fills
# GAIA_GUARD_SCAN_FILES and returns non-zero on an empty surface, which is a
# hard error rather than a clean tree; the status is read directly, because a
# substitution would swallow it.
#
# The library's own status is carried out rather than flattened to 1: 1 says the
# tree was read and held nothing, 3 says it was never read at all, and an
# operator handed 1 for the second would look at the tree instead of the
# discovery.
gaia_guard_scan_files lint-sigpipe-readers shell || exit $?

# The class detector. Single-quoted, so every literal single quote inside is
# spelled \047 and no comment in it may carry an apostrophe.
#
# ONE PASS, buffered, released at END. `pipefail` can be armed on a line BELOW a
# pipeline, so a scan that decided armedness on the way past would report a file
# clean on the strength of where its `set` happens to sit. Every candidate is
# held and the whole set is released only if the file armed pipefail anywhere.
readonly SCAN_AWK='
# A token that turns a reader into a short-circuiting one. The cluster form is
# what makes a plain substring test wrong: -qF, -qxF, -qvF, -nq and --quiet all
# short-circuit, while -e, -F and -v alone do not.
function is_qflag(t) {
  if (t == "--quiet" || t == "--silent") return 1
  if (t ~ /^-[A-Za-z]+$/ && t ~ /q/) return 1
  return 0
}

# Read one pipeline SEGMENT and answer with the reader heading it, or the empty
# string. The command word is the segment head, so a -q sitting inside the
# quoted argument of some other command is never read as a flag of a reader.
function segment_reader(s,   toks, m, j, t, w) {
  sub(/;.*$/, "", s)
  m = split(s, toks, /[[:space:]]+/)
  j = 1
  # & heads the right half of a |& pipe; !, command and env are modifiers that
  # leave the reader as the effective command word.
  while (j <= m && (toks[j] == "" || toks[j] == "!" || toks[j] == "&" ||
                    toks[j] == "command" || toks[j] == "env")) j++
  if (j > m) return ""
  w = toks[j]
  sub(/^.*\//, "", w)
  if (w != "grep" && w != "rg") return ""
  for (t = j + 1; t <= m; t++)
    if (is_qflag(toks[t])) return w " " toks[t]
  return ""
}

{
  line = $0
  bare = line
  sub(/^[[:space:]]+/, "", bare)

  # A full-line comment neither arms pipefail nor carries an executed reader,
  # and it does NOT close an open pipeline: bash accepts a comment line between
  # a trailing pipe and the command that follows it, so the carry is left alone.
  if (bare ~ /^#/) next

  if (bare ~ /(^|[^A-Za-z0-9_])set[[:space:]]+-[A-Za-z]*o[[:space:]]+pipefail([[:space:]]|$)/)
    armed = 1

  # A doubled bar is a logical OR, not a pipe. Masking it before the split is
  # what keeps the command after one from reading as a downstream segment.
  work = line
  gsub(/\|\|/, "\002", work)
  n = split(work, seg, "|")
  for (i = 1; i <= n; i++) {
    # Segment 1 is downstream only when the PREVIOUS line left a pipeline open.
    if (i == 1 && !prev_pipe) continue
    hit = segment_reader(seg[i])
    if (hit != "") {
      count++
      pending[count] = sprintf("%s:%d: `%s` short-circuits a pipeline under pipefail", file, FNR, hit)
    }
  }

  # Carry an open pipeline to the next line. A trailing backslash after the bar
  # is redundant in bash but legal, so it is stripped before the test.
  tail = line
  sub(/[[:space:]]+$/, "", tail)
  sub(/\\$/, "", tail)
  sub(/[[:space:]]+$/, "", tail)
  prev_pipe = (tail ~ /\|$/ && tail !~ /\|\|$/)
}

END {
  if (!armed) exit 0
  for (i = 1; i <= count; i++) print pending[i]
}
'

report=""
for f in ${GAIA_GUARD_SCAN_FILES[@]+"${GAIA_GUARD_SCAN_FILES[@]}"}; do
  [ -f "$f" ] || continue
  hits="$(awk -v file="$f" "$SCAN_AWK" "$f")"
  [ -z "$hits" ] || report+="$hits"$'\n'
done

if [ -n "$report" ]; then
  printf '%s' "$report"
  # The remedy is written as prose rather than as sample pipelines, so the
  # footer this gate prints cannot read as an instance of the class it reports.
  cat >&2 <<'REMEDY'
Fix each by removing the pipeline rather than making the race safer:
    a printf or echo feeding the reader  ->  grep -q RE <<<"$var"
    a command feeding the reader         ->  out="$(some_command)"
                                             grep -q RE <<<"$out"
    a filter feeding the reader          ->  one awk pass over <<<"$var"
An inverted reader (grep -qv, grep -qvF) additionally needs the newline <<< appends
trimmed off the value, or it succeeds on the trailing blank line unconditionally.
REMEDY
  exit 1
fi

echo "lint-sigpipe-readers: clean" >&2
exit 0
