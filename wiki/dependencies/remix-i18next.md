---
type: dependency
status: active
package: remix-i18next
version: ^7.5.0
role: i18n
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, i18n]
---

# remix-i18next

i18n integration built on `i18next` for Remix / React Router 7. GAIA wires it through middleware (`app/middleware/i18next.ts`) and exposes server-side translation for loaders via `getInstance(context)`.

## Companion

- `i18next` ^26.0.6
- `react-i18next` ^17.0.4
- `i18next-browser-languagedetector` 8.2.1
- `accept-language-parser` 1.5.0
- `storybook-react-i18next` 10.1.2

> [!note] `overrides` block in package.json
> The package.json `overrides` block forces `remix-i18next` to use the same `i18next` and `react-i18next` versions as the rest of the project to avoid duplicate copies.

See [[i18n]], [[Language Flow]].
