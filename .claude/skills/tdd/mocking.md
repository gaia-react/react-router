# When to Mock (GAIA)

Mock at **system boundaries** only. In GAIA, the boundaries are narrow and well-known:

| Boundary | Mock via | Example |
| --- | --- | --- |
| HTTP / external APIs | MSW handlers in `test/mocks/` | REST calls made by `app/services/` |
| Database read/write | `@mswjs/data` factory seeded via `database` | `database.things.create(...)` in a test |
| Time | `vi.useFakeTimers()` | Debounced handlers, TTL expiry |
| Randomness | Inject or stub via `vi.spyOn` at boundary | IDs, crypto |
| Navigation (in unit scope) | `stubs.reactRouter({routes})` | Buttons that push to `/done` |

## Don't mock

- **Your own services, hooks, components, utilities.** If a component consumes `useThings()`, test it against the real hook reading from real MSW. Mocking `useThings` means you're testing a fiction.
- **`react-router` or `react-i18next`.** Use `stubs.reactRouter()` / `stubs.state()` from `test/stubs`. Global i18n is wired in `test/setup.ts`.
- **Zod schemas.** If a service fails to parse a response, that's a real bug the test should surface.

## MSW-first pattern

Every service in `app/services/gaia/` has a mirror in `test/mocks/{domain}/` (see `.claude/rules/api-service.md`). Handlers run in Vitest, Storybook, AND Playwright — one mock layer, three testing scopes.

**Mutating data in a test**: call the `database` factory directly; reset in `afterEach`:

```ts
import {afterEach, describe, test} from 'vitest';
import database, {resetTestData} from 'test/mocks/database';

describe('createThing', () => {
  afterEach(() => resetTestData());

  test('new thing is retrievable', async () => {
    const created = await createThing({name: 'Alice'});
    const found = await getThingById(created.id);
    expect(found.name).toBe('Alice');
  });
});
```

The read-then-verify shape tests the interface end-to-end. It survives switching ORMs, URL changes, or schema renames as long as the public service contract holds.

## Designing for mockability at boundaries

**1. One function per endpoint**

```ts
// GOOD: each request is independently exercisable
export const getThingById = (id: string): Promise<Thing> => { ... };
export const createThing = (data: NewThing): Promise<Thing> => { ... };

// BAD: conditional mocking required
export const thingsApi = (op: 'get' | 'create', data?: unknown) => { ... };
```

**2. Accept dependencies you don't own**

External clients (analytics, third-party SDKs) belong as function params or injected context, not module-level singletons. In GAIA this is rare — most "dependencies" for feature code are either MSW-covered (HTTP) or explicit (Zod schemas).

**3. Return values, avoid side effects**

Pure transforms over mutation. A service that returns the created record is trivially testable; one that only "saves somewhere" forces the test to go find it.

## Red flags

- `vi.mock('~/services/...')` — you've mocked something MSW already handles.
- `vi.mock('~/hooks/...')` or `vi.mock('~/components/...')` — internal collaborator mocking.
- Test setup that reimplements application logic to seed data (write to `database` instead).
- A fixture file larger than the code it tests.
