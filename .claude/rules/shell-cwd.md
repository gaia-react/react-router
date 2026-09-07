# Shell CWD

Prefer an absolute path in a Bash tool call over a `cd`. A `cd` is not scoped to the call that ran it: the working directory it sets persists for the rest of the session, so every later command written against the repo root resolves somewhere else. That is the whole of the general case, and it is a preference, not a guard.

## The one hard line

**Never `cd` somewhere that changes what `git rev-parse --show-toplevel` resolves to.** `.claude/settings.json` roots every hook registration at that value, derived per invocation rather than pinned, so the working directory decides which checkout the guard layer is loaded from. Moving around inside one checkout resolves the same root every time, which is why the general case above is only a preference. Landing in a different checkout does not, and two shapes reach one: a sibling clone, where the hook scripts are absent, `/bin/sh` exits 127, and because 127 neither blocks nor is reported the whole `PreToolUse` layer fails open silently; and one of this repository's own linked worktrees under `.claude/worktrees/`, which is a different checkout at a path *inside* this one, so the guards that run are that branch's copies rather than the ones under review. The criterion is the resolved toplevel rather than the path's depth, because that second shape satisfies "inside this repository" and is a different checkout anyway. Nothing at the registration site can close either (`.gaia/scripts/check-hook-command-rooting.sh` holds the rooting form, not the runtime cwd), so this is stated as a line rather than a preference.

## How to apply

- `rm /abs/path/file`, not `cd /abs/path && rm file`
- `git -C /abs/path status`, not `cd /abs/path && git status`
- `ls /abs/path`, not `cd /abs/path && ls`

If the user explicitly asks for `cd`, follow with an absolute `cd` back to the repo root in the same call.
