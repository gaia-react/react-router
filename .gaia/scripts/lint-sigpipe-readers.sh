#!/usr/bin/env bash
# SC2016 is intentional file-wide: SCAN_AWK below is single-quoted precisely so
# every `$` and awk field reference reaches awk as literal program text rather
# than being expanded by this shell first.
# shellcheck disable=SC2016
#
# lint-sigpipe-readers.sh: flag a short-circuiting reader -- `grep` or `rg` told
# to stop early, whether by a `-q`-bearing flag cluster, `--quiet`, `--silent`,
# or a match count (`-m`, `--max-count`) -- standing downstream of a `|` in a
# tracked shell script that runs under `pipefail`. Run it directly from the repo
# root: `bash .gaia/scripts/lint-sigpipe-readers.sh`.
#
# Exit 0 when clean, and 1 either with a file:line report on any hit or on a
# scan surface that came back empty. Two statuses say the gate never ran at
# all: 2 when it could not start (guard-awk-lib.sh missing beside this script,
# or no scratch directory), and 3 when the scan-surface discovery failed.
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
# ---------------------------------------------------------------------------
# WHICH FILES RUN UNDER PIPEFAIL, which is a closure and not a per-file test
# ---------------------------------------------------------------------------
#
# `pipefail` is a shell OPTION, not a file attribute: it belongs to the process,
# and a sourced library therefore runs under whatever its caller armed. A gate
# that asked only whether the scanned file carries its own `set -o pipefail`
# would report every library clean, and `.claude/hooks/lib/` is exactly where
# three of the four historical occurrences above lived. That is an arming-stage
# hole in the sense .claude/rules/guards-must-fail.md names: correct wherever it
# runs, and never run on the surface that most needs it.
#
# So a file counts as running under pipefail when it arms pipefail itself, OR
# when it is reachable by `source` from a file that does. The seeds are the
# self-arming files; the edges are the `.`/`source` loads; the closure is
# transitive, because a library sourced by a library sourced by an armed entry
# point runs armed too.
#
# An edge resolves by BASENAME against the tracked set, because a load names its
# target through a variable far more often than not
# (`. "$lib_dir/guard-awk-lib.sh"`), and no static reader can resolve that
# variable. Two consequences, both stated rather than hidden. A basename shared
# by two tracked files draws an edge to both, so one armed caller can mark a
# same-named file it never loads: that direction costs a correct edit and never
# a missed defect, which is the direction a guard may be wrong in. And a load
# whose target is built entirely from variables, with no literal `*.sh` token on
# the line, draws no edge at all; a file reachable only that way is not covered.
#
# ---------------------------------------------------------------------------
# Scan surface
# ---------------------------------------------------------------------------
#
# Tracked `*.sh`, the `shell` set the shared library defines. Three surfaces are
# deliberately outside it:
#
#   *.bats            bats-core arms no pipefail by DEFAULT, so an ordinary
#                     suite does not run the class. A suite that arms pipefail
#                     itself does, and that is out of scope by choice rather
#                     than by impossibility: the suites doing it today arm it
#                     inside a command substitution or a `bash -c` fixture,
#                     where the shape is the fixture rather than the suite.
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

readonly PROG="lint-sigpipe-readers"

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
  printf '%s: guard-awk-lib.sh is missing beside this script\n' "$PROG" >&2
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
gaia_guard_scan_files "$PROG" shell || exit $?

