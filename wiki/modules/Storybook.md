---
type: module
path: .storybook/
status: active
language: typescript
purpose: Storybook setup with React Router, i18n, dark mode, and MSW
depends_on: [[Storybook]], [[MSW]]
created: 2026-04-20
updated: 2026-04-20
tags: [module, storybook, testing]
---

# Storybook

Storybook v10 with the `@storybook/react-vite` framework. Configured to find `*.stories.tsx` anywhere in `app/`.

## Setup files

| File | Purpose |
|---|---|
| `main.ts` | Stories glob, addons, viteFinal env injection |
| `preview.ts` | Decorators (Wrap, Chromatic), darkMode config, initialGlobals |
| `preview-head.html` | Google Fonts preload |
| `i18next.ts` | Imports project i18n setup for `storybook-react-i18next` |
| `env.ts` | Applies env vars to `window.process.env` |
| `viewport.ts` | Viewport presets |
| `decorators/` | Custom decorators (Wrap, etc.) |
| `chromatic/` | Chromatic-specific decorators (e.g. viewport pinning) |
| `vite.config.ts` | Storybook-specific Vite overrides |
| `static/` | Static assets (e.g. `gaia-logo.png` brand image) |

## Addons

- **storybook-react-i18next** — language switcher
- **@vueless/storybook-dark-mode** — light/dark toggle
- **msw-storybook-addon** — MSW handlers in stories

## Wrap decorator

> [!key-insight] Story padding via `wrap` parameter
> Storybook layout is set to `fullscreen` so full-page components render correctly. The bundled `Wrap` decorator looks at `parameters.wrap` and wraps the story in a div with those Tailwind classes:
>
> ```ts
> parameters: { wrap: 'p-4' }
> ```
>
> Most common: `wrap: 'p-4'` (1rem padding).

## Stubs

`test/stubs/` provides:

- `stubs.reactRouter()` — React Router context (Form, useNavigation, etc.)
- `stubs.state()` — global State context

Use these in stories instead of mocking `react-router` or `react-i18next`. See [[Component Testing]].

## Why Storybook is also the test driver

`composeStory` lets Vitest tests reuse the same story setup, so a single source of truth drives both visual regression (Chromatic) and integration tests. See [[Testing]].
