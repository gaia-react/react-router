---
title: Features
layout: doc
outline: deep
---

# Features

Everything listed here is pre-configured and working, not just installed.

- **20+ ESLint plugins** pre-configured with [Prettier](https://prettier.io/) and [Stylelint](https://stylelint.io/) for consistent code from the first commit
- **Pre-commit hooks** ([Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)) that typecheck, lint, and test before code reaches CI
- **Unit, integration, E2E, and visual regression testing** with [Vitest](https://vitest.dev), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [Playwright](https://playwright.dev/docs/intro), and [Chromatic](https://chromatic.com/), all sharing a common mocking layer
- **i18n in 2 languages** via [remix-i18next](https://github.com/sergiodxa/remix-i18next) with working examples, not just the package installed
- **Auth flow** with login, session management, and route guards via [remix-auth](https://remix.run/resources/remix-auth)
- **Form components with validation** using [Conform](https://conform.guide/) + [Zod](https://zod.dev/), the star of the template
- **Dark mode end-to-end**: context, session, CSS, and Storybook all in sync
- **[Storybook](https://storybook.js.org/) with React Router support**, including i18n, dark mode, and [MSW](https://mswjs.io/) integration
- **API mocking** with [Mock Service Worker](https://mswjs.io/) and [msw/data](https://github.com/mswjs/data), with working handlers for tests and Storybook
- **Toast notifications** with [remix-toast](https://remix.run/resources/remix-toast) and [Sonner](https://sonner.emilkowal.ski/)
- **Claude Code integration** with scaffolding commands, quality rules, and code review (see [Claude Integration](/general/claude))
- **Documentation site** via [VitePress](https://vitepress.dev/) with GitHub Pages deployment
- Built on [React Router 7](https://reactrouter.com/), [TailwindCSS](https://tailwindcss.com/), and [FontAwesome](https://fontawesome.com/) icons
