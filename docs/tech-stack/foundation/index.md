---
title: Foundation
layout: doc
outline: deep
---

# GAIA Foundation

GAIA's foundation includes the following:

## React Router 7

[React Router 7](https://reactrouter.com/) is a full stack web framework that lets you focus on the user interface and work back through web standards to deliver a fast, slick, and resilient user experience.

GAIA's React Router 7 setup includes the following helpful libraries:
- [remix-auth](https://github.com/sergiodxa/remix-auth#readme)
- [remix-flat-routes](https://github.com/kiliman/remix-flat-routes#readme)
- [remix-development-tools](https://github.com/forge42dev/Remix-Dev-Tools#readme)
- [remix-toast](https://github.com/forge42dev/remix-toast#readme)
- [remix-utils](https://github.com/sergiodxa/remix-utils#readme)

## Tailwind

[Tailwind](https://tailwindcss.com/) is a utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.

GAIA's Tailwind setup includes the following great tools which make working with Tailwind even better:

**Class Management**
- [tailwind-merge](https://github.com/dcastil/tailwind-merge#readme)

**Linting**
- [eslint-plugin-better-tailwind](https://github.com/schoero/eslint-plugin-better-tailwindcss#readme)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss#readme)
- [stylelint-config-tailwindcss](https://github.com/zhilidali/stylelint-config-tailwindcss#readme)

**Plugins**
- [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms#readme)
- [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography#readme)

## Data Validation

GAIA comes with [Zod](https://zod.dev/), which you can use for form validation, API request/response validation and transformation, environment variables validation, generating TypeScript types, and more.

There are other libraries you can use instead, such as [Yup](https://github.com/jquense/yup#readme) and [Superstruct](https://github.com/ianstormtaylor/superstruct#readme).

## Internationalization

GAIA comes with [remix-i18next](https://github.com/sergiodxa/remix-i18next), which is built on top of [i18next](https://www.i18next.com/).

Even if your site only has one language, being able to externalize your strings makes it easier to maintain and update your site, and future-proof it if you ever need to app internationalization.

GAIA's Storybook setup includes the [storybook-react-i18next](https://github.com/stevensacks/storybook-react-i18next) addon so you can test your components in different languages.

### Translation Files
GAIA uses `.ts` files for language files, instead of JSON. There are many reasons for this:

- ESLint keeps the files organized and formatted consistently.
- TypeScript will catch any syntax errors.
- Type safety and auto-completion.
- It's easy to extend translations with dot syntax for pages by route paths (e.g. `pages.user.profile.settings`).
- You can easily use translation strings in your tests. Check the Playwright tests included in GAIA for examples.

## Form Validation

GAIA includes [RVF](https://www.rvf-js.io/) for form validation.

There are other libraries you can use instead, such as [remix-forms](https://remix-forms.seasoned.cc/), [conform](https://conform.guide/), etc.

## Icons

GAIA includes [FontAwesome](https://fontawesome.com/), a popular icon library that has thousands of React-friendly icons.

There are other libraries you can use instead, such as [heroicons](https://heroicons.com/), [Feather](https://feathericons.com/), etc.
