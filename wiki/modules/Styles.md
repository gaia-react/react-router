---
type: module
path: app/styles/
status: active
language: css
purpose: Tailwind setup and shared utilities
depends_on: [[Tailwind]]
created: 2026-04-20
updated: 2026-04-20
tags: [module, styles, tailwind]
---

# Styles

`app/styles/tailwind.css` is the entry point for [[Tailwind]] v4 and the place to define shared `@layer` utilities/components.

## Tailwind setup

GAIA ships:

- **tailwindcss** v4 + `@tailwindcss/vite`
- `@tailwindcss/forms`, `@tailwindcss/typography`
- **Class management**: `tailwind-merge` for conditional class merging
- **Linting**: `eslint-plugin-better-tailwindcss`, `prettier-plugin-tailwindcss`, `stylelint-config-tailwindcss`

## Conventions

See the `tailwind` skill (`.claude/skills/tailwind/`) and the `tailwind` rule (`.claude/rules/tailwind.md`):

- No `px` units in Tailwind classes — use spacing scale or `rem` for custom values
- Prefer `twJoin` for static class lists, `twMerge` only when classes can conflict

## Component-scoped styles

Component-specific CSS lives in `app/components/{Name}/styles.module.css` (CSS Modules).

## Dark mode

Dark mode is wired through cookie + client hints (no React state). The pipeline:

- `app/utils/theme.server.ts` — reads/writes the `__theme` cookie.
- `app/utils/client-hints.tsx` — exposes `getHints` and `<ClientHintCheck/>`; subscribes to OS `prefers-color-scheme` changes and revalidates the loader.
- `app/routes/resources+/theme-switch.tsx` — action + `ThemeSwitch` UI + `useOptionalTheme` hook.
- Tailwind's `dark:` variant via `@custom-variant dark` in `tailwind.css`.
- Storybook's `@vueless/storybook-dark-mode` addon (unchanged).

See [[Theme Flow]].
