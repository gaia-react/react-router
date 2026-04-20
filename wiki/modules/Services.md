---
type: module
path: app/services/
status: active
language: typescript
purpose: API client (Ky wrapper) and domain-specific service layers
depends_on: [[Ky]], [[Zod]]
created: 2026-04-20
updated: 2026-04-20
tags: [module, services, api]
---

# Services

`app/services/` is where API calls and business logic live.

## `api/` — the Ky wrapper

`app/services/api/index.ts` wraps [[Ky]] with:

- A `create()` factory that returns a typed request function
- Path-param + search-param interpolation via `query-string`
- Optional snake_case ↔ camelCase conversion (`useSnakeCase: true` by default)
- `setApiAuthorization(token)` — sets Bearer header on **all** instances
- `setApiLanguage(language)` — sets `Accept-Language` on all instances

Every domain service creates its own `api` instance via `create()` — but they share auth + language hooks.

## `gaia/` — example domain service

`app/services/gaia/` is the GAIA template's example domain. Replace it with your company name or 3rd-party API name. See [[things Service]] for the canonical reference implementation (slated for removal by `/gaia-init`).

```
gaia/
├── api.ts                   # createed Ky instance for this domain
├── auth/
│   ├── parsers.ts           # Zod schemas for response validation
│   ├── requests.server.ts   # request functions (.server.ts = server-only)
│   └── types.ts             # types inferred from Zod
├── things/                  # the example resource (deleted by /gaia-init)
│   ├── parsers.ts
│   ├── requests.server.ts
│   ├── state.tsx            # client-side state if needed
│   └── types.ts
├── urls.ts                  # URL constants
└── index.server.ts          # barrel export
```

## URL constants

`app/services/gaia/urls.ts`:

```ts
export const GAIA_URLS = {
  login: 'login',
  things: 'things',
  thingsId: 'things/:id',
};
```

## Request function pattern

```ts
import {api} from '../api';
import {GAIA_URLS} from '../urls';
import {thingSchema} from './parsers';

export const getThingById = async (id: string): Promise<Thing> => {
  const result = await api(GAIA_URLS.thingsId, {pathParams: {id}});
  return thingSchema.parse(result.data);
};
```

See [[API Service Pattern]] for the full new-service checklist (mirrored by `/new-service`).

## MSW mocks

Every service has a matching mock layer in `test/mocks/{domain}/` — same folder structure, with `get.ts`, `post.ts`, `put.ts`, `delete.ts` handlers and `data.ts` seed data. See [[MSW]].
