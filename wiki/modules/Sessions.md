---
type: module
path: app/sessions.server/
status: active
language: typescript
purpose: Cookie session storage for auth, language, and theme
depends_on: [[remix-auth]]
created: 2026-04-20
updated: 2026-04-20
tags: [module, sessions, cookies, auth]
---

# Sessions

`app/sessions.server/` contains cookie management code. The `.server` suffix excludes these from the client bundle.

| File          | Cookie       | Purpose                                                 |
| ------------- | ------------ | ------------------------------------------------------- |
| `auth.ts`     | `__session`  | Auth session via [[remix-auth]] (`Authenticator<User>`) |
| `language.ts` | `language`   | i18n preference (`languageCookie`)                      |
| `theme.ts`    | theme cookie | Light/dark preference, also exposes `getThemeSession`   |

## Auth session

```ts
import {Authenticator} from 'remix-auth';
import {FormStrategy} from 'remix-auth-form';

export const authenticator = new Authenticator<User>();

authenticator.use(
  new FormStrategy(async ({form}) => {
    const password = SparkMD5.hash(form.get('password') as string);
    const user = await api.gaia.auth.login(formData);
    setApiAuthorization(user.token);
    return user;
  }),
  'form'
);
```

Session cookie:

- `httpOnly: true` — JS can't read it
- `sameSite: 'lax'` — CSRF mitigation
- `secure: env.NODE_ENV === 'production'` — HTTPS-only in prod (Safari compat)
- `maxAge: 60 * 60` — 1 hour
- Secret from `env.SESSION_SECRET` (Zod-validated)

> [!warning] Password hashing uses MD5 (SparkMD5)
> The example `FormStrategy` uses `SparkMD5.hash(password)` before sending to the API. This is presumably to match a backend that already expects MD5-hashed passwords; in any new project, **replace this with bcrypt/argon2 on the server** and remove client-side hashing.

## Route guards

`auth.ts` exports two helpers used in route loaders:

- `requireAuthenticatedUser(request)` — throws `redirect('/login')` if no user
- `requireNotAuthenticated(request)` — throws `redirect('/profile')` if a user exists

These power the `_session+` and `_auth+` route group semantics. See [[Auth Flow]].

## Theme + language cookies

`theme.ts` and `language.ts` export simple cookie helpers used by `root.tsx` and the matching `actions+/set-theme.ts` and `actions+/set-language.ts` routes.