# One pass per file, emitting three tab-separated record kinds rather than a
# verdict, because no file can be graded until the whole closure is known:
#
#   #armed  <file>                     the file arms pipefail itself (a seed)
#   #source <file> <basename>          the file loads that basename (an edge)
#   #hit    <file> <line> <message>    a candidate, graded later
#
# Single-quoted, so every literal single quote inside is spelled \047 and no
# comment in it may carry an apostrophe.
readonly SCAN_AWK='
# A token that turns a reader into a short-circuiting one. TWO families, and
# both belong here because the class is the short circuit rather than the flag:
#
#   the quiet family  -q and every cluster carrying it (-qF, -qxF, -qvF, -nq),
#                     plus --quiet and --silent. The cluster form is what makes
#                     a plain substring test wrong.
#   the count family  -m and --max-count. A reader told to stop after N matches
#                     closes the pipe at the Nth exactly as a quiet one closes
#                     it at the first, so the upstream takes SIGPIPE and the
#                     pipeline status inverts identically. The count rides
#                     either inside the token (-m1, -nm1) or as the next
#                     argument (-m 1), and both spellings are the same defect.
function is_qflag(t) {
  if (t == "--quiet" || t == "--silent" || t == "--max-count") return 1
  if (t ~ /^--max-count=/) return 1
  if (t ~ /^-[A-Za-z]+$/ && t ~ /q/) return 1
  if (t ~ /^-[A-Za-z]*m[0-9]*$/) return 1
  return 0
}

