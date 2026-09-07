# Shell CWD

Prefer an absolute path in a Bash tool call over a `cd`. A `cd` is not scoped to the call that ran it: the working directory it sets persists for the rest of the session, so every later command written against the repo root resolves somewhere else. That is the whole of the general case, and it is a preference, not a guard.

## The one hard line

**Never `cd` into a different git checkout.** `.claude/settings.json` roots every hook registration at `$(git rev-parse --show-toplevel …)`, derived per invocation rather than pinned, so the working directory decides which tree the guard layer loads from. At any depth *inside this repository* that still resolves here, which is why the general case above is only a preference. In a sibling checkout it resolves there instead: the hook scripts are absent, `/bin/sh` exits 127, and because 127 neither blocks nor is reported, the whole `PreToolUse` layer fails open silently. Nothing at the registration site can close that (`.gaia/scripts/check-hook-command-rooting.sh` holds the rooting form, not the runtime cwd), so this one is stated as a line rather than a preference.

## How to apply

- `rm /abs/path/file`, not `cd /abs/path && rm file`
- `git -C /abs/path status`, not `cd /abs/path && git status`
- `ls /abs/path`, not `cd /abs/path && ls`

If the user explicitly asks for `cd`, follow with an absolute `cd` back to the repo root in the same call.
