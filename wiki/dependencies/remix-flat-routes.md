---
type: dependency
status: active
package: remix-flat-routes
version: 0.8.5
role: routing-adapter
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, routing]
---

# remix-flat-routes

File-based routing adapter that translates folder names like `_public+/things+/$id.tsx` into React Router 7 routes. Used via `@react-router/remix-routes-option-adapter` in `app/routes.ts`.

## Folder syntax

- `_name+` — group/layout folder (segment is pathless, layout applies)
- `$param` — dynamic route segment
- `_index` — index route for the folder

See [[Routing]] for GAIA's standard route groups.

## Alternative

Switch to standard React Router 7 routing if you prefer explicit `routes.ts` definitions.
