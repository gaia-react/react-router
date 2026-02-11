# ESLint Fix Patterns

How to resolve specific ESLint errors in this project.

## no-void

Don't use the `void` operator. Instead, make the function `async` and `await` the promise.

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
