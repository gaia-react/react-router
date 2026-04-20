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

`app/services/api/index.ts` wraps [[Ky]] with a `create()` factory, path/search-param interpolation, snake_case ↔ camelCase conversion, and shared `setApiAuthorization` / `setApiLanguage` hooks. See [[Ky]] for full details.

## `gaia/` — domain service

`app/services/gaia/` is the GAIA template's domain layer. Ask Claude to rename it to your company name or 3rd-party API name — Claude will update imports, barrels, and references across the app.

```
gaia/
├── api.ts                   # created Ky instance for this domain
├── urls.ts                  # URL constants
└── index.server.ts          # barrel export
```

Ask Claude to add domain subfolders (`auth/`, `users/`, etc.) as needed — `/new-service` scaffolds the full pattern. See [[API Service Pattern]].

## URL constants & request functions

`app/services/gaia/urls.ts` holds `GAIA_URLS` constants; `/new-service` populates them alongside matching request functions. See [[API Service Pattern]] for the full pattern.

## MSW mocks

Every service has a matching mock layer in `test/mocks/{domain}/` — same folder structure, with `get.ts`, `post.ts`, `put.ts`, `delete.ts` handlers and `data.ts` seed data. See [[MSW Handlers]].
