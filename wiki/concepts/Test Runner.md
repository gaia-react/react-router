---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-21
tags: [concept, testing]
---

# Test Runner Rule

Never run bare `npm test` or `npm run test` — it starts vitest in watch mode. Use `npm run test -- --run` for a single CI-style pass.

Machine-enforced by `.claude/hooks/block-bare-npm-test.sh` (PreToolUse `Bash` hook with `if: Bash(npm *)`), which returns `exit 2` on a bare invocation. The former `.claude/rules/test-runner.md` was removed when the hook took over enforcement.

See [[Vitest]], [[Pre-commit Hooks]], [[Claude Hooks]].
