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

## InputText

`app/components/Form/InputText/index.tsx`. The canonical text input. All the email/password variants defer to it.

- Tracks value length locally (`useState(0)`) only when `maxLength` is set — populates [[Form Field]]'s `length` prop
- Icon support via FontAwesome — `icon` + `iconPosition='left'|'right'`
- Sets `classNameInput: 'input-invalid'` when `error` is truthy (global CSS class)
- `readOnly` implies `disabled` for Field's styling, and flips `tabIndex={-1}` so readonly inputs are skipped in tab order
- Derives `aria-label` cascade: explicit `aria-label` → string `label` → `name`

`InputProps` (from `types.ts`) extends `ComponentProps<'input'>` with `classNameIcon`, `classNameInput`, `icon`, `iconPosition`, and the shared label/description/error/extra props.

## InputEmail

`app/components/Form/InputEmail/index.tsx`. Thin wrapper:

- Defaults `autoComplete='email'`
- Defaults `label` and `placeholder` from the `auth` i18n namespace (`t('email')`, `t('emailPlaceholder')`)
- Delegates everything else to [[Form Text Inputs#InputText\|InputText]]

## InputPassword

`app/components/Form/InputPassword/index.tsx`:

- Defaults `autoComplete='password'`, `type='password'`, placeholder `'••••••••'`
- Default `label` from `auth.password`
- Note: the `type='password'` override comes after `{...props}` spread — callers cannot change the type via props

## TextArea

`app/components/Form/TextArea/index.tsx`:

- Uses `autosize` library for `resize='auto'` (default) — attaches on mount via `useEffect`, fires `onAutoSize` callback on `autosize:resized` event
- `useImperativeHandle` mirrors the internal ref to the forwarded `ref`, so parents get the actual `<textarea>` node (needed by Conform)
- `resize='y'` opts out of autosize and uses CSS `resize-y` instead
- Same maxLength length-tracking pattern as InputText
- Passes `type='textarea'` to [[Form Field]]

## Shared conventions

- Never import from `~/components/Form/types` for component props beyond `SharedInputProps` / `InputProps`; local components extend `ComponentProps<'input'|'textarea'|'select'>` directly
- `twJoin` for conditional classes; `twMerge` where caller classes must override built-ins. See the Tailwind skill.
- Every component exports a single default `FC` — no named component exports
