---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, lint]
---

# ESLint Fixes

Source: `.claude/rules/eslint-fixes.md`. Patterns for resolving specific ESLint errors. Always fix in source, never in config (a hook blocks edits to `eslint.config.mjs`).

## `no-void`

Don't use `void` in event handlers. Make the handler `async` and `await`.

```tsx
// BAD
const handleClick = () => {
  void navigate('/path');
};

// GOOD
const handleClick = async () => {
  await navigate('/path');
};
```

## `canonical/export-specifier-newline` vs Prettier conflict

Use inline `export const` instead of grouped `export {}`.

```tsx
// BAD
export {DAYS, DURATIONS};

// GOOD
export const DAYS = ['mon'] as const;
export const DURATIONS = [15, 30] as const;
```

## `no-shadow` trailing underscores

ESLint autofixes shadowing by appending `_`. Once shadowing is gone, remove the trailing `_`.

## `sonarjs/deprecation`

Never `eslint-disable`. Always fix the deprecation. Common case: `z.string().email()` → `z.email()` (Zod v4).

See [[Zod]].
