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

`languageCookie` is a simple signed cookie. The root loader reads the detected language from i18next middleware and serializes it on every response so the preference persists across navigations.

```ts
import {createCookie} from 'react-router';
import {env} from '~/env.server';

export const languageCookie = createCookie('language', {
  httpOnly: true,
  sameSite: 'lax',
  secrets: [env.SESSION_SECRET],
  secure: process.env.NODE_ENV === 'production',
});
```

## Theme cookie

`getThemeSession(request)` returns a session object with a `getTheme()` getter. The root loader uses it to pass the SSR-safe initial theme to `<ThemeProvider>`, preventing flash-of-wrong-theme on first paint.

```ts
const themeSession = await getThemeSession(request);
// returns 'light' | 'dark' | undefined
const theme = themeSession.getTheme();
```

The `actions+/set-theme.ts` route mutates the theme cookie when the user toggles.

## Adding auth sessions

`_session+/_layout.tsx` is the designated hook point for consumer auth. Add your own `createCookieSessionStorage` (or use Clerk, Supabase, Auth0 SDKs) in `app/sessions.server/` and wire a loader into that layout file. See [[Routing]] for the route group overview.

## See Also

- [[Theme Flow]] — full SSR→client theme lifecycle
- [[Language Flow]] — language detection + persistence
- [[Routing]] — `_session+/` hook point
