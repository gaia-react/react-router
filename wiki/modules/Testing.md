---
type: module
path: test/, .playwright/
status: active
language: typescript
purpose: Four-layer testing setup — unit, integration, E2E, visual regression
depends_on: [[Vitest]], [[React Testing Library]], [[Playwright]], [[Chromatic]], [[MSW]]
created: 2026-04-20
updated: 2026-04-20
tags: [module, testing]
---

# Testing

GAIA ships **four layers** of testing, all sharing a common [[MSW]] mocking layer.

| Layer | Tool | Where |
|---|---|---|
| Unit | [[Vitest]] | `app/utils/tests/`, `app/hooks/tests/` |
| Integration | Vitest + [[React Testing Library]] | `app/components/*/tests/`, `app/pages/*/tests/` |
| E2E | [[Playwright]] | `.playwright/e2e/*.spec.ts` |
| Visual regression | [[Chromatic]] (CI only) | Storybook stories |

## Vitest config

- `vitest.config.ts` at root
- Looks for `*.test.{ts,tsx}` anywhere in `app/`
- Runs against `happy-dom`
- See [[test-runner]] rule: never run bare `npm test` in CI; use `npm run test -- --run`

## test/ folder

| File | Purpose |
|---|---|
| `mocks/` | MSW handlers + `@mswjs/data` factories per service (`auth/`, `things/`, `user/`, `ping.ts`) |
| `stubs/` | Storybook decorators (`reactRouter()`, `state()`) |
| `msw.server.ts` | MSW server entry used by `entry.server.tsx` when `MSW_ENABLED=true` |
| `rtl.tsx` | RTL setup with i18n strings + auto-cleanup |
| `setup.ts` | Vitest setup file |
| `test.server.ts` | MSW server for Vitest |
| `utils.ts` | Test helpers (delay, date generators) |
| `worker.ts` | MSW browser worker handlers |

## Component test pattern

Always use Storybook stories with `composeStory`. Never manually mock framework deps. See [[Component Testing]].

```tsx
import {composeStory} from '@storybook/react-vite';
import Meta, {Default} from './index.stories';

const MyComponent = composeStory(Default, Meta);

it('renders', () => {
  render(<MyComponent />);
});
```

## Playwright

- Tests in `.playwright/e2e/*.spec.ts`
- Config in `playwright.config.ts`
- Use the bundled `hydration(page)` helper after `page.goto()` to wait for React Router hydration before interacting
- Sample tests: `language-switch.spec.ts`, `things.spec.ts`

## Chromatic

- Visual regression on every PR
- `npm run chromatic` (run in CI)
- `CHROMATIC_PROJECT_TOKEN` env var on CI
- See [[Chromatic Opt-Out]] if you want to remove it

## Pre-commit

- `lint-staged` runs `vitest --run --changed` (only files affected by the staged changes)
- See [[Quality Gate]]
