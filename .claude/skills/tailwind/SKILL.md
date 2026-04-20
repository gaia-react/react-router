---
name: tailwind
description: Patterns and conventions for all Tailwind styling. Use this skill whenever writing Tailwind class names, combining conditional classes, building component variants, or choosing between twJoin and twMerge. Also trigger when the user asks about custom values, rem vs px, responsive breakpoints, or avoiding template literal class strings.
---

# Tailwind

## units

Always use Tailwind units first. For custom values, always use `rem`, never `px`.

```jsx
// BAD - tailwind units available but custom rem used
return <div className="p-[1.0625rem]" />;

// GOOD - uses tailwind units
return <div className="p-4.25" />;
```

## tailwind-merge

Use tailwind-merge to concatenate class names in React components instead of template literals or array joins.

- **`twJoin`** — for conditional class combinations (no override needed)
- **`twMerge`** — allow class override (merges conflicting utilities; perfect for setting default and optional classes)

### Examples

```tsx
import {twMerge, twJoin} from 'tailwind-merge';

// BAD — template literals with potential conflicts
return <span className={`bg-gray-500 ${isBlue ? 'bg-blue-500' : ''}`} />;

// GOOD - twJoin for conditional classes, but no override needed
return <span className={twJoin('bg-gray-800', isBlue && 'text-blue-500')} />;

// GOOD — twMerge for override, twJoin for conditional classes
return <span className={twMerge('text-white', isBlue && 'text-blue-500')} />;
```

The key distinction: use `twMerge` when a component accepts a `className` prop that should be able to override defaults — `twJoin` would leave both conflicting classes on the element, but `twMerge` resolves the conflict:

```tsx
// twMerge enables callers to override component defaults
function Button({className}: {className?: string}) {
  return (
    <button
      className={twMerge('bg-blue-500 px-4 py-2 text-white', className)}
    />
  );
}

// bg-red-500 wins — twMerge removes the conflicting bg-blue-500
<Button className="bg-red-500" />;
```

## Custom Values

When Tailwind's built-in scale doesn't have an exact value, use an arbitrary value with `rem`, never `px`:

```tsx
// BAD — px unit
<p className="text-[9px]" />

// GOOD — rem unit
<p className="text-[0.5625rem]" />
```

Use arbitrary values sparingly. If the same custom value appears more than once, add it to the tailwind.css `@theme` instead.
