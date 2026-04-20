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

`app/utils/` holds pure helpers. Each should be well-named, self-explanatory, and unit-tested.

| File                         | Purpose                                                  |
| ---------------------------- | -------------------------------------------------------- |
| `array.ts`                   | Array helpers                                            |
| `date.ts`                    | Date helpers (often wrapping `date-fns`)                 |
| `dom.ts`                     | DOM helpers                                              |
| `environment.ts`             | Env helpers                                              |
| `function.ts`                | Function helpers (debounce, throttle, etc.)              |
| `http.ts` / `http.server.ts` | HTTP helpers (split client/server with `.server` suffix) |
| `object.ts`                  | Object helpers                                           |
| `string.ts`                  | String helpers                                           |

## Tests

`app/utils/tests/` holds the Vitest tests. Trivial wrappers around native APIs may not warrant a test — use judgment.
