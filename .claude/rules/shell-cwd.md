# Shell CWD

Do not `cd` in Bash tool calls. Use absolute paths for every command.

## Why

The directive is about the guard layer, and a `cd` takes it down without announcing itself.

**Into another checkout, the registrations re-root.** `.claude/settings.json` roots every hook command at `$(git rev-parse --show-toplevel …)`, derived per invocation rather than pinned, so the working directory picks the checkout. A sibling clone has no hook scripts, so `/bin/sh` exits 127, and because 127 neither blocks nor is reported the whole `PreToolUse` layer fails open silently; one of this repository's own linked worktrees under `.claude/worktrees/` is a different checkout at a path *inside* this one, and runs that branch's guards rather than the ones under review. `.gaia/scripts/check-hook-command-rooting.sh` holds the registration form, not the runtime cwd, so nothing at the registration site can close either case.

One neighbouring mechanism is closed rather than live, and it is worth knowing which: the hooks locate the framework code they load and run from their own on-disk location, so a `cd` does not reach that path. A `cd` reaches the re-rooting above unchanged, which is enough on its own, because that one fails open across every `PreToolUse` guard at once rather than one gate at a time.

<!-- gaia:maintainer-only:start -->
GAIA maintainers: what holds that rooting down is `.gaia/scripts/lint-hook-cwd-relative-loads.sh`, which reds when a hook reintroduces the class. What it reads is a literal repo-relative path standing in one of the positions its own header enumerates; a path reached through a computed variable is a blind spot that header names, so the hook suites driving each blocking gate from a subdirectory are what cover that half. Both the gate and those suites are release-excluded, which is why this paragraph is wrapped: on an adopter clone neither exists, and a rule crediting them with it would be false where it matters most.
<!-- gaia:maintainer-only:end -->

That compounds with the ordinary cost of a `cd`: the working directory it sets persists for the rest of the session, so every later relative path resolves against it.

## How to apply

- `rm /abs/path/file`, not `cd /abs/path && rm file`
- `git -C /abs/path status`, not `cd /abs/path && git status`
- `ls /abs/path`, not `cd /abs/path && ls`

If the user explicitly asks for `cd`, follow with an absolute `cd` back to the repo root in the same call.
