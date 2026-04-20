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

GAIA uses plain React Context+Provider for global state — no Redux, Zustand, etc. The barrel `app/state/index.tsx` composes all providers into a single `<State>` component consumed by `root.tsx`.

## Bundled Providers

| Provider        | Initial state from         | Purpose          |
| --------------- | -------------------------- | ---------------- |
| `ThemeProvider` | `getThemeSession(request)` | Light/dark theme |

Each provider is registered in `app/state/index.tsx` and receives its initial value as a prop from the `root.tsx` loader.

## Canonical Pattern

Every state slice in `app/state/` follows one of two variants.

### Read-only (loader / async data)

Use when the value originates on the server and components only read it:

```tsx
import type {FC, ReactNode} from 'react';
import {createContext, useContext} from 'react';
import type {Maybe} from '~/types';

type ThingsContextValue = Maybe<Things>;

const ThingsContext = createContext<ThingsContextValue>(undefined);

export const useThings = (): Things => {
  const context = useContext(ThingsContext) as Maybe<ThingsContextValue>;
  if (!context) throw new Error('useThings must be used within a ThingsProvider');
  return context;
};

// Optional variant — no throw, returns Maybe<Things>
export const useMaybeThings = (): Maybe<Things> => useContext(ThingsContext);

type ThingsProviderProps = {children: ReactNode; things?: Maybe<Things>};

export const ThingsProvider: FC<ThingsProviderProps> = ({children, things}) => (
  <ThingsContext.Provider value={things}>{children}</ThingsContext.Provider>
);
ThingsProvider.displayName = 'ThingsProvider';
```

### Editable (useState tuple)

Use when components need to update the value client-side:

```tsx
import type {Dispatch, FC, ReactNode, SetStateAction} from 'react';
import {createContext, useContext, useState} from 'react';
import type {Maybe} from '~/types';
import {noop} from '~/utils/function';

type XContextValue = [Maybe<number>, Dispatch<SetStateAction<Maybe<number>>>];

const XContext = createContext<XContextValue>([undefined, noop]);

export const useX = () => {
  const context = useContext(XContext) as Maybe<XContextValue>;
  if (!context) throw new Error('useX must be used within an XProvider');
  return context; // returns [value, setValue] tuple — same shape as useState
};

type XProviderProps = {children: ReactNode; initialState?: Maybe<number>};

export const XProvider: FC<XProviderProps> = ({children, initialState}) => {
  const value = useState(initialState);
  return <XContext.Provider value={value}>{children}</XContext.Provider>;
};
XProvider.displayName = 'XProvider';
```

## Naming Conventions

| Piece | Convention |
| --- | --- |
| Provider | `XProvider` |
| Required hook | `useX()` — throws outside Provider |
| Optional hook | `useMaybeX()` — returns `Maybe<T>`, no throw |
| Context | `XContext` — **never exported** |

## Initial State from the Loader

Providers receive SSR-safe initial state from `root.tsx` loader data, preventing hydration mismatches:

```tsx
const AppWithState = () => {
  const {theme} = useLoaderData<typeof loader>();
  return (
    <State theme={theme}>
      <App />
    </State>
  );
};
```

## Theme State

`ThemeProvider` is more complex than the standard pattern: it syncs with `localStorage`, responds to `prefers-color-scheme` media query changes, and persists the selection via a `useFetcher` POST to `actions/set-theme`. It also exports `ThemeHead` (injects a synchronous `<script>` to avoid flash-of-wrong-theme) and `getPreferredTheme()` / `isSupportedTheme()` utilities.

## When Not to Use Context

- **Component-local state** → `useState`
- **Filter / sort / pagination** → URL search params (`useSearchParams`) — bookmarkable and shareable
- **Server data without client mutation** → loader data via `useLoaderData` directly

## See Also

- [[state-pattern]] — prescriptive rule (naming, typing, colocation)
- [[Theme Flow]] — full SSR→client theme lifecycle
