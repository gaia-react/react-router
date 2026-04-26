---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-21
tags: [concept, claude, hooks]
---

# Claude Hooks

Bash scripts that run on Claude Code tool calls. Configured in `.claude/settings.json` under `hooks.PreToolUse` (and other event types). The `Bash` matcher supports per-hook `if:` patterns so a single matcher block can fan out to command-specific hooks.

Exit code semantics:

- `exit 0` — pass; stderr is shown to Claude as advisory
- `exit 2` — block; stderr is shown to Claude as the reason
- JSON `permissionDecision: "deny"` on stdout — block via the structured API; the reason string is surfaced to Claude

## Bundled hooks

### Blocking (Edit|Write|MultiEdit)

- **`block-eslint-config-edit.sh`** — refuses edits to `eslint.config.mjs`. Reason: lint errors should be fixed in source code, not silenced in config.
- **`block-vitest-globals-tsconfig.sh`** — refuses adding `vitest/globals` to `tsconfig.json`. Reason: explicit imports (`import {describe, expect, test} from 'vitest'`) are clearer and per-file.

### Advisory (Edit|Write|MultiEdit)

- **`check-i18n-strings.sh`** — on edits to `app/pages/**/*.tsx` or `app/components/**/*.tsx`, prints a reminder to use `t()` from `useTranslation()`.
- **`check-story-exists.sh`** — on edits to `app/components/{Name}/index.tsx`, checks for `tests/index.stories.tsx` and reminds to add one if missing.

### Blocking (Bash)

- **`block-bare-test.sh`** (`if: Bash(pnpm *)` and `if: Bash(npm *)`) — denies bare `pnpm test` / `npm test` (and `run test` variants); they start vitest watch mode. Requires `--run` for a one-shot pass. Replaces the former `.claude/rules/test-runner.md`.
- **`block-main-destructive-git.sh`** (`if: Bash(git *)`) — denies `git commit` while HEAD is `main`/`master`, and denies force-push to `main`/`master`. Authoritative rule: [[Git Workflow]].

### Advisory (Bash)

- **`pr-merge-audit-check.sh`** (`if: Bash(gh pr merge:*)`) — reminds to spawn `code-review-audit`, fix issues, and push fixes before merging. See [[PR Merge Workflow]].
- **`wiki-maintenance-check.sh`** (`if: Bash(git commit:*)`) — emits the wiki-update checklist on every `git commit`. Replaces the former `.claude/rules/wiki-maintenance.md` — the checklist now lives in the hook's heredoc.

### Other events

- **`intercept-init.sh`** (UserPromptSubmit) — blocks the built-in `/init` and auto-invokes `/gaia-init`.
- **`wiki-session-start.sh`** (SessionStart) / **`wiki-session-stop.sh`** (Stop) / **`wiki-squash-autocommits.sh`** (Stop) — wiki coherence and `hot.md` refresh. See [[Claude Integration]] for the full pair.

## Adding hooks

Ask Claude to add a hook — Claude will drop the script into `.claude/hooks/` and register it in `.claude/settings.json` under `hooks.PreToolUse` via the `update-config` skill.
