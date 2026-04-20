---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, claude, hooks]
---

# Claude Hooks

Bash scripts that run on Claude Code tool calls. Configured in `.claude/settings.json` under `hooks.PreToolUse` with matchers like `Edit|Write`.

Exit code semantics:

- `exit 0` — pass; stderr is shown to Claude as advisory
- `exit 2` — block; stderr is shown to Claude as the reason

## Bundled hooks

### Blocking

- **`block-eslint-config-edit.sh`** — refuses edits to `eslint.config.mjs`. Reason: lint errors should be fixed in source code, not silenced in config.
- **`block-vitest-globals-tsconfig.sh`** — refuses adding `vitest/globals` to `tsconfig.json`. Reason: explicit imports (`import {describe, expect, test} from 'vitest'`) are clearer and per-file.

### Advisory (non-blocking)

- **`check-i18n-strings.sh`** — on edits to `app/pages/**/*.tsx` or `app/components/**/*.tsx`, prints a reminder to use `t()` from `useTranslation()`.
- **`check-story-exists.sh`** — on edits to `app/components/{Name}/index.tsx`, checks for `tests/index.stories.tsx` and reminds to add one if missing.

## Adding hooks

Ask Claude to add a hook — Claude will drop the script into `.claude/hooks/` and register it in `.claude/settings.json` under `hooks.PreToolUse` via the `update-config` skill.
