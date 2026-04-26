---
type: module
path: app/sessions.server/
status: active
language: typescript
purpose: Cookie session storage for language preference
created: 2026-04-20
updated: 2026-04-26
tags: [module, sessions, cookies]
---

# Sessions

`app/sessions.server/` contains cookie session-storage code that needs `SESSION_SECRET` for signing. The `.server` suffix excludes these from the client bundle.

| File          | Cookie     | Purpose                            |
| ------------- | ---------- | ---------------------------------- |
| `language.ts` | `language` | i18n preference (`languageCookie`) |

Uses React Router 7's `createCookieSessionStorage`. Secret comes from `env.SESSION_SECRET` (Zod-validated).

## Language cookie

`languageCookie` (`app/sessions.server/language.ts`) is a signed `httpOnly` / `sameSite: lax` cookie. The root loader reads the i18next-detected language and serializes it on every response so the preference persists.

## Theme cookie

The `__theme` cookie is not session-storage — it's read/written as a plain cookie via `app/utils/theme.server.ts` (using the `cookie` package directly). See [[Theme Flow]] and [[Dark Mode Modernization]] for the full pipeline.

## Adding auth sessions

`_session+/_layout.tsx` is the designated hook point for consumer auth. Add your own `createCookieSessionStorage` (or use Clerk, Supabase, Auth0 SDKs) in `app/sessions.server/` and wire a loader into that layout file. See [[Routing]] for the route group overview.

## See Also

- [[Theme Flow]] — full SSR→client theme lifecycle
- [[Language Flow]] — language detection + persistence
- [[Routing]] — `_session+/` hook point
