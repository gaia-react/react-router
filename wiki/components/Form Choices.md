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

## CheckboxRadioGroup

`CheckboxRadioGroup/index.tsx` — the shared flex container:

- `role="group"`
- `isHorizontal=false` → `flex-col gap-2`
- `isHorizontal=true` → `gap-6` (or `gap-2` when `isButton`)
- Adds a `styles.group` CSS-module class for base styles

Used by [[Form Choices#Checkboxes|Checkboxes]] and `BaseRadioButtons`.

## Checkbox

`Checkbox/index.tsx`:

- Renders `<input type="checkbox">` wrapped in a `<label>` when `label` is provided, else bare input
- `required={required && !!error}` — only marks HTML-required once validation has surfaced an error (prevents native browser validation from stealing focus on the first submit)
- `readOnly` implies `disabled` for styling
- When description or error exists, wraps both in a `FieldStatus` (see [[Form Field]])
- Returns three shapes: bare input, input+label, or input+label+status div

## Checkboxes

`Checkboxes/index.tsx` — grouped Checkbox list:

- Takes `options: CheckboxOption[]` where each option has its own `name`
- `isDisabled = disabled ?? options.every(d)` — group disables when every option disables
- `isRequired = options.every(r)` — all options must be required for the group to mark required
- Each inner Checkbox shows the required-marker red only when `option.required && error && option.error` (per-option error)

## InputRadio

`InputRadio/index.tsx` — one `<input type="radio">` + `<label>`:

- Takes a single `option: RadioOption` (value + label + optional disabled/error)
- `id={name}-{value}` — synthesized to keep labels correctly associated
- Same `required && (error ?? option.error)` gate as Checkbox

## RadioButtons + BaseRadioButtons

Two-layer design:

- `RadioButtons/index.tsx` wraps with [[Form Field]] (gets label/description/error row)
- `BaseRadioButtons/index.tsx` is the bare group (no field chrome) — usable outside of a Field if a caller wants to render radios in a custom layout

`BaseRadioButtons` keys each option by `md5(option)` (from `~/utils/object`) — handles options with duplicate values or programmatically generated labels without key collisions.

## Which one to reach for

| Need                                         | Use                                                            |
| -------------------------------------------- | -------------------------------------------------------------- |
| Single checkbox (e.g. "I agree to terms")    | [[Form Choices#Checkbox\|Checkbox]]                            |
| Group of independent checkboxes              | [[Form Choices#Checkboxes\|Checkboxes]]                        |
| Single radio (rare — usually inside a group) | [[Form Choices#InputRadio\|InputRadio]]                        |
| Group of mutually exclusive radios           | [[Form Choices#RadioButtons + BaseRadioButtons\|RadioButtons]] |
| Radios rendered outside any Field chrome     | `BaseRadioButtons`                                             |
