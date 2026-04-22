---
type: component
path: app/components/Form/{InputText,InputEmail,InputPassword,TextArea}/
status: active
language: typescript
purpose: Text-family form inputs — text, email, password, textarea
depends_on: [[Form Components]], [[Form Field]]
created: 2026-04-20
updated: 2026-04-20
tags: [component, forms, inputs]
---

# Form Text Inputs

## Components

| Component       | Controlled by            | Key behaviours                                                                                                                                                                                                                                                                       |
| --------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `InputText`     | `value` / `defaultValue` | Canonical base — all others delegate to it. Tracks length locally only when `maxLength` set. `readOnly` → `disabled` styling + `tabIndex={-1}`. `aria-label` cascade: explicit → string `label` → `name`. `InputProps` extends `ComponentProps<'input'>` with icon/className extras. |
| `InputEmail`    | delegates to InputText   | Defaults `autoComplete='email'`, `label`/`placeholder` from `common` i18n namespace.                                                                                                                                                                                                 |
| `InputPassword` | delegates to InputText   | `type='password'` override comes after `{...props}` spread — callers cannot change it. Defaults `autoComplete='password'`, label from `common.password`.                                                                                                                             |
| `TextArea`      | `value` / `defaultValue` | `autosize` library for `resize='auto'` (default); `resize='y'` falls back to CSS `resize-y`. `useImperativeHandle` exposes textarea node to Conform.                                                                                                                                 |

## Shared conventions

- Never import from `~/components/Form/types` for component props beyond `SharedInputProps` / `InputProps`; local components extend `ComponentProps<'input'|'textarea'|'select'>` directly
- `twJoin` for conditional classes; `twMerge` where caller classes must override built-ins. See the Tailwind skill.
- Every component exports a single default `FC` — no named component exports
