---
type: flow
status: active
created: 2026-04-20
updated: 2026-04-26
tags: [flow, theme, dark-mode]
---

# Theme Flow (Dark Mode)

Dark mode is wired through cookie + client hints. The cookie is the source of truth; SSR renders `<html class="dark">` directly, so there is no FOUC and no inline blocking script.

## Pipeline

1. **Cookie** — `app/utils/theme.server.ts` reads/writes the `__theme` cookie via the plain `cookie` package. Values: `'light'`, `'dark'`, or absent (= follow OS).
2. **Client hints** — `app/utils/client-hints.tsx` wraps `@epic-web/client-hints`. Exposes `getHints(request)` (server) and `useOptionalHints()` (client). The `ClientHintCheck` component subscribes to `prefers-color-scheme` changes and triggers `useRevalidator().revalidate()` so OS theme flips while the tab is open update `<html class>` without a manual reload.
3. **Loader** — `app/root.tsx` returns `requestInfo: {hints, origin, path, userPrefs: {theme}}`.
4. **Document** — `app/components/Document/index.tsx` calls `useOptionalTheme()` and renders `<html className={theme === 'dark' && 'dark'}>`. `<ClientHintCheck/>` lives in `<head>` so revalidation is wired before any UI mounts.
5. **Switcher** — `app/routes/resources+/theme-switch.tsx` exports the `ThemeSwitch` component, the `useOptionalTheme` / `useOptimisticThemeMode` hooks, and the action that writes the cookie.
6. **Storybook** — `@vueless/storybook-dark-mode` toggles the same `dark` class on `<html>` (Tailwind's `@custom-variant dark` matches it). No story changes required.

## Theme priority (`useOptionalTheme` resolver)

```text
optimistic in-flight submission ('light' | 'dark')
  → user cookie preference
    → OS hint from client hints
```

`useOptimisticThemeMode()` reads pending `useFetchers()` and returns the in-flight theme, so the UI updates before the cookie round-trips. `'system'` falls through to the OS hint.

## No-JS path

The `<fetcher.Form>` falls back to a normal HTML POST. The action accepts an optional `redirectTo` and replies with `redirect()` so the browser navigates and re-runs the loader, picking up the new cookie value.

See [[State]], [[Sessions]], [[Storybook Stories]], [[Styles]], [[Dark Mode Modernization]].
