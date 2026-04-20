---
type: module
path: app/sessions.server/
status: active
language: typescript
purpose: Cookie session storage for theme and language preferences
created: 2026-04-20
updated: 2026-04-20
tags: [module, sessions, cookies]
---

# Sessions

`app/sessions.server/` contains cookie management code. The `.server` suffix excludes these from the client bundle.

| File          | Cookie     | Purpose                                                    |
| ------------- | ---------- | ---------------------------------------------------------- |
| `language.ts` | `language` | i18n preference (`languageCookie`)                         |
| `theme.ts`    | theme      | Light/dark preference; also exposes `getThemeSession`      |

Both use React Router 7's `createCookieSessionStorage`. Secrets come from `env.SESSION_SECRET` (Zod-validated).

## Language cookie

`languageCookie` (`app/sessions.server/language.ts`) is a signed `httpOnly` / `sameSite: lax` cookie. The root loader reads the i18next-detected language and serializes it on every response so the preference persists.

## Theme cookie

`app/sessions.server/theme.ts` exposes `getThemeSession(request)` which returns a session with a `getTheme()` getter (`'light' | 'dark' | undefined`). The root loader passes this to `<ThemeProvider>` for SSR-safe hydration. The `actions+/set-theme.ts` route mutates it on toggle.

## Adding auth sessions

`_session+/_layout.tsx` is the designated hook point for consumer auth. Add your own `createCookieSessionStorage` (or use Clerk, Supabase, Auth0 SDKs) in `app/sessions.server/` and wire a loader into that layout file. See [[Routing]] for the route group overview.

## See Also

- [[Theme Flow]] — full SSR→client theme lifecycle
- [[Language Flow]] — language detection + persistence
- [[Routing]] — `_session+/` hook point
