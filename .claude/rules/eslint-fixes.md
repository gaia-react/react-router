---
paths:
  - 'app/**/*.ts'
  - 'app/**/*.tsx'
---

# ESLint Fix Patterns

How to resolve specific ESLint errors in this project.

## no-void

Don't use the `void` operator in event listener functions. Instead, make the function `async` and `await` the promise.

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

## canonical/export-specifier-newline vs prettier conflict

Use inline `export const` declarations instead of a grouped `export { ... }` statement to avoid circular fix warnings between these two rules.

```tsx
// BAD — causes circular fix between prettier and canonical
export {DAYS, DURATIONS, FITNESS_GOALS};

// GOOD — declare with export directly
export const DAYS = ['mon', 'tue'] as const;
export const DURATIONS = [15, 30, 45] as const;
export const FITNESS_GOALS = ['weight_loss'] as const;
```

## no-shadow trailing underscores

ESLint's `no-shadow` autofixes by appending `_`. Once shadowing is resolved, remove the trailing `_`.

## sonarjs/deprecation

Never suppress with `eslint-disable`. Always fix the underlying deprecation.

Common case: Zod v4 deprecated `z.string().email()` in favor of `z.email()`.

```tsx
// BAD — suppressing the warning
// eslint-disable-next-line sonarjs/deprecation
email: z.string().email(),

// GOOD — use the non-deprecated API
email: z.email(),
```
