---
paths:
  - 'app/services/**/*'
  - 'test/mocks/**/*'
---

# API Service Pattern

For the full pattern with detailed rationale, see `wiki/concepts/API Service Pattern.md`.

## Structure

Each service domain lives under `app/services/gaia/{domain}/`:

- `requests.server.ts` — API request functions (`.server.ts` suffix = server-only)
- `parsers.ts` — Zod schemas for response validation
- `types.ts` — TypeScript types (inferred from Zod)
- `state.tsx` — Optional. Client-side Context/hook for deeply nested consumers of loader data.

## URL Constants

Define endpoints in `app/services/gaia/urls.ts`:

```ts
export const GAIA_URLS = {
  resources: 'resources',
  resourcesId: 'resources/:id',
};
```

## Request Functions

Use the `api()` wrapper with Zod parsing at the boundary:

```ts
import {api} from '../api';
import {GAIA_URLS} from '../urls';
import {resourceSchema} from './parsers';

export const getResourceById = async (id: string): Promise<Resource> => {
  const result = await api(GAIA_URLS.resourcesId, {pathParams: {id}});
  return resourceSchema.parse(result.data);
};
```

Use `schema.parse()` — never `.safeParse()`. A malformed response is a bug; let it throw.

## Barrel Export

Register in `app/services/gaia/index.server.ts`:

```ts
import * as resources from './resources/requests.server';

export default {resources};
```

## MSW Mocks

Mirror the service structure in `test/mocks/{domain}/`:

- `get.ts`, `post.ts`, `put.ts`, `delete.ts` — handlers by HTTP method
- `index.ts` — barrel combining all handlers
- `data.ts` — server-shape Zod schema, `Collection` instance, seed records, and `reset*` for that domain

Register handlers in `test/mocks/index.ts` and re-export the collection + reset from `test/mocks/database.ts`. Handler URLs **must** resolve to the same path as the service-layer request — use the shared `url()` helper so `API_URL` is applied consistently. See `wiki/modules/MSW Handlers.md` for the full contract.

### `@msw/data` — collection conventions

- **Schema**: `new Collection({schema: zodServerSchema})`. The Zod schema in `data.ts` is the Standard Schema — there is no separate mock schema.
- **Reads are sync**: `things.findFirst((q) => q.where({id: x}))`, `things.findMany(undefined)` (all), `things.findMany((q) => q.where({...}))` (filtered).
- **Mutations are async**: `await things.create({...})`, `await things.update((q) => q.where({id: x}), {data(rec) { rec.field = value; }})`, `await things.delete((q) => q.where({id: x}))`, `await things.deleteMany((q) => q)` (clear all).
- **Query syntax is predicate-builder**: `(q) => q.where({field: value})`, with optional function predicates per field (`q.where({name: (n) => n.startsWith('a')})`) or at the top level (`q.where((rec) => rec.posts.length > 0)`).
- **`resetTestData()` is async.** Inside `beforeEach`/`afterEach`, `await` it: `afterEach(async () => { await resetTestData(); });`. Returning the promise from a non-async arrow also works (`afterEach(() => resetTestData())`); naked sync calls leave a floating promise and fail `@typescript-eslint/no-floating-promises`.
- **Handlers are manual.** Write `http.get/post/put/delete` and call collection methods inside — no automatic handler generation.

Worked example handler:

```ts
import {http, HttpResponse} from 'msw';
import {GAIA_URLS} from '~/services/gaia/urls';
import {things} from './data';
import {url} from '../url';

export default [
  http.get(url(GAIA_URLS.things), () =>
    HttpResponse.json(things.findMany(undefined))
  ),
  http.get(url(GAIA_URLS.thingsId), ({params}) => {
    const record = things.findFirst((q) => q.where({id: params.id}));
    return record ?
        HttpResponse.json(record)
      : new HttpResponse(null, {status: 404});
  }),
];
```

## Checklist for New Service

1. Add URL constants to `urls.ts`
2. Create `{domain}/parsers.ts` with Zod schemas
3. Create `{domain}/types.ts`
4. Create `{domain}/requests.server.ts`
5. Export from `index.server.ts`
6. (Optional) Create `{domain}/state.tsx` for Context-based client access to loader data
7. Add MSW mock handlers in `test/mocks/{domain}/`
8. Register handlers in `test/mocks/index.ts`
9. Re-export the domain's `Collection` and reset from `test/mocks/database.ts`
