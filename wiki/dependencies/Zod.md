---
type: dependency
status: active
package: zod
version: 4.3.6
role: schema-validation
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, validation]
---

# Zod

Schema validation. Used for:

- Form validation (with [[Conform]])
- API response parsing in `app/services/gaia/{domain}/parsers.ts`
- Env var validation in `app/env.server.ts`
- TypeScript type inference (`z.infer<typeof schema>`)

## v4 conventions

> [!key-insight] Zod v4 changes to enforce
> - Use `z.email()` not `z.string().email()` (deprecated)
> - Use `z.literal()` not `z.enum()` per project rules
> - Import Conform integration from `@conform-to/zod/v4`

See [[ESLint Fixes]] for the deprecation rule.

## Alternatives mentioned in docs

[Yup](https://github.com/jquense/yup), [Superstruct](https://github.com/ianstormtaylor/superstruct)
