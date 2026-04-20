---
type: module
path: app/utils/
status: active
language: typescript
purpose: Pure utility functions used throughout the app
created: 2026-04-20
updated: 2026-04-20
tags: [module, utils]
---

# Utils

`app/utils/` holds pure helpers — array, date, dom, environment, function, http (split `http.ts` / `http.server.ts`), object, string. Each should be well-named, self-explanatory, and unit-tested.

## Tests

`app/utils/tests/` holds the Vitest tests. Trivial wrappers around native APIs may not warrant a test — use judgment.
