---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, services, api]
---

# API Service Pattern

Source: `.claude/rules/api-service.md` (mirrored by `/new-service`).

## Structure per domain

`app/services/gaia/{domain}/`:

| File | Role |
|---|---|
| `requests.server.ts` | API functions (`.server.ts` = server-only) |
| `parsers.ts` | Zod schemas for response validation |
| `types.ts` | TypeScript types (inferred from Zod) |
| `state.tsx` | Client-side state if needed |

## URL constants

`app/services/gaia/urls.ts`:

```ts
export const GAIA_URLS = {
  things: 'things',
  thingsId: 'things/:id',
};
```

## Request function

```ts
export const getThingById = async (id: string): Promise<Thing> => {
  const result = await api(GAIA_URLS.thingsId, {pathParams: {id}});
  return thingSchema.parse(result.data);
};
```

## Barrel export

Register in `app/services/gaia/index.server.ts`.

## MSW mocks

Mirror the structure in `test/mocks/{domain}/`:

- `get.ts`, `post.ts`, `put.ts`, `delete.ts`
- `data.ts` (seed data + @mswjs/data schema)
- `index.ts` (barrel)

Register in `test/mocks/index.ts` and add factory schema to `test/mocks/database.ts`.

## Checklist for a new service

1. Add URL constants to `urls.ts`
2. Create `parsers.ts` (Zod schemas)
3. Create `types.ts`
4. Create `requests.server.ts`
5. Export from `index.server.ts`
6. Add MSW handlers in `test/mocks/{domain}/`
7. Register handlers in `test/mocks/index.ts`
8. Add factory schema to `test/mocks/database.ts`

`/new-service` does all of the above.

See [[things Service]] for the canonical worked example, [[Services]], [[MSW]].
