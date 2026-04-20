---
type: component
path: app/components/Form/Select/
status: active
language: typescript
purpose: Native select dropdown with icon, optgroup, and placeholder support
depends_on: [[Form Components]], [[Form Field]]
created: 2026-04-20
updated: 2026-04-20
tags: [component, forms, select]
---

# Form Select

Native `<select>` wrapped by [[Form Field]]. No custom dropdown UI — deliberate. Keeps it accessible and mobile-friendly for free.

## Options — `SelectOption`

Defined in `Select/types.ts`:

```ts
type SelectOption = (
  { options: Option[]; value?: never } |
  { options?: never; value: string }
) & { disabled?: boolean; label: string };
```

A single option gives `{value, label}`. A group gives `{label, options: Option[]}` and renders as `<optgroup>`. No nested groups.

## Props

`ComponentProps<'select'>` plus `options`, `unselected`, `unselectedIcon`, `icon`, `iconPosition`, `error`, `description`, `extra`, `label`, `classNameIcon|Label|Select`. `name` is required.

## Placeholder behavior — `unselected`

When `unselected` is passed, renders a disabled (when `required`) `<option value="">` at the top. Text color switches to `text-placeholder` while `currentValue` is empty, then to `text-body` once a real option is picked.

## Controlled/uncontrolled duality

```tsx
const [currentValue, setCurrentValue] = useState(() => value ?? defaultValue ?? '');
```

Tracks `currentValue` locally only to drive placeholder coloring. The actual value is whatever React gives the `<select>` — Select stays controllable via `value` **or** `defaultValue`. Consumer `onChange` still fires.

> [!warning] Don't use raw Select inside custom stateful components without Conform
> If you bundle Select into a parent that manages state (like [[Form YearMonthDay\|YearMonthDay]]) and submit via Conform, you need `useInputControl`. The local state here is cosmetic; it is not the submission source of truth.

## Icon positioning

- Left icon absorbs `pl-[2.3rem]` on the `<select>`; right icon uses `pr-[2.3rem]`
- Icon color follows disabled/placeholder state
- `classNameIcon` can override `top-*` for custom vertical centering (e.g. larger option text)

See [[Form YearMonthDay]] for the three-Select composite.
