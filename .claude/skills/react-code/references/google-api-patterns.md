# Google API Patterns

Rules for code that calls Google APIs (Places, Geocoding, Maps).

## Server-Side Caching (Required)

All Google API server functions must use `cachified` from `@epic-web/cachified`. No uncached functions.

```ts
import {cachified, lruCacheAdapter} from '@epic-web/cachified';
import {remember} from '@epic-web/remember';
import {LRUCache} from 'lru-cache';

// Single cache store, survives HMR in development
const googleMapsCache = lruCacheAdapter(
  remember('google-maps-cache', () => new LRUCache({max: 500}))
);

export const myGoogleFn = async (arg: string) =>
  cachified({
    cache: googleMapsCache,
    key: `namespace:${arg}`,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      // ... Google API call
    },
  });
```

**Recommended TTLs:**

- Search results: 5 minutes (`1000 * 60 * 5`)
- Reverse geocoding: 10 minutes (`1000 * 60 * 10`)
- Place details / geocoding: 30 minutes (`1000 * 60 * 30`)

## Client-Side Debouncing (Required)

All client components that drive server fetches based on user input must use the `useDebounce` hook — not manual `setTimeout`.

```ts
import {useDebounce} from '~/hooks/useDebounce';

const debouncedQuery = useDebounce(query, 300); // minimum 300ms
```

Minimum debounce delay: **300ms**.

## fetcherRef Pattern (Required)

Never include a `useFetcher()` result directly in a `useEffect` dependency array. Use a ref instead:

```tsx
const myFetcher = useFetcher();
const myFetcherRef = useRef(myFetcher);
myFetcherRef.current = myFetcher; // keep in sync each render

useEffect(() => {
  void myFetcherRef.current.load(url);
}, [debouncedQuery]); // fetcher not in deps
```

Use `void fetcherRef.current.load(url)` for fire-and-forget calls — no `.catch(() => {})` needed.

## Prohibited Patterns

- **No `eslint-disable react-hooks/exhaustive-deps`** to hide a missing fetcher dependency — use `fetcherRef` instead.
- **No `.catch(() => {})`** solely to satisfy a floating-promise lint rule — use `void` instead.
- **No direct Google API calls from the client** — always go through a server loader or action.
- **No `state === 'idle'` guards inside `useEffect`** — React Router fetchers cancel in-flight requests when a new one starts, so this guard causes stale reads and is unnecessary.
