---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, services, api]
---

# API Service Pattern

Canonical reference for adding a domain service. Mirrored by the `api-service` rule (`.claude/rules/api-service.md`) and scaffolded by `/new-service`.

Related: [[Services]], [[MSW]]

## Folder structure

Each domain lives under `app/services/gaia/{domain}/`:

| File                 | Role                                                         |
| -------------------- | ------------------------------------------------------------ |
| `requests.server.ts` | API functions — `.server.ts` suffix enforces server-only     |
| `parsers.ts`         | Zod schemas for response validation                          |
| `types.ts`           | TypeScript types derived from Zod                            |
| `state.tsx`          | Read-only React Context + hook (optional, add when a route needs to pass fetched data to deeply nested components) |
| `index.ts`           | Barrel for non-server exports (parsers, types, state)        |

Register server-side exports in `app/services/gaia/index.server.ts`.

## URL constants

All endpoint paths live in `app/services/gaia/urls.ts` — never inline strings in request functions.

```ts
// app/services/gaia/urls.ts
export const GAIA_URLS = {
  resources: 'resources',
  resourcesId: 'resources/:id',
};
```

Colon-prefixed segments (`:id`) are interpolated by the Ky wrapper from `pathParams`.

## The `api` Ky instance

Each domain creates its own instance via `create()` from `app/services/api`:

```ts
// app/services/gaia/api.ts
import {create} from '../api';

type GaiaServerResponse = {
  data: unknown;
  error: Error;
};

export const api = create<GaiaServerResponse>();
```

`create()` wraps Ky with:
- Path-param + search-param interpolation
- Automatic snake_case ↔ camelCase conversion (`useSnakeCase: true` by default)
- Base URL from `process.env.API_URL`
- All instances share auth (`setApiAuthorization`) and language (`setApiLanguage`) headers set once at the app level

## `parsers.ts` — Zod schemas

```ts
import {z} from 'zod';

export const resourceSchema = z.object({
  createdAt: z.iso.datetime(),
  description: z.string(),
  id: z.string(),
  name: z.string(),
  updatedAt: z.iso.datetime().nullish(),
});

export const resourcesSchema = z.array(resourceSchema);
```

Rules:
- Use `z.iso.datetime()` — not the deprecated `z.string().datetime()`
- Use `.nullish()` for fields that may be `null` or `undefined`
- Always call `schema.parse(result.data)` — not `.safeParse` — so validation failures throw at the service boundary

## `types.ts` — inferred types

```ts
import type {z} from 'zod';
import type {resourceSchema, resourcesSchema} from './parsers';

export type Resource = z.infer<typeof resourceSchema>;
export type Resources = z.infer<typeof resourcesSchema>;
```

Never hand-maintain types alongside schemas — always derive from Zod.

## `requests.server.ts` — request functions

```ts
import {api} from '../api';
import {GAIA_URLS} from '../urls';
import {resourceSchema, resourcesSchema} from './parsers';
import type {Resource, Resources} from './types';

export const getAllResources = async (): Promise<Resources> => {
  const result = await api(GAIA_URLS.resources);
  return resourcesSchema.parse(result.data);
};

export const getResourceById = async (id: string): Promise<Resource> => {
  const result = await api(GAIA_URLS.resourcesId, {pathParams: {id}});
  return resourceSchema.parse(result.data);
};

export const createResource = async (body: FormData): Promise<Resource> => {
  const result = await api(GAIA_URLS.resources, {body, method: 'POST'});
  return resourceSchema.parse(result.data);
};

export const updateResource = async (body: FormData): Promise<Resource> => {
  const result = await api(GAIA_URLS.resourcesId, {
    body,
    method: 'PUT',
    pathParams: {id: body.get('id')},
  });
  return resourceSchema.parse(result.data);
};

export const deleteResource = async (id: string): ReturnType<typeof api> =>
  api(GAIA_URLS.resourcesId, {method: 'DELETE', pathParams: {id}});
```

Key patterns:
- `.server.ts` suffix — Vite/React Router will error if a client module imports this file
- `body: FormData` for create/update — route actions pass `await request.formData()` directly; the Ky wrapper handles encoding
- `updateResource` pulls `id` from the FormData so callers don't pass it twice
- `deleteResource` returns the raw response — the endpoint returns no body, so no Zod parse

## Error handling with `attempt`

Use `attempt` from `app/services/api/helpers.ts` in loaders/actions when you need to handle HTTP or Zod errors gracefully instead of throwing:

```ts
import {attempt} from '~/services/api/helpers';

const [error, resource] = await attempt(() => getResourceById(id));

if (error) {
  // error.status + error.statusText are always present
  throw new Response(error.statusText, {status: error.status});
}
```

`attempt` wraps any `Promise<T>` and returns a discriminated tuple `[ApiError, undefined] | [undefined, T]`. It normalises Ky `HTTPError` and Zod `ZodError` into `{status, statusText}`; other errors re-throw.

## Barrel export

Register each domain in `app/services/gaia/index.server.ts`:

```ts
import * as resources from './resources/requests.server';
import * as users from './users/requests.server';

export default {resources, users};
```

Routes import as:

```ts
import gaia from '~/services/gaia/index.server';

const data = await gaia.resources.getAllResources();
```

## `state.tsx` — read-only context (optional)

Add `state.tsx` when a route loader fetches data that deeply nested client components need. The pattern is read-only context — no setters. Mutations go through actions; the loader re-runs on revalidation.

```tsx
import type {FC, ReactNode} from 'react';
import {createContext, useContext} from 'react';
import type {Maybe} from '~/types';
import type {Resources} from './types';

type ResourcesContextValue = Maybe<Resources>;

const ResourcesContext = createContext<ResourcesContextValue>(undefined);

export const useResources = (): Resources => {
  const context = useContext(ResourcesContext) as Maybe<ResourcesContextValue>;
  if (!context) throw new Error('useResources must be used within a ResourcesProvider');
  return context;
};

type ResourcesProviderProps = {children: ReactNode; resources?: Maybe<Resources>};

export const ResourcesProvider: FC<ResourcesProviderProps> = ({children, resources}) => (
  <ResourcesContext.Provider value={resources}>{children}</ResourcesContext.Provider>
);

ResourcesProvider.displayName = 'ResourcesProvider';
```

Set `displayName` explicitly so React DevTools shows a useful name.

## Mocking with MSW

Every service has a matching mock layer in `test/mocks/{domain}/`. The folder structure mirrors the service: `get.ts`, `post.ts`, `put.ts`, `delete.ts` (one file per HTTP method), `data.ts` (seed data + `@mswjs/data` factory schema), and `index.ts` (barrel combining all handlers).

Note: MSW mock data uses snake_case field names (matching the real API wire format). The Ky wrapper converts to camelCase before the Zod schemas see it, so `data.ts` schemas should reflect the raw server shape.

Register handlers in `test/mocks/index.ts` and add the factory schema to `test/mocks/database.ts`. See [[MSW]] for full setup details.

## Checklist for a new service

1. Add URL constants to `urls.ts`
2. Create `{domain}/parsers.ts` (Zod schemas)
3. Create `{domain}/types.ts` (inferred types)
4. Create `{domain}/requests.server.ts`
5. Export from `index.server.ts`
6. Add `{domain}/state.tsx` if route needs client-side context
7. Add MSW handlers in `test/mocks/{domain}/`
8. Register handlers in `test/mocks/index.ts`
9. Add factory schema to `test/mocks/database.ts`

`/new-service` scaffolds all of the above.
