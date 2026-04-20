---
type: component
path: app/components/Form/{Chain,FormActions,FormError}/
status: active
language: typescript
purpose: Form composition helpers — input rows, action rows, server-error banner
depends_on: [[Form Components]]
created: 2026-04-20
updated: 2026-04-20
tags: [component, forms, layout]
---

# Form Layout

Three small helpers that sit around actual input components.

## Chain

`Chain/index.tsx`. A `role="group"` flex row that groups multiple inputs into a single "chained" field — e.g. currency selector + amount, country code + phone, unit input + unit picker.

```tsx
type ChainProps = {
  children: ReactNode;
  className?: string;
  isFullWidth?: boolean;
};
```

- `isFullWidth` applies `styles.fullWidth` so the chained row stretches to container width
- Base styling lives in `Chain/styles.module.css` — corner rounding is adjusted per child via CSS-module selectors so only the outermost corners are rounded

## FormActions

`FormActions/index.tsx`. Horizontal flex row for submit/cancel buttons.

```tsx
type FormActionsProps = {
  align?: 'left' | 'right';   // default 'right'
  children: ReactNode;
  className?: string;
};
```

- `align='right'` (default) applies `justify-end`
- `align='left'` applies `pl-0.5` — a small optical nudge to align with label text above
- Gap is `gap-4`; override via `className` if you need tighter/wider spacing

## FormError

`FormError/index.tsx`. Form-level error banner backed by React Router's `useActionData`.

```ts
type FormActionData = { error?: string };
```

- Reads `error` from `useActionData<FormActionData>()` — so any action returning `{error: 'message'}` flashes a banner automatically
- Dismissible — clicking the banner sets `dismissed = error`, hiding until a **new** error (different string) arrives
- `hide` prop forces suppression (e.g. during navigation transitions)
- Renders as `<button type="button">` so Enter key doesn't submit the form when dismissing
- `<span role="alert">` announces the error to screen readers

## How they compose

```tsx
<Form method="post">
  <FormError />
  <InputEmail name="email" />
  <Chain>
    <Select name="countryCode" options={countries} />
    <InputText name="phone" />
  </Chain>
  <FormActions>
    <Button type="button" variant="secondary">Cancel</Button>
    <Button type="submit">Save</Button>
  </FormActions>
</Form>
```
