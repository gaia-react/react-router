---
type: module
path: app/state/
status: active
language: typescript
purpose: Global React Context+Provider state
created: 2026-04-20
updated: 2026-04-20
tags: [module, state]
---

# State

GAIA uses plain React Context+Provider for global state — no Redux, Zustand, etc. The barrel `app/state/index.tsx` composes the providers:

```tsx
<ThemeProvider initialState={theme}>
  <UserProvider initialState={user}>
    <ExampleProvider initialState={example}>{children}</ExampleProvider>
  </UserProvider>
</ThemeProvider>
```

## Bundled providers

| Provider          | Initial state from              | Purpose                                                |
| ----------------- | ------------------------------- | ------------------------------------------------------ |
| `ThemeProvider`   | `getThemeSession(request)`      | Light/dark theme                                       |
| `UserProvider`    | `getAuthenticatedUser(request)` | Authenticated user (or undefined)                      |
| `ExampleProvider` | numeric example                 | Demonstration of the pattern (deleted by `/gaia-init`) |

Each provider exports a `useX()` hook (e.g. `useTheme`, `useUser`). The `[value, setValue]` shape mirrors `useState`.

## Initial state from the loader

Providers read SSR-safe initial state from `root.tsx` loader data, then accept client-side updates. This avoids hydration mismatches.

```tsx
const AppWithState = () => {
  const {theme, user} = useLoaderData<typeof loader>();
  return (
    <State theme={theme} user={user}>
      <App />
    </State>
  );
};
```
