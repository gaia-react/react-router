---
type: module
path: app/middleware/
status: active
language: typescript
purpose: React Router 7 middleware
created: 2026-04-20
updated: 2026-04-20
tags: [module, middleware]
---

# Middleware

`app/middleware/` is for [React Router 7 middleware](https://reactrouter.com/how-to/middleware).

GAIA ships one out of the box:

## `i18next.ts`

Sets up the i18next instance per request and exposes:

- `i18nextMiddleware` — registered in `root.tsx` (`export const middleware = [i18nextMiddleware]`)
- `getLanguage(context)` — returns the active language for the request
- `getInstance(context)` — returns the i18next instance for server-side `t()` calls in loaders

Used by every route loader that needs to translate meta tags. See [[i18n]].

Add other middleware (auth checks, request logging, feature flags, …) as your app needs them.
