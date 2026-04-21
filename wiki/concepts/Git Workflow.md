---
type: concept
status: active
created: 2026-04-21
updated: 2026-04-21
tags: [concept, git, workflow]
---

# Git Workflow

Authoritative rule: `.claude/rules/git-workflow.md`. Two invariants:

1. **No commits to `main`/`master`** — always branch first (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `test/`).
2. **No force-push to `main`/`master`** — no `--force`, `--force-with-lease`, or `-f` when the refspec mentions `main`/`master`.

Machine-enforced by `.claude/hooks/block-main-destructive-git.sh` (PreToolUse `Bash` hook with `if: Bash(git *)`). The hook emits `permissionDecision: "deny"` with a reason string, so Claude cannot bypass it without explicit user override.

See [[PR Merge Workflow]], [[Claude Hooks]].
