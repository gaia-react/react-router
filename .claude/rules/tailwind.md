---
paths:
  - 'app/**/*.tsx'
  - 'app/**/*.css'
---

# Tailwind Conventions

## Canonical helpers — `tailwind-merge`

Import only from `tailwind-merge`. No `clsx`, `classnames`, or `cn` wrappers.

```ts
import {twJoin, twMerge} from 'tailwind-merge';
```

**`twJoin`** — use when no class conflict is possible (building a new class string from scratch, static variants, no external `className` prop involved).

**`twMerge`** — use when a consumer-supplied `className` prop or two class strings that target the same property must be merged without conflict.

Rule of thumb: if the component accepts a `className` prop and passes it in, the outermost merge call uses `twMerge`. Internal sub-element class construction uses `twJoin`.

## Conditional classes

Pass falsy values directly — `twJoin`/`twMerge` skips them.

```tsx
// correct
twJoin('base', isActive && 'bg-blue-500', error && 'border-red-500');

// avoid: ternaries that produce two positive values are fine, but
// don't wrap in template literals just to concatenate — pass separately
twJoin('base', condition ? 'a' : 'b'); // ok
```

Template literals inside `twJoin`/`twMerge` are acceptable **only** when interpolating a pre-built string from a lookup table (e.g., `ICON_POSITION[iconPosition]` from a `Record<string, string>`). Don't use template literals to build class lists inline.

## Variant / size lookup tables

Extract multi-class variant strings into `Record` constants at the top of the file.

```ts
const VARIANTS: Record<Variant, string> = {
  primary: 'border border-blue-400 bg-blue-500 text-white ...',
  secondary: '...',
};
```

Reference them positionally in `twJoin`/`twMerge`, not via interpolation.

## Dark mode

Dark mode uses the **class strategy** via `@custom-variant dark (&:where(.dark, .dark *))`.

Always pair light and dark in one utility call:

```tsx
'bg-white dark:bg-gray-900';
'text-gray-900 dark:text-white';
```

Prefer semantic `@utility` tokens from `tailwind.css` over raw paired classes when a token exists:

| Token              | Expands to                             |
| ------------------ | -------------------------------------- |
| `bg-body`          | `bg-white dark:bg-gray-900`            |
| `bg-secondary`     | `bg-gray-100 dark:bg-gray-800`         |
| `text-body`        | `text-gray-900 dark:text-white`        |
| `text-secondary`   | `text-gray-500 dark:text-gray-400`     |
| `text-disabled`    | `text-gray-900/15 dark:text-white/15`  |
| `text-placeholder` | `text-gray-400 dark:text-gray-600`     |
| `text-invalid`     | `text-red-600 dark:text-red-500`       |
| `border-normal`    | `border-gray-300 dark:border-gray-600` |
| `border-strong`    | `border-gray-400 dark:border-gray-500` |
| `border-medium`    | `border-gray-200 dark:border-gray-700` |
| `border-light`     | `border-gray-100 dark:border-gray-800` |
| `border-disabled`  | `border-gray-300 dark:border-gray-700` |
| `input-invalid`    | error ring + border combo              |

## Units

Use Tailwind's spacing/size scale (`px-3`, `py-2`, `gap-1.5`, `size-4.5`). No raw `px` values in Tailwind class names. Arbitrary values in `[]` are permitted only when the spacing scale has no equivalent (e.g., `pl-[2.3rem]` for icon offset, `top-[0.825rem]`).

## Responsive breakpoints

Tailwind v4 defaults. The one breakpoint used in component code is `sm:` (≥ 640 px). Order breakpoints mobile-first: base → `sm:` → `md:` → `lg:`.

## No arbitrary colors

Use palette tokens (`blue-500`, `gray-400`, `red-600`) and opacity modifiers (`bg-blue-900/15`). Don't invent hex values in arbitrary brackets.

## Tailwind v4

This project uses **Tailwind v4**. Config lives in `app/styles/tailwind.css` under `@theme` / `@layer` / `@utility` — not in `tailwind.config.*`. There is no `tailwind.config.ts` in this project.
