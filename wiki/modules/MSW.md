---
type: module
path: test/mocks/, public/mockServiceWorker.js
status: active
language: typescript
purpose: API mocking layer shared across Vitest, Storybook, and dev
depends_on: [[MSW]], [[mswjs-data]]
created: 2026-04-20
updated: 2026-04-20
tags: [module, msw, testing, mocking]
---

# MSW (Mock Service Worker)

GAIA uses [[MSW]] + `@mswjs/data` as the **single mocking layer** for tests, Storybook, and optional dev mode.

> [!key-insight] One mocking layer across all test layers
> Same handlers, same data, same factory. Vitest tests, Playwright runs (when `MSW_ENABLED=true`), Storybook stories, and your dev server all see the same fake API.

## Folder layout

```
test/mocks/
├── auth/
│   ├── data.ts         # @mswjs/data schema + seed
│   ├── get.ts          # GET handlers
│   ├── post.ts
│   └── index.ts        # barrel
├── things/             # same shape
├── user/
├── ping.ts
├── faker.ts            # faker.js wrapper for randomized seeds
├── database.ts         # @mswjs/data factory composition + resetTestData
└── index.ts            # combines all handlers
```

`@mswjs/data` provides an in-memory database — primary keys, queries, mutations — so handlers like `database.things.getAll()` work as if they were a real backend.

## Service-mock parity

Each handler file maps 1:1 to a request function in `app/services/gaia/{domain}/requests.server.ts`. The `/new-service` command scaffolds both halves at the same time. See [[API Service Pattern]].

## Where it runs

| Surface               | Entry                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------- |
| Vitest                | `test/test.server.ts` (server) → wired in `test/setup.ts`                                |
| Storybook             | `msw-storybook-addon` in `.storybook/preview.ts`                                         |
| Dev server (optional) | `entry.server.tsx` checks `MSW_ENABLED=true`                                             |
| Browser worker        | `public/mockServiceWorker.js` (auto-installed via `msw.workerDirectory` in package.json) |

## Stubs vs mocks

- **Stubs** (`test/stubs/`) wrap framework providers (React Router, State) for stories
- **Mocks** (`test/mocks/`) intercept HTTP requests via MSW

See [[Testing]].
