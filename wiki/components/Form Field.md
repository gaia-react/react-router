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

| `type`                          | Has name | Has maxLength | Use                     |
| ------------------------------- | -------- | ------------- | ----------------------- |
| `input`, `password`, `textarea` | yes      | yes           | Text-like inputs        |
| `select`                        | yes      | no            | [[Form Select\|Select]] |
| `button`, `checkbox`, `radio`   | no       | no            | Group/action wrappers   |
| `value`                         | no       | no            | Display-only fields     |

Other props: `className`, `classNameDescription`, `classNameLabel`, `description`, `disabled`, `error`, `extra`, `hideMaxLength`, `id`, `label`, `length`, `required`.

## Sub-components

| Sub-component | Row    | Key behaviour                                                                                                                                                                                                              |
| ------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FieldLabel`  | top    | `<label htmlFor>` or `<div>` depending on name/id; `isLegend` switches to `<legend>` (used by YearMonthDay's fieldset). Right-aligns `required` marker and `extra` slot. `FieldRequiredText` changes color on error state. |
| `FieldStatus` | bottom | `role="status"` live region. Left: description + error. Right: `MaxLength` counter (suppressed by `hideMaxLength`; spacer preserves alignment when counter present but description absent).                                |

## Why components reach for Field directly

Inputs accept `description`, `error`, `extra`, and `label` then forward them. Field owns the layout; inputs own the control + validation wiring. See [[Form Text Inputs]], [[Form Select]], [[Form Choices]].
