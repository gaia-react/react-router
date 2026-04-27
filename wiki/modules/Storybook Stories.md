---
type: module
path: .storybook/
status: active
language: typescript
purpose: Storybook setup with React Router, i18n, dark mode, and Chromatic snapshots
depends_on: [[Storybook]], [[MSW]]
created: 2026-04-20
updated: 2026-04-27
tags: [module, storybook, testing]
---

# Storybook

Storybook v10 with the `@storybook/react-vite` framework. Configured to discover
`*.stories.tsx` anywhere in `app/`.

## Setup files

| File                | Purpose                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `main.ts`           | Stories glob, addons, viteFinal env injection                    |
| `preview.ts`        | Decorators (Wrap, Chromatic), darkMode config, initialGlobals    |
| `preview-head.html` | Google Fonts preload, `window.process` shim                      |
| `i18next.ts`        | Imports project i18n config for `storybook-react-i18next`        |
| `env.ts`            | Copies `import.meta.env.*` values onto `window.process.env`      |
| `viewport.ts`       | Viewport presets (landscape, portrait, mobileLarge, mobileSmall) |
| `decorators/`       | `WrapDecorator`, `ToastDecorator`                                |
| `chromatic/`        | `ChromaticDecorator` + decorator export logic                    |
| `vite.config.ts`    | Storybook-specific Vite overrides                                |
| `static/`           | Static assets served by Storybook (brand image, etc.)            |

## Addons

| Addon                          | Role                             |
| ------------------------------ | -------------------------------- |
| `storybook-react-i18next`      | Language switcher in the toolbar |
| `@vueless/storybook-dark-mode` | Light/dark toggle                |
| `@storybook/addon-links`       | Story cross-linking              |

`backgrounds`, `measure`, and `outline` addons are disabled via `features`.

## Global parameters

`preview.ts` defaults: `layout: 'fullscreen'`, `chromatic: {viewports: [1280]}`, `controls: {hideNoControlsWarning: true}`. `initialGlobals` seeds the locale switcher with `en` and `ja`. See `.claude/rules/storybook.md` for full conventions.

## Decorator stack

| Decorator            | When active              | What it does                                                                                                           |
| -------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `WrapDecorator`      | Always (outermost)       | Reads `parameters.wrap` class and wraps story — use `parameters: {wrap: 'p-4'}` for padding instead of hardcoding divs |
| `ChromaticDecorator` | Chromatic snapshots only | Renders story twice: light + dark (`50vh` each); `excludeDark: true` suppresses dark render                            |
| `ToastDecorator`     | Always (innermost)       | Appends `<Toast />` after every story                                                                                  |

Chromatic chain: `WrapDecorator → ChromaticDecorator → ToastDecorator`. Interactive: `WrapDecorator → ToastDecorator`.

## Stubs

`test/stubs/` provides story-level decorators. Apply as `[stubs.state(), stubs.reactRouter()]` when both are needed. See `.claude/rules/storybook.md` for full stub options (`action`, `loader`, `path`, `routes`).

## Dark-mode handling

`preview.ts` configures `darkClass` as `['dark', 'bg-gray-900', 'text-white']` and `lightClass`
as `['light', 'bg-white', 'text-gray-900']`. These classes are applied to the preview document
root when the toolbar toggle fires, matching the Tailwind `dark:` variant convention used
throughout the codebase.

`stylePreview: true` applies the theme colours to the Storybook chrome as well.

## i18n

`storybook-react-i18next` is wired to the project's own `~/i18n` config. The toolbar locale
switcher exposes `en` and `ja`. Inside story functions, call `useTranslation()` normally; no
extra setup is required. Per-locale content variation (e.g. stress-testing long CJK strings) is
handled inside the story function by reading `i18n.language`.

## Test data / MSW

No `msw-storybook-addon` — API-level mocking is not used in stories. Pull seed data from the `@msw/data` collections in `test/mocks/database` instead. See `.claude/rules/storybook.md` for the usage pattern.

## Why Storybook is also the test driver

`composeStory` lets Vitest tests reuse the same story setup, so a single source of truth drives
both visual regression (Chromatic) and integration tests. See [[Component Testing]] and
[[Testing]].
