---
type: dependency
status: active
package: msw
version: ^2.13.4
role: api-mocking
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, testing, mocking]
---

# MSW

[Mock Service Worker](https://mswjs.io/). Intercepts HTTP via Service Worker (browser) or interceptors (Node). One mocking layer for tests, Storybook, and dev.

## Companion packages

- `@mswjs/data` — in-memory database with primary keys + queries
- `msw-storybook-addon` — wires MSW into Storybook stories
- `public/mockServiceWorker.js` — generated worker (declared via `msw.workerDirectory` in `package.json`)

See [[MSW|MSW module]] for handler structure.
