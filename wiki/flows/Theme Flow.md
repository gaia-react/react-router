---
type: flow
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [flow, theme, dark-mode]
---

# Theme Flow (Dark Mode)

Dark mode is wired through every layer so SSR, CSR, Storybook, and the cookie all stay in sync.

1. **Cookie** (`app/sessions.server/theme.ts`) — `getThemeSession(request)` reads the user's preference.
2. **Loader** — `root.tsx` puts `theme` into loader data.
3. **Provider** — `ThemeProvider` in `app/state/theme.tsx` initializes from loader data.
4. **Document** — `Document` component sets `data-theme` (or class) on `<html>`, so Tailwind's `dark:` variant applies on the SSR pass (no FOUC).
5. **Switcher** — `ThemeSwitcher` component → `POST /actions/set-theme` (`app/routes/actions+/set-theme.ts`) writes the cookie and revalidates.
6. **Storybook** — `@vueless/storybook-dark-mode` toggles the same class so stories match prod.

The `isSsrTheme` flag passed to `<Document>` distinguishes server-rendered theme from client-only flips.

See [[State]], [[Sessions]], [[Storybook]], [[Styles]].
