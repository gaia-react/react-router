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

`@mswjs/data` (in-memory DB), `public/mockServiceWorker.js` (worker via `msw.workerDirectory` in `package.json`). `msw-storybook-addon` is installed but deliberately unused — stories seed from `@mswjs/data` directly. See `modules/Storybook.md` for rationale.

See [[MSW|MSW module]] for handler structure.
