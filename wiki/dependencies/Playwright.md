---
type: dependency
status: active
package: "@playwright/test"
version: 1.59.1
role: e2e-testing
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, testing, e2e]
---

# Playwright

End-to-end testing. Tests live in `.playwright/e2e/*.spec.ts`. Config in `playwright.config.ts`.

## Hydration helper

> [!key-insight] React Router 7 SSR + Playwright timing
> Pages are rendered server-side first; Playwright sees them before JS hydrates. The bundled `hydration(page)` helper waits for React Router to hydrate before interactions.
>
> ```ts
> await page.goto(path);
> await hydration(page);
> ```

## Companion packages

- `@playwright-testing-library/test`
- `eslint-plugin-playwright`
- `playwright install --with-deps` runs in `npm run prepare` (Husky)

## Sample tests

- `language-switch.spec.ts`
- `things.spec.ts` (deleted by `/gaia-init`)
