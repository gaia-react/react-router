---
type: module
path: .storybook/
status: active
language: typescript
purpose: Storybook setup with React Router, i18n, dark mode, and Chromatic snapshots
depends_on: [[Storybook]], [[MSW]]
created: 2026-04-20
updated: 2026-04-20
tags: [module, storybook, testing]
---

# Storybook

Storybook v10 with the `@storybook/react-vite` framework. Configured to discover
`*.stories.tsx` anywhere in `app/`.

## Setup files

| File                | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `main.ts`           | Stories glob, addons, viteFinal env injection                  |
| `preview.ts`        | Decorators (Wrap, Chromatic), darkMode config, initialGlobals  |
| `preview-head.html` | Google Fonts preload, `window.process` shim                    |
| `i18next.ts`        | Imports project i18n config for `storybook-react-i18next`      |
| `env.ts`            | Copies `import.meta.env.*` values onto `window.process.env`    |
| `viewport.ts`       | Viewport presets (landscape, portrait, mobileLarge, mobileSmall) |
| `decorators/`       | `WrapDecorator`, `ToastDecorator`                              |
| `chromatic/`        | `ChromaticDecorator` + decorator export logic                  |
| `vite.config.ts`    | Storybook-specific Vite overrides                              |
| `static/`           | Static assets served by Storybook (brand image, etc.)          |

## Addons

| Addon                        | Role                            |
| ---------------------------- | ------------------------------- |
| `storybook-react-i18next`    | Language switcher in the toolbar |
| `@vueless/storybook-dark-mode` | Light/dark toggle              |
| `@storybook/addon-links`     | Story cross-linking             |

`backgrounds`, `measure`, and `outline` addons are disabled via `features`.

## Global parameters

```ts
// preview.ts defaults
parameters: {
  chromatic: {viewports: [1280]},
  controls: {expanded: false, hideNoControlsWarning: true},
  layout: 'fullscreen',   // full-page render by default
}
```

`initialGlobals` seeds the locale switcher with `en` and `ja`.

## Decorator stack

In Chromatic snapshot runs the full decorator chain (outer → inner) is:

```
WrapDecorator → ChromaticDecorator → ToastDecorator
```

In interactive Storybook (`isChromaticSnapshot === false`):

```
WrapDecorator → ToastDecorator
```

`ChromaticDecorator` is injected only during Chromatic runs; the dark-mode toggle drives dark
appearance in interactive use via a channel listener that adds/removes the `dark` class on
`document.documentElement`.

### WrapDecorator

Reads `parameters.wrap` and wraps the story in a `<div className={wrap}>`. Storybook layout is
`fullscreen`, so use this parameter to add padding rather than hardcoding divs in story JSX:

```ts
parameters: {wrap: 'p-4'}
```

### ToastDecorator

Appends the `<Toast />` component after every story so toast notifications render correctly.

### ChromaticDecorator

Renders the story twice: once in a light container (`bg-white text-gray-900`) and once in a dark
container (`dark bg-gray-900 text-white`), each `50vh`. Clears `sessionStorage` before each
snapshot for consistency. Use `parameters.chromatic.excludeDark: true` to suppress the dark
render and restore the container to `100vh`.

## Stubs

`test/stubs/` provides story-level decorators for framework contexts:

| Stub                    | What it provides                                      |
| ----------------------- | ----------------------------------------------------- |
| `stubs.reactRouter()`   | React Router context via `createRoutesStub`           |
| `stubs.state()`         | Global `~/state` context                              |

Apply in order `[stubs.state(), stubs.reactRouter()]` when both are needed. The router stub
accepts `action`, `loader`, `path`, and `routes` options that can navigate to other stories on
form submit or route transition — see `.claude/rules/storybook.md` for the API.

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

The project uses `@mswjs/data` factories in `test/mocks/database` as the source of seed data for
stories. There is no `msw-storybook-addon` wired into Storybook — API-level mocking at the
`fetch` layer is not used in stories. Instead, stories receive pre-built data objects pulled from
the in-memory database:

```ts
import database from 'test/mocks/database';
import {toCamelCase} from '~/utils/object';

const resources = database.resources.getAll().map(toCamelCase) as Resources;
```

## Why Storybook is also the test driver

`composeStory` lets Vitest tests reuse the same story setup, so a single source of truth drives
both visual regression (Chromatic) and integration tests. See [[Component Testing]] and
[[Testing]].
