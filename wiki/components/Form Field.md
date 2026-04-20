---
type: component
path: app/components/Form/Field/
status: active
language: typescript
purpose: Label + input + status wrapper used by every GAIA Form component
depends_on: [[Form Components]]
created: 2026-04-20
updated: 2026-04-20
tags: [component, forms, wrapper]
---

# Form Field

The layout shell every other Form component wraps. Renders label, children, and a status block (description, error, max-length counter).

## Props — discriminated on `type`

| `type` | Has name | Has maxLength | Use |
|---|---|---|---|
| `input`, `password`, `textarea` | yes | yes | Text-like inputs |
| `select` | yes | no | [[Form Select\|Select]] |
| `button`, `checkbox`, `radio` | no | no | Group/action wrappers |
| `value` | no | no | Display-only fields |

Other props: `className`, `classNameDescription`, `classNameLabel`, `description`, `disabled`, `error`, `extra`, `hideMaxLength`, `id`, `label`, `length`, `required`.

## FieldLabel

`Field/FieldLabel/index.tsx` renders the top row:

- Switches between `<label htmlFor>` and `<div>` based on whether a name/id is provided
- Supports `<legend>` mode (`isLegend`) — used by [[Form YearMonthDay\|YearMonthDay]] because the control is a `<fieldset>`
- Right-aligns optional `required` marker and `extra` slot (e.g. "Forgot password?")
- Delegates `span`/`legend` rendering to `SpanOrLegend`
- Required marker goes through `FieldRequiredText`, which changes color when the form is in an error state

## FieldStatus

`Field/FieldStatus/index.tsx` renders the bottom row:

- `role="status"` live region
- Shows `FieldDescription` (and/or `FieldError`) on the left
- Shows `MaxLength` counter on the right when `maxLength` is set
- `hideMaxLength` suppresses the counter while still respecting `maxLength` on the input
- If description is absent but counter present, spacer `<span>` preserves right-alignment

## Why components reach for Field directly

Inputs accept `description`, `error`, `extra`, and `label` then forward them. Field owns the layout; inputs own the control + validation wiring. See [[Form Text Inputs]], [[Form Select]], [[Form Choices]].
