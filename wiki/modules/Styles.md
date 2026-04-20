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

Dark mode is wired end-to-end through:

- The `ThemeProvider` in `app/state/theme.tsx`
- The `__theme` cookie via `app/sessions.server/theme.ts`
- The `actions+/set-theme.ts` action
- Tailwind's `dark:` variant
- Storybook's `@vueless/storybook-dark-mode` addon

See [[Theme Flow]].
