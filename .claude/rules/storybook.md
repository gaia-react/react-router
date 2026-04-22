---
paths:
  - 'app/**/*.stories.tsx'
  - '.storybook/**/*'
---

# Storybook Conventions

## When to write a story

Write a story for every component scaffolded with `/new-component`. Skip stories only for
pure-utility components with no visual output (e.g. context providers, HOCs with no markup).

## File location and naming

Stories live in the component's `tests/` subfolder as `index.stories.tsx`. Discovered via
`app/**/*.stories.tsx`.

## Typing

Always use `Meta` and `StoryFn` from `@storybook/react-vite`. Never use `Story` (deprecated alias).

```tsx
import type {Meta, StoryFn} from '@storybook/react-vite';
import MyComponent from '..';

const meta: Meta = {
  component: MyComponent,
  parameters: {controls: {hideNoControlsWarning: true}},
  title: 'Components/MyComponent',
};

export default meta;

export const Default: StoryFn = () => <MyComponent />;
```

## Title convention

Use slash-separated paths matching the component hierarchy:

- `Components/MyComponent`
- `Form/InputText`
- `Components/Loaders/Spinner`

## Decorator order

Apply stubs in this order (outermost → innermost): `state` then `reactRouter`.

```tsx
decorators: [stubs.state(), stubs.reactRouter()],
```

Only include stubs the component actually needs. Add `stubs.state()` only when the component
reads from `~/state`. Import from `test/stubs`.

`stubs.reactRouter()` options: `path` (default `/`), `loader`, `action` (string storyId,
`Record<Method, storyId>`, or full `ActionFunction`), and `routes` (`{path, storyId}[]` —
navigates to a story when the path loads).

```tsx
decorators: [
  stubs.reactRouter({
    action: 'my-story--other-state',
    path: '/things',
    routes: [{path: '/things/1', storyId: 'my-story--detail'}],
  }),
],
```

## Padding / layout

Layout is `fullscreen`. Use `parameters.wrap` for padding instead of wrapper divs in JSX:

```tsx
parameters: {wrap: 'p-4'},
```

## Story variant naming

| Variant name        | When to use                                    |
| ------------------- | ---------------------------------------------- |
| `Default`           | The primary/happy-path render (always present) |
| `Loading`           | Component in loading/pending state             |
| `Disabled`          | Component in disabled state                    |
| `WithError`         | Component showing a validation or server error |
| `NoItems` / `Empty` | Empty-state variant                            |
| `LongStrings`       | Overflow / wrapping stress test                |

## Dark-mode and Chromatic

`ChromaticDecorator` renders light + dark side-by-side automatically — no per-story setup needed.
Override via story-level parameters:

```tsx
parameters: {
  chromatic: {
    disableSnapshot: true,    // non-deterministic stories (spinners, env-injected data)
    excludeDark: true,        // light-only snapshot
    viewports: [1280, 412],   // override default [1280]
  },
},
```

## i18n in stories

i18n is global — no setup needed. Use `useTranslation()` inside the story function to vary
content by locale (`i18n.language`).

## Test data

No `msw-storybook-addon` is configured. Pull seed data from the `@mswjs/data` factory:

```tsx
import database from 'test/mocks/database';
import {toCamelCase} from '~/utils/object';

export const Default: StoryFn = () => {
  const things = database.things.getAll().map(toCamelCase) as Things;
  return <ThingsGrid things={things} />;
};
```
