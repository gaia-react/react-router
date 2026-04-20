---
type: module
path: app/hooks/
status: active
language: typescript
purpose: Global custom React hooks
created: 2026-04-20
updated: 2026-04-20
tags: [module, hooks]
---

# Hooks

Global custom hooks live in `app/hooks/`. Component-specific hooks live in `app/components/{Name}/hooks/`.

## Bundled

| Hook               | Purpose                                |
| ------------------ | -------------------------------------- |
| `useBreakpoint`    | Returns the active Tailwind breakpoint |
| `useComponentRect` | Tracks a component's `DOMRect`         |
| `useTimeout`       | Declarative `setTimeout`               |

## Conventions

- Named export (no default)
- `use` prefix
- One hook per file, kebab-case filename inside `hooks/`
- Tests live in `app/hooks/tests/{name}.test.ts`

Use `/new-hook` to scaffold a new hook + test in this pattern.

See [[react-code]] skill for `useEffect`, `useCallback`, `useState` rules.