# Read one pipeline SEGMENT and answer with the reader heading it, or the empty
# string. The command word is the segment head, so a -q sitting in the quoted
# argument of some other command is never read as a flag of a reader.
function segment_reader(s,   toks, m, j, t, w) {
  sub(/;.*$/, "", s)
  m = split(s, toks, /[[:space:]]+/)
  j = 1
  # Everything a reader can hide behind and still be the command that runs.
  # The assignment arm is the one that matters most in this tree: a locale or
  # encoding prefix is the ordinary spelling here, and without it the command
  # word reads as LC_ALL=C and the segment is graded as some other command. The
  # brace and paren arms cover a downstream compound command, where the wrapper
  # rather than the reader occupies the head: a pipeline into a brace group or
  # a subshell carries the class exactly as the bare form does.
  while (j <= m && (toks[j] == "" || toks[j] == "!" || toks[j] == "&" ||
                    toks[j] == "{" || toks[j] == "(" ||
                    toks[j] == "command" || toks[j] == "env" ||
                    toks[j] ~ /^[A-Za-z_][A-Za-z0-9_]*=/)) j++
  if (j > m) return ""
  w = toks[j]
  # A subshell may open with no space after the paren, so the wrapper arrives
  # fused to the command word rather than as a token of its own.
  sub(/^\(+/, "", w)
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

  # The option run before the -o that carries pipefail is optional and
  # unbounded, and it admits both spellings a set line uses: a short flag
  # cluster, and a long-form -o followed by its option NAME. So set -o pipefail,
  # set -euo pipefail, set -e -o pipefail and set -o errexit -o pipefail all arm
  # it. The bare option name is admitted only directly after a flag token, never
  # on its own: set stops parsing options at its first non-option word, so
  # set a b -o pipefail arms nothing and must not read as if it did.
  if (bare ~ /(^|[^A-Za-z0-9_])set([[:space:]]+-[A-Za-z]+([[:space:]]+[A-Za-z]+)?)*[[:space:]]+-[A-Za-z]*o[[:space:]]+pipefail([[:space:]]|$)/)
    armed = 1

  # A source edge. The load token is recognized anywhere a command may start,
  # not at line start only, because the bracketed load this tree uses for an
  # errexit-armed file puts it after a semicolon and an &&.
  if (bare ~ /(^|[^A-Za-z0-9_${}\/.-])(\.|source)[[:space:]]/) {
    if (match(bare, /[A-Za-z0-9_.-]+\.sh/))
      printf "#source\t%s\t%s\n", file, substr(bare, RSTART, RLENGTH)
  }

  # A doubled bar is a logical OR, not a pipe. Masking it before the split is
  # what keeps the command after one from reading as a downstream segment.
  work = line
  gsub(/\|\|/, "\002", work)
  n = split(work, seg, "|")
  for (i = 1; i <= n; i++) {
    # Segment 1 is downstream only when the PREVIOUS line left a pipeline open.
    if (i == 1 && !prev_pipe) continue
    hit = segment_reader(seg[i])
    if (hit != "")
      printf "#hit\t%s\t%d\t`%s` short-circuits a pipeline under pipefail\n", file, FNR, hit
  }

  # Carry an open pipeline to the next line. A trailing backslash after the bar
  # is redundant in bash but legal, so it is stripped before the test.
  tail = line
  sub(/[[:space:]]+$/, "", tail)
  sub(/\\$/, "", tail)
  sub(/[[:space:]]+$/, "", tail)
  prev_pipe = (tail ~ /\|$/ && tail !~ /\|\|$/)
}

# At END, not inline: a file may arm pipefail on a line BELOW a pipeline, so
# where the set sits says nothing about whether the file runs armed.
END { if (armed) printf "#armed\t%s\n", file }
'

WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/$PROG.XXXXXX")" || {
  printf '%s: could not create a scratch directory; nothing was scanned\n' "$PROG" >&2
  exit 2
}
# Three arms, not one shared arm: bash resumes at the point of interruption once
# a trapped handler returns, so a single arm that only cleans up would leave
# Ctrl-C printing a verdict as if uninterrupted.
trap 'rm -rf "$WORK_DIR"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# The basename-to-path record is emitted here rather than by the awk pass,
# because awk is handed the file CONTENT and this is a fact about its name. It
# rides the same stream as the awk records, so the loop opens one output file
# and forks nothing per file: `${f##*/}` is what `basename` would have returned.
for f in ${GAIA_GUARD_SCAN_FILES[@]+"${GAIA_GUARD_SCAN_FILES[@]}"}; do
  [ -f "$f" ] || continue
  printf '#file\t%s\t%s\n' "${f##*/}" "$f"
  awk -v file="$f" "$SCAN_AWK" "$f"
done > "$WORK_DIR/records"

# Split the one record stream into the three inputs the closure needs. No `||`
# guard is owed on any of them: awk exits 0 over a file holding no matching
# record, so a record kind the tree never produced yields an empty file rather
# than a failure under this script's own errexit.
awk -F'\t' '$1 == "#armed"  { print $2 }' "$WORK_DIR/records" | LC_ALL=C sort -u > "$WORK_DIR/closure"
awk -F'\t' '$1 == "#source" { printf "%s\t%s\n", $2, $3 }' "$WORK_DIR/records" > "$WORK_DIR/edges"
awk -F'\t' '$1 == "#hit"    { print }' "$WORK_DIR/records" > "$WORK_DIR/hits"
awk -F'\t' '$1 == "#file"   { printf "%s\t%s\n", $2, $3 }' "$WORK_DIR/records" | LC_ALL=C sort -u > "$WORK_DIR/index"

# Transitive closure over the source edges. A fixed-point loop rather than a
# recursive walk, because bash 3.2 has no associative array to memoize with and
# the tracked set is small enough that re-resolving the whole frontier each
# round is cheaper than the bookkeeping that would avoid it.
while : ; do
  awk -F'\t' 'NR == FNR { seed[$0] = 1; next } ($1 in seed) { print $2 }' \
    "$WORK_DIR/closure" "$WORK_DIR/edges" | LC_ALL=C sort -u > "$WORK_DIR/bases"
  awk -F'\t' 'NR == FNR { want[$0] = 1; next } ($1 in want) { print $2 }' \
    "$WORK_DIR/bases" "$WORK_DIR/index" | LC_ALL=C sort -u > "$WORK_DIR/reached"
  LC_ALL=C comm -13 "$WORK_DIR/closure" "$WORK_DIR/reached" > "$WORK_DIR/added"
  [ -s "$WORK_DIR/added" ] || break
  LC_ALL=C sort -u "$WORK_DIR/closure" "$WORK_DIR/added" > "$WORK_DIR/closure.next"
  mv "$WORK_DIR/closure.next" "$WORK_DIR/closure"
done

report=""
for f in ${GAIA_GUARD_SCAN_FILES[@]+"${GAIA_GUARD_SCAN_FILES[@]}"}; do
  grep -qxF -- "$f" "$WORK_DIR/closure" || continue
  hits="$(awk -F'\t' -v f="$f" '$2 == f { printf "%s:%s: %s\n", $2, $3, $4 }' "$WORK_DIR/hits")"
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
A file with no `set -o pipefail` of its own still counts when an armed file sources it.
REMEDY
  exit 1
fi

printf '%s: clean\n' "$PROG" >&2
exit 0
