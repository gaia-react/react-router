# Shell CWD

Do not `cd` in Bash tool calls. Use absolute paths for every command.

## Why

The directive is about the guard layer, and a `cd` takes it down two different ways. Neither announces itself.

**Off the repo root, the hook libraries stop loading.** Hooks across the layer source their shared libraries through a bare cwd-relative test (`[ -f .claude/hooks/lib/red-ledger.sh ]`), which is false from any subdirectory. Each then `exit 0`s on the missing library, a fail-open written for a *broken* library rather than for a moved working directory. From `app/`, `red-verify-commit-check.sh` stops gating RED-before-GREEN commits and `worthiness-presence-check.sh` stops gating the merge, with no diagnostic from either.

**Into another checkout, the registrations re-root.** `.claude/settings.json` roots every hook command at `$(git rev-parse --show-toplevel …)`, derived per invocation rather than pinned, so the working directory picks the checkout. A sibling clone has no hook scripts, so `/bin/sh` exits 127, and because 127 neither blocks nor is reported the whole `PreToolUse` layer fails open silently; one of this repository's own linked worktrees under `.claude/worktrees/` is a different checkout at a path *inside* this one, and runs that branch's guards rather than the ones under review. `.gaia/scripts/check-hook-command-rooting.sh` holds the registration form, not the runtime cwd, so nothing at the registration site can close either case.

Both compound with the ordinary cost of a `cd`: the working directory it sets persists for the rest of the session, so every later relative path resolves against it.

## How to apply

- `rm /abs/path/file`, not `cd /abs/path && rm file`
- `git -C /abs/path status`, not `cd /abs/path && git status`
- `ls /abs/path`, not `cd /abs/path && ls`

If the user explicitly asks for `cd`, follow with an absolute `cd` back to the repo root in the same call.
