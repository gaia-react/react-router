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

## `gaia/` — domain service

`app/services/gaia/` is the GAIA template's domain layer. Ask Claude to rename it to your company name or 3rd-party API name — Claude will update imports, barrels, and references across the app.

```
gaia/
├── api.ts                   # created Ky instance for this domain
├── urls.ts                  # URL constants
└── index.server.ts          # barrel export
```

Ask Claude to add domain subfolders (`auth/`, `users/`, etc.) as needed — `/new-service` scaffolds the full pattern. See [[API Service Pattern]].

## URL constants

`app/services/gaia/urls.ts`:

```ts
export const GAIA_URLS = {};
```

Add your endpoint keys here as you build out services.

## Request function pattern

```ts
import {api} from '../api';
import {GAIA_URLS} from '../urls';
import {resourceSchema} from './parsers';

export const getResourceById = async (id: string): Promise<Resource> => {
  const result = await api(GAIA_URLS.resourcesId, {pathParams: {id}});
  return resourceSchema.parse(result.data);
};
```

See [[API Service Pattern]] for the full new-service checklist (mirrored by `/new-service`).

## MSW mocks

Every service has a matching mock layer in `test/mocks/{domain}/` — same folder structure, with `get.ts`, `post.ts`, `put.ts`, `delete.ts` handlers and `data.ts` seed data. See [[MSW]].
