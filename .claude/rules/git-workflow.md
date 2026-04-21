# Git Workflow

## Never commit directly to `main` or `master`

Always work on a feature branch. If HEAD is on `main`/`master`, create a branch first:

```bash
git switch -c <type>/<short-description>
```

Use the conventional prefixes already present in the repo: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `test/`.

## Never force-push to `main` or `master`

No `--force`, `--force-with-lease`, or `-f` to `main`/`master` — upstream history is shared. Fix conflicts with a merge or rebase on the feature branch, then open a PR.

## Enforcement

`.claude/hooks/block-main-destructive-git.sh` (PreToolUse on `Bash(git *)`) denies both:

1. `git commit` while HEAD is `main` or `master`
2. `git push --force[-with-lease]` / `git push -f` when the refspec mentions `main` or `master`

Deny is returned as a tool-level permission decision, so the hook can't be bypassed by Claude — only the user can override via explicit instruction.
