---
type: component
path: app/components/Form/{Checkbox,Checkboxes,CheckboxRadioGroup,InputRadio,RadioButtons}/
status: active
language: typescript
purpose: Checkbox and radio primitives plus grouped variants
depends_on: [[Form Components]], [[Form Field]]
created: 2026-04-20
updated: 2026-04-20
tags: [component, forms, checkbox, radio]
---

# Form Choices

Checkboxes and radios share a layout primitive and a sizing table.

## Sizes — `Size` from `~/types`

`xs | sm | base | lg | xl`. Each component maps `size` to a `size-{n}` class (box) and a `text-{size}` class (label). Consistent across [[Form Choices#Checkbox|Checkbox]] and [[Form Choices#InputRadio|InputRadio]].

## Components

| Component            | Renders                                        | Disabled when                         | Notes                                                                                                                                      |
| -------------------- | ---------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `CheckboxRadioGroup` | `role="group"` flex container                  | —                                     | `isHorizontal` toggles `flex-col` vs row; used by `Checkboxes` and `BaseRadioButtons`                                                      |
| `Checkbox`           | `<input type="checkbox">` + optional `<label>` | `readOnly` implies disabled           | `required` only set once an error surfaces (prevents native browser stealing focus); wraps in `FieldStatus` when description/error present |
| `Checkboxes`         | Grouped `Checkbox` list                        | `disabled ?? options.every(disabled)` | Keyed by each option's own `name`; `isRequired` only when every option is required                                                         |
| `InputRadio`         | `<input type="radio">` + `<label>`             | per-option `disabled`                 | `id={name}-{value}` synthesized; same `required && error` gate as Checkbox                                                                 |
| `RadioButtons`       | `InputRadio` group wrapped in [[Form Field]]   | —                                     | Use this for the standard field-chrome layout                                                                                              |
| `BaseRadioButtons`   | Bare radio group, no field chrome              | —                                     | Keyed by `md5(option)` (`~/utils/object`) to handle duplicate values; use when rendering outside a Field                                   |

## Which one to reach for

| Need                                         | Use                                                            |
| -------------------------------------------- | -------------------------------------------------------------- |
| Single checkbox (e.g. "I agree to terms")    | [[Form Choices#Checkbox\|Checkbox]]                            |
| Group of independent checkboxes              | [[Form Choices#Checkboxes\|Checkboxes]]                        |
| Single radio (rare — usually inside a group) | [[Form Choices#InputRadio\|InputRadio]]                        |
| Group of mutually exclusive radios           | [[Form Choices#RadioButtons + BaseRadioButtons\|RadioButtons]] |
| Radios rendered outside any Field chrome     | `BaseRadioButtons`                                             |
