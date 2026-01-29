---
title: E2E
layout: doc
outline: deep
---

# End-to-end Testing

GAIA comes with end-to-end testing configured using [Playwright](https://playwright.dev/).

## Configuration

The `playwright.config.ts` file contains the [configuration](https://playwright.dev/docs/test-configuration) for Playwright.

Playwright is configured to look for tests in the `.playwright/e2e` folder, following the `*.spec.ts` pattern.

### .playwright

Your Playwright tests should be placed in the `.playwright` folder.

GAIA includes some example tests, and a `utils.ts` file that contains some helper functions.

## hydration()

React Router 7 first loads your pages without JavaScript being hydrated, and Playwright immediately acts upon the page as soon it is available.

However, you will sometimes need to [wait for JavaScript to be hydrated](https://playwright.dev/docs/navigations#hydration) before Playwright should interact with the page.

GAIA comes with a helpful `hydration()` utility function to tell Playwright to wait until React Router 7 hydrates JavaScript on the page.

Simply add the following to your Playwright tests after `await page.goto(path)`

```ts
await hydration(page);
```

The example tests in the `.playwright/e2e` folder show how to use this function.
