---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, coding-rules]
---

# Coding Guidelines

Source: `.claude/rules/coding-guidelines.md` — automatically applied by Claude Code.

## File naming

- **Components**: PascalCase folders with `index.tsx`, tests/stories in `tests/` subfolder
- **Hooks**: camelCase, named export
- **Other files**: kebab-case

## Six core rules

1. **Think before coding.** Surface assumptions, push back when a simpler approach exists, ask when anything is unclear.
2. **Simplicity first.** Write the minimum code that solves the problem. No speculative features.
3. **Surgical changes.** Touch only what's needed. Don't refactor unrelated code. Match existing style.
4. **Goal-driven execution.** Define success criteria before starting; loop until verified.
5. **Always TDD.** Vitest for isolation, Playwright for user flows.
6. **Verify your work.** Run the [[Quality Gate]].

## Related rules

| Rule | Applies to |
|---|---|
| `coding-guidelines.md` | All code |
| `component-testing.md` | `app/**/tests/**`, `test/**` |
| `new-route.md` | `app/routes/**`, `app/pages/**` |
| `api-service.md` | `app/services/**`, `test/mocks/**` |
| `i18n.md` | `app/pages/**`, `app/components/**`, `app/languages/**` |
| `accessibility.md` | `app/components/**`, `app/pages/**` |
| `eslint-fixes.md` | ESLint-related files |
| `test-runner.md` | Test files |
| `quality-gate.md` | All code |
| `pr-merge-workflow.md` | PR merges |

See [[Claude Integration]] for how rules are applied.
