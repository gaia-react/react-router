# Shell CWD

Do not `cd` in Bash tool calls. Use absolute paths for every command.

## Why

The directive is about the guard layer, and a `cd` takes it down two different ways. Neither announces itself.

**Off the repo root, the RED-ledger hooks stop loading their library.** `red-verify-commit-check.sh`, `worthiness-presence-check.sh`, and `capture-red-observations.sh` each source the RED ledger through a bare cwd-relative test (`[ -f .claude/hooks/lib/red-ledger.sh ]`), false from a sibling directory such as `app/`, and each `exit 0`s when it fails: a fail-open written for a *broken* library rather than for a moved working directory. Run from there, the first stops gating RED-before-GREEN commits and the second stops gating the merge, neither with a diagnostic. Other hooks load a library the same way and keep enforcing without it, so the disarm is not the whole family; gaia-react/gaia#1854 tracks the shape.

**Into another checkout, the registrations re-root.** `.claude/settings.json` roots every hook command at `$(git rev-parse --show-toplevel …)`, derived per invocation rather than pinned, so the working directory picks the checkout. A sibling clone has no hook scripts, so `/bin/sh` exits 127, and because 127 neither blocks nor is reported the whole `PreToolUse` layer fails open silently; one of this repository's own linked worktrees under `.claude/worktrees/` is a different checkout at a path *inside* this one, and runs that branch's guards rather than the ones under review. `.gaia/scripts/check-hook-command-rooting.sh` holds the registration form, not the runtime cwd, so nothing at the registration site can close either case.

Both compound with the ordinary cost of a `cd`: the working directory it sets persists for the rest of the session, so every later relative path resolves against it.

## How to apply

- `rm /abs/path/file`, not `cd /abs/path && rm file`
- `git -C /abs/path status`, not `cd /abs/path && git status`
- `ls /abs/path`, not `cd /abs/path && ls`

If the user explicitly asks for `cd`, follow with an absolute `cd` back to the repo root in the same call.
