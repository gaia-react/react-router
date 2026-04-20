---
type: module
path: app/services/gaia/things/
status: example
language: typescript
purpose: Reference implementation of the GAIA API service pattern — slated for removal by /gaia-init
depends_on: [[Services]], [[Zod]], [[Ky]]
created: 2026-04-20
updated: 2026-04-20
tags: [module, services, example, api]
---

# things Service

> [!note] Stripped by `/gaia-init`
> This service exists to demonstrate the [[API Service Pattern]]. Running `/gaia-init` (see [[Claude Skills]]) removes the `things/` folder, its mocks, routes, and language keys. Everything documented here is the canonical starting point for the real domain services you'll add.

## Files (`app/services/gaia/things/`)

| File | Contents |
|---|---|
| `parsers.ts` | `thingSchema`, `thingsSchema` — Zod object + array |
| `types.ts` | `Thing`, `Things` — `z.infer<typeof ...>` of the schemas |
| `requests.server.ts` | Five server-only request functions |
| `state.tsx` | `ThingsProvider` + `useThings()` — read-only React Context |

## parsers.ts

```ts
export const thingSchema = z.object({
  createdAt: z.iso.datetime(),
  description: z.string(),
  id: z.string(),
  name: z.string(),
  updatedAt: z.iso.datetime().nullish(),
});

export const thingsSchema = z.array(thingSchema);
```

- ISO datetime validation via Zod v4's `z.iso.datetime()` — no deprecated `z.string().datetime()`
- `updatedAt.nullish()` accepts both `null` and `undefined`
- Response validation is **always** `schema.parse(result.data)`, never `.safeParse` — failures should surface as errors in the service layer

## types.ts

```ts
export type Thing = z.infer<typeof thingSchema>;
export type Things = z.infer<typeof thingsSchema>;
```

Never hand-maintain types alongside schemas. Derive from Zod.

## requests.server.ts

Five CRUD functions, each using the `api()` Ky wrapper from `../api`:

```ts
export const getAllThings = async (): Promise<Things> => {
  const result = await api(GAIA_URLS.things);
  return thingsSchema.parse(result.data);
};

export const getThingById = async (id: string): Promise<Thing> => {
  const result = await api(GAIA_URLS.thingsId, {pathParams: {id}});
  return thingSchema.parse(result.data);
};

export const createThing = async (body: FormData): Promise<Thing> => {
  const result = await api(GAIA_URLS.things, {body, method: 'POST'});
  return thingSchema.parse(result.data);
};

export const updateThing = async (body: FormData): Promise<Thing> => {
  const result = await api(GAIA_URLS.thingsId, {
    body,
    method: 'PUT',
    pathParams: {id: body.get('id')},
  });
  return thingSchema.parse(result.data);
};

export const deleteThing = async (id: string): ReturnType<typeof api> =>
  api(GAIA_URLS.thingsId, {method: 'DELETE', pathParams: {id}});
```

Patterns to copy:

- `.server.ts` suffix — build will error if a client module imports this
- `body: FormData` for create/update — actions pass `await request.formData()` directly; the api wrapper handles encoding
- `updateThing` pulls `id` from the FormData so callers don't double-pass it
- `deleteThing` doesn't parse — the endpoint returns no body

## state.tsx — read-only context pattern

```tsx
const ThingsContext = createContext<ThingsContextValue>(undefined);

export const useThings = (): Things => {
  const context = useContext(ThingsContext);
  if (!context) throw new Error('useThing must be used within a ThingsProvider');
  return context;
};
```

Based on Kent C Dodds' ["How to use React Context effectively"](https://kentcdodds.com/blog/how-to-use-react-context-effectively). Read-only context is the default — a loader fetches, the provider sits in the route, children read via hook. No setters. Mutations happen through actions, and the new value comes back from the loader on the next revalidation.

`ThingsProvider.displayName = 'ThingsProvider'` — set explicitly so React DevTools doesn't show anonymous components.

## URL constants

```ts
// app/services/gaia/urls.ts
export const GAIA_URLS = {
  login: 'login',
  things: 'things',
  thingsId: 'things/:id',
};
```

Colon params are interpolated by Ky wrapper from `pathParams`.

## Barrel

```ts
// app/services/gaia/index.server.ts
import * as auth from './auth/requests.server';
import * as things from './things/requests.server';

export default {auth, things};
```

Routes import as `import gaia from '~/services/gaia/index.server'` then `gaia.things.getAllThings()`.

## MSW mock layer

`test/mocks/things/` mirrors this structure with `get.ts`, `post.ts`, `put.ts`, `delete.ts`, `data.ts`, `index.ts`. See [[MSW]].

## Related

- [[API Service Pattern]] — the checklist
- [[Services]] — module overview
- [[Ky]] — HTTP client wrapper
- [[Zod]] — validation
