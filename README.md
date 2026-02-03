# Welcome to GAIA React!

<img src="./app/assets/images/gaia-logo.svg" height="100" alt="GAIA"/>

GAIA React is a **fully comprehensive** template for building modern React web applications.

It is designed to be the best possible starting point for any professional React project.

It comes with **EVERYTHING** you need, fully configured and ready to go.

The Developer Experience (DX) is designed to be top-notch.

- Automated and robust code quality tools are all set up, keeping your code clean and tech debt to a minimum.
- Best practices are baked into the source code examples for you to follow.
- Utilities, hooks, authentication, components, services, styles, tests, stories, and other code examples are all included to help you get started quickly.
- Unit, integration, visual regression, and end-to-end tests are set up.
- While GAIA comes with recommended packages, conventions, and settings, you're free to change or remove them to suit your needs!

GAIA React has many great features built-in:

- Built with [React Router 7](https://reactrouter.com/), a fantastic full-stack React framework for the modern web
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Zod](https://zod.dev/) for data validation
- Robust ESLint ruleset along with [Prettier](https://prettier.io/) and [Stylelint](https://stylelint.io/)
- [Husky](https://typicode.github.io/husky/) and [Lint-Staged](https://github.com/lint-staged/lint-staged) for pre-commit checks to ensure code quality
- A complete testing suite with [Vitest](https://vitest.dev), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), and [PlayWright](https://playwright.dev/docs/intro)
- [Storybook](https://storybook.js.org/) and [Chromatic](https://chromatic.com/), with a [React Router Stub](https://reactrouter.com/start/framework/testing) decorator included
- [Mock Service Worker](https://mswjs.io/) with working handlers, and [msw/data](https://github.com/mswjs/data) for data mocking
- [remix-auth](https://remix.run/resources/remix-auth) with a working authentication example
- Toast notifications with [remix-toast](https://remix.run/resources/remix-toast) and [Sonner](https://sonner.emilkowal.ski/)
- Internationalization via [remix-i18next](https://github.com/sergiodxa/remix-i18next) with sample files already in place
- [Conform](https://conform.guide/) for form management and validation
- [FontAwesome](https://fontawesome.com/) icons
- A convenient and flexible wrapper around fetch that simplifies API calls
- Many example components, ready for you to use and modify
- Useful utility functions and hooks
- Dark mode support
- And much more!

No matter what your skill level or experience, GAIA will make your life and your code better.

Read the [GAIA Documentation](https://gaia-react.github.io/react-router/) for detailed information about working with GAIA.

## Is this associated with the GAIA Flash Framework?

**Yes!**

The GAIA Flash Framework revolutionized Flash website development and became the most popular Flash framework in the world (second only to Adobe Flex, which was focused on enterprise applications). It was used to build over 100,000 Flash sites and relied upon by every major digital agency worldwide.

GAIA React is its spiritual successor. It has been reborn as a React template. Like its predecessor, it's designed to be the most comprehensive and easy-to-use React template available, to build professional-grade frontend applications.

## Installation

Make sure you have [Node.js](https://nodejs.org/en/) >=20.17.0 LTS installed, preferably via [nvm](https://github.com/nvm-sh/nvm).

All you need to do is run this installation command and get to work.

```sh
npx create-react-router@latest --template gaia-react/react-router
```

### Install packages

```sh
npm install
```

Duplicate the `.env.example` file and name it `.env`.

### Setup Fix on Save in your IDE

Follow these [instructions](/react-router/tech-stack/code-quality/#setup-fix-on-save).

## Development

Here's how to develop with GAIA.

### Storybook

```sh
npm run storybook
```

### React Router 7

```sh
npm run dev
```

### Styling

This template comes with [Tailwind CSS](https://v3.tailwindcss.com/) configured, with some configuration and utilities, which you can change to suit your project.

See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

### Icons

[FontAwesome](https://fontawesome.com/) is included. You're free to change it if you like.

### i18n

[Remix-i18next](https://github.com/sergiodxa/remix-i18next) is configured with examples.

Storybook is already configured with react-i18n support.

## Testing

GAIA comes with a full testing suite already configured.

### Unit and Integration

- [vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

```sh
  npm t
  // or
  npm run test
```

### Visual Regression

[Chromatic](https://chromatic.com)

You'll need to set your `CHROMATIC_PROJECT_TOKEN` env variable on your CI.

### E2E

[PlayWright](https://playwright.dev/docs/intro)

```sh
npx playwright test
```

Interactive mode:

```sh
npx playwright test --ui
```

## Deployment

GAIA comes with the default Remix deployment configuration. You can change this to whatever deployment process you prefer.

Here's the basic Remix deployment process:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

You'll need to pick a host to deploy it to. Jacob Paris wrote a [great article](https://www.jacobparis.com/content/where-to-host-remix) on where to host your React Router 7 app.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
