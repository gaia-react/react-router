---
type: dependency
status: active
package: '@playwright/test'
version: 1.59.1
role: e2e-testing
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, testing, e2e]
---

# Playwright

End-to-end testing. Tests live in `.playwright/e2e/*.spec.ts`. Config in `playwright.config.ts`.

## Architecture

E2E tests run against `npm run dev` (localhost:5173). MSW's browser service worker is active in dev, so tests exercise the full React Router loader/action stack with MSW intercepting API calls — no separate mock server required.

Tests that mutate MSW in-memory state call `resetTestData()` from `test/mocks/database.ts` in `test.afterEach` to restore seed data between tests.

## Hydration helper

> [!key-insight] React Router 7 SSR + Playwright timing
> Pages are rendered server-side first; Playwright sees them before JS hydrates. The `hydration()` helper in `.playwright/utils.ts` waits for `<meta name="hydrated" content="true">` before any interaction proceeds.

```ts
import {hydration} from '../utils';

await page.goto('/');
await hydration(page);  // must come before any interaction
```

## Selectors

Prefer ARIA roles and accessible names. Fall back to `page.locator()` with text/attribute filters when role queries are insufficient. Never use CSS class selectors or XPath.

```ts
// preferred
page.getByRole('button', {name: 'Save'})
page.getByRole('textbox', {name: 'Name'})

// acceptable fallback
page.locator('select', {hasText: 'English'})
```

## Locale and language tests

Set per-describe-block, not globally:

```ts
test.describe('English to Japanese', () => {
  test.use({locale: 'en'});

  test('…', async ({page}) => {
    await page.setExtraHTTPHeaders({'Accept-Language': 'en'});
    await page.context().clearCookies();
    await page.goto('/');
    await hydration(page);
    // web-first assertions from here
  });
});
```

See `language-switch.spec.ts` for the canonical locale-switching pattern.

## Auth / session setup

When a project requires authentication, use a global setup file (`auth.setup.ts`) that logs in once and saves Playwright storage state. Configure it as a `setup` project dependency so authenticated specs reuse the session. Tests that must start unauthenticated call `await page.context().clearCookies()` explicitly.

## Parallelism and CI

| Setting | Local | CI |
|---|---|---|
| workers | unlimited | 1 |
| retries | 0 | 2 |
| browsers | Chromium (+ opt-in multi) | Chromium |
| `fullyParallel` | true | true |

Multi-browser testing (webkit, Firefox, mobile) is opt-in via the `TEST_ALL_BROWSERS` flag in `playwright.config.ts`.

## Traces and screenshots

`trace: 'retain-on-failure'` — traces saved to `.playwright/output/` on test failure. Use the Playwright trace viewer (`npx playwright show-trace`) to inspect. No manual screenshot calls in specs.

## Scripts

```
npm run pw        # headless run
npm run pw-ui     # interactive UI mode
```

## Companion packages

- `@playwright-testing-library/test`
- `eslint-plugin-playwright`
- `playwright install --with-deps` runs in `npm run prepare` (Husky)
