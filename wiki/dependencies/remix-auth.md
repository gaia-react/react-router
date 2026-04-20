---
type: dependency
status: active
package: "remix-auth, remix-auth-form"
version: "4.2.0, 3.0.0"
role: auth
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, auth]
---

# remix-auth

Pluggable authentication for Remix / React Router 7. GAIA uses it with `FormStrategy` (email + password).

- `Authenticator<User>` instance lives in `app/sessions.server/auth.ts`
- Session storage via `createCookieSessionStorage` from React Router

See [[Auth Flow]] for the full path.
