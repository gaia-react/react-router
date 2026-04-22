---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, lint]
---

# ESLint Fixes

Source: `.claude/rules/eslint-fixes.md`. Patterns for resolving specific ESLint errors. Always fix in source, never in config (a hook blocks edits to `eslint.config.mjs`).

| Rule                                 | Fix                                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| `no-void`                            | Make handler `async` and `await` the call instead of `void`                             |
| `canonical/export-specifier-newline` | Use inline `export const X = …` instead of grouped `export {X}`                         |
| `no-shadow` trailing `_`             | Remove autofix `_` suffix once shadowing is resolved                                    |
| `sonarjs/deprecation`                | Fix the deprecation — never `eslint-disable`. E.g. `z.email()` not `z.string().email()` |

See [[Zod]].
