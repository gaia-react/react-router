---
paths:
  - 'app/services/**/*'
  - 'test/mocks/**/*'
---

# API Service Pattern

## Structure

Each service domain lives under `app/services/gaia/{domain}/`:

- `requests.server.ts` — API functions (`.server.ts` suffix = server-only)
- `parsers.ts` — Zod schemas for response validation
- `types.ts` — TypeScript types (inferred from Zod or manual)
- `state.tsx` — Client-side state if needed

## URL Constants

Define endpoints in `app/services/gaia/urls.ts`:

```ts
export const GAIA_URLS = {
  things: 'things',
  thingsId: 'things/:id',
};
```

## Request Functions

Use the `api()` wrapper with Zod parsing:

```ts
import {api} from '../api';
import {GAIA_URLS} from '../urls';
import {thingSchema} from './parsers';

export const getThingById = async (id: string): Promise<Thing> => {
  const result = await api(GAIA_URLS.thingsId, {pathParams: {id}});
  return thingSchema.parse(result.data);
};
```

## Barrel Export

Register in `app/services/gaia/index.server.ts`:

```ts
import * as things from './things/requests.server';
export default {auth, things};
```

## MSW Mocks

Mirror the service structure in `test/mocks/{domain}/`:

- `get.ts`, `post.ts`, `put.ts`, `delete.ts` — handler files by method
- `index.ts` — barrel combining all handlers
- `data.ts` — seed data for `@mswjs/data` factory

Register in `test/mocks/index.ts` and add factory schema to `test/mocks/database.ts`.

## Checklist for New Service

1. Add URL constants to `urls.ts`
2. Create `{domain}/parsers.ts` with Zod schemas
3. Create `{domain}/types.ts`
4. Create `{domain}/requests.server.ts`
5. Export from `index.server.ts`
6. Add MSW mock handlers in `test/mocks/{domain}/`
7. Register handlers in `test/mocks/index.ts`
8. Add factory schema to `test/mocks/database.ts`
