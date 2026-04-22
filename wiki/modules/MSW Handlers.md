---
type: module
path: test/mocks/, test/worker.ts, test/test.server.ts, test/msw.server.ts
status: active
language: typescript
purpose: API mocking layer shared across Vitest, Storybook, and dev
depends_on: [[MSW]]
created: 2026-04-20
updated: 2026-04-20
tags: [module, msw, testing, mocking]
---

# MSW (Mock Service Worker)

GAIA uses [[MSW]] + `@mswjs/data` (npm package — no wiki page) as the **single mocking layer** for unit tests, Playwright E2E, Storybook stories, and optional dev mode.

> [!key-insight] One mock set, three environments
> The same handlers and in-memory database serve Vitest (CI/local), the dev server (MSW_ENABLED=true), and Playwright runs. You define a mock once; every surface sees the same fake API.

See also: [[API Service Pattern]], [[Services]], [[Testing]], [[test-runner]].

---

## 1. Purpose

MSW intercepts HTTP requests at the network layer — no monkey-patching, no import mocking. Because the service layer uses `ky` with `API_URL` as the prefix, every outbound request goes through a real fetch. MSW catches it before it leaves the process (Node) or browser (Service Worker).

This means tests exercise the full request path: route loader → service function → ky → MSW handler → fake DB → response parsing.

---

## 2. Folder structure

| Path                                                                | Role                                         |
| ------------------------------------------------------------------- | -------------------------------------------- |
| `test/mocks/{resource}/data.ts`                                     | `@mswjs/data` schema + seed records          |
| `test/mocks/{resource}/get.ts` / `post.ts` / `put.ts` / `delete.ts` | HTTP handlers                                |
| `test/mocks/{resource}/index.ts`                                    | Barrel — re-exports all handlers as an array |
| `test/mocks/database.ts`                                            | Factory composition + `resetTestData()`      |
| `test/mocks/faker.ts`                                               | Seeded faker instance (consistent test data) |
| `test/mocks/ping.ts`                                                | Passthrough for Remix dev ping               |
| `test/mocks/url.ts`                                                 | URL helper — mirrors ky prefix-join logic    |
| `test/mocks/index.ts`                                               | Registry — combines all resource handlers    |

Support files:

- `test/worker.ts` — browser Service Worker setup (dev mode)
- `test/test.server.ts` — Node server setup (Vitest)
- `test/msw.server.ts` — Node server setup for dev server (`MSW_ENABLED`)
- `test/utils.ts` — shared `DELAY`, `date()` helpers

---

## 3. Service-layer contract

**This is the most important invariant.** MSW handler URLs must exactly match the URLs that the service layer constructs at runtime.

### How a request URL is built

1. `API_URL` env var provides the prefix (e.g. `http://localhost:3001/api/`).
2. `app/services/api/utils.ts → getBaseUrl()` reads it; `ky` prepends it to every path.
3. `GAIA_URLS` in `app/services/gaia/urls.ts` provides the path token (e.g. `'resources'` or `'resources/:id'`).
4. The service function calls `api(GAIA_URLS.resources)` — ky joins prefix + path → `http://localhost:3001/api/resources`.

### How a handler URL must be built

MSW handlers must use `url()` from `test/mocks/url.ts` — **never** a bare string:

```ts
import {http} from 'msw';
import {GAIA_URLS} from '~/services/gaia/urls';
import {url} from '../url';

http.get(url(GAIA_URLS.resources), () => { ... });
```

`url()` strips trailing slashes from `API_URL` and leading slashes from the path, then joins them with exactly one `/` — mirroring ky's own prefix-join. Without it, a handler built as `` `${API_URL}resources` `` will **not** match a request to `${API_URL}/resources` when `API_URL` has no trailing slash.

> [!warning] URL drift = escaped requests
> If a handler URL doesn't match the ky-constructed URL, MSW passes the request through (`onUnhandledRequest: 'bypass'`). The request goes to the real network, fails silently in tests, and appears as a flaky fetch error rather than a mock miss.

### URL constants are the contract

```ts
// app/services/gaia/urls.ts
export const GAIA_URLS = {
  resources: 'resources',
  resourcesId: 'resources/:id',
};
```

The service function and the MSW handler both import `GAIA_URLS`. If the URL constant changes, both sides update together. Never hardcode paths in handler files.

---

## 4. Three modes

