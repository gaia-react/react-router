---
type: flow
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [flow, auth]
---

# Auth Flow

The full path of an authentication request.

## Login

1. User submits the form at `/login` (`app/routes/_auth+/login.tsx` → `app/pages/Auth/LoginPage`).
2. The route action calls `authenticator.authenticate('form', request)` from `app/sessions.server/auth.ts`.
3. The `FormStrategy` handler:
   - MD5-hashes the password with `SparkMD5` (see [[Sessions]] warning)
   - Calls `api.gaia.auth.login(formData)` → returns `User` with token
   - Calls `setApiAuthorization(user.token)` to set Bearer header on all Ky instances
   - Returns the `User` to be stored in the session cookie (`__session`)
4. On success, redirect to `/profile`.
5. On failure, return validation errors via Conform/Zod.

## Route guards

Two helpers in `app/sessions.server/auth.ts` — typically called from a route loader:

```ts
// _session+/_layout.tsx loader (or each protected route)
export const loader = async ({request}: Route.LoaderArgs) => {
  await requireAuthenticatedUser(request);
  // ... rest of loader
};
```

| Helper                              | Behavior                                            |
| ----------------------------------- | --------------------------------------------------- |
| `requireAuthenticatedUser(request)` | Throws `redirect('/login')` if no `user` in session |
| `requireNotAuthenticated(request)`  | Throws `redirect('/profile')` if a `user` exists    |

The route group folders (`_session+` vs `_auth+`) are GAIA's convention; the actual enforcement lives in the loaders that call these helpers.

## Reading the user

`root.tsx` calls `getAuthenticatedUser(request)` and passes it to `<State user={user}>`. Components read it via `useUser()`.

## Logout

`POST /logout` → `app/routes/actions+/logout.ts`:

1. Clears the session cookie
2. Redirects to `/`

## Diagram

```
   [Browser]
       │ POST /login (email, password)
       ▼
   [_auth+/login.tsx action]
       │
       ▼
   [authenticator.authenticate('form')]
       │
       ▼
   [FormStrategy handler]  ──── api.gaia.auth.login ───▶ [GAIA API]
       │                                                       │
       │                          token + user ◀───────────────┘
       ▼
   [setApiAuthorization(token)]   ──▶ all Ky instances now have Bearer
       │
       ▼
   [session.set('user', user)]    ──▶ __session cookie
       │
       ▼
   redirect('/profile')
```

See also [[Sessions]], [[Routing]].