| Mode                   | How it's wired                                                                                      | Entry point                                                                                                              | Config                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Dev**                | Browser Service Worker (client) + Node `SetupServer` (SSR) run simultaneously                       | `app/entry.client.tsx` starts `test/worker.ts`; `app/entry.server.tsx` calls `startApiMocks()` from `test/msw.server.ts` | Set `MSW_ENABLED=true` in `.env`; SW file at `public/mockServiceWorker.js`               |
| **Vitest**             | Node `setupServer` via `test/test.server.ts`, registered in `test/setup.ts` as a `setupFiles` entry | `beforeAll → listen`, `afterEach → resetHandlers`, `afterAll → close`                                                    | `vitest.config.ts` → `setupFiles: ['./test/setup.ts']`; run with `npm run test -- --run` |
| **CI/CD (Playwright)** | MSW is **not** wired automatically; tests run against a real API or the dev server                  | Start `npm run dev` with `MSW_ENABLED=true` and point Playwright's `baseURL` at it                                       | `test:ci` script: `vitest --run --passWithNoTests --coverage --bail 1`                   |

---

## 5. Writing a new mock

**Ask Claude to scaffold it via `/new-service`.** The command creates the full mock layer alongside the service so the two stay in sync — the service request functions and their matching handlers drop in together, URLs share `GAIA_URLS` constants, and the database factory registers the new resource.

`/new-service` produces:

| File                                                                | Contents                                                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `test/mocks/{resource}/data.ts`                                     | `@mswjs/data` schema + seed records in the raw server (snake_case) shape |
| `test/mocks/{resource}/get.ts` + `post.ts` / `put.ts` / `delete.ts` | HTTP handlers using `url(GAIA_URLS.key)` — never a hardcoded string      |
| `test/mocks/{resource}/index.ts`                                    | Barrel combining handlers into an array                                  |
| `test/mocks/index.ts`                                               | Registry updated to include the new barrel                               |
| `test/mocks/database.ts`                                            | Factory schema added + `resetTestData()` updated to reseed the new table |
| `app/services/gaia/urls.ts`                                         | URL constants added (and shared with the service)                        |

If you're editing an existing mock by hand instead of scaffolding, the invariants you must preserve are covered in [Section 3 — Service-layer contract](#3-service-layer-contract) (handlers use `url(GAIA_URLS.key)`, data stays snake_case, factory + `resetTestData()` stay in sync). See the `api-service` rule (`.claude/rules/api-service.md`) for the full contract and [[API Service Pattern]] for the service side.

---

## 6. Database factory pattern

`test/mocks/database.ts` composes all resource schemas into a single `@mswjs/data` factory. The factory provides typed in-memory CRUD: `create`, `findFirst`, `findMany`, `getAll`, `update`, `delete`, `deleteMany`.

`resetTestData()` is called:

- **Once on module load** — seeds the database for the first test in a file.
- **Explicitly in test files** — call it in `beforeEach` when a test mutates data and the next test must start clean.

```ts
import {resetTestData} from 'test/mocks/database';

beforeEach(() => {
  resetTestData();
});
```

`test/test.server.ts` calls `server.resetHandlers()` in `afterEach` — this resets runtime handler overrides but **not** the database. Always call `resetTestData()` explicitly in tests that write, update, or delete records.

`test/mocks/faker.ts` exports a seeded `faker` instance (seed `7`) so generated values are deterministic across runs.

---

## 7. Common pitfalls

| Pitfall                                 | Cause                                    | Fix                                                                                        |
| --------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| Request escapes to real network         | Handler URL doesn't match ky URL         | Always use `url(GAIA_URLS.key)` — never a hardcoded string                                 |
| Test sees stale data after mutation     | Forgot `resetTestData()` between tests   | Call in `beforeEach` for any test suite that writes                                        |
| MSW not active in dev                   | `MSW_ENABLED` missing or false in `.env` | Set `MSW_ENABLED=true` in `.env` (see `.env.example`)                                      |
| Server-side requests bypass mock in dev | `entry.server.tsx` check failed          | Ensure `env.MSW_ENABLED` is truthy (it's a boolean env read by `env.server.ts`)            |
| Handler added but never triggered       | Not registered in `test/mocks/index.ts`  | Add the resource barrel to the registry                                                    |
| Runtime override persists across tests  | Didn't rely on `afterEach` reset         | `server.resetHandlers()` runs automatically; don't call `server.use()` outside a test body |
| Playwright ignores mocks                | Playwright doesn't use Vitest server     | Start dev server with `MSW_ENABLED=true` and point Playwright at it                        |
