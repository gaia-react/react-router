# GAIA React

<img src="./app/assets/images/gaia-logo.svg" height="100" alt="GAIA"/>

Starting a new React project means days of setup before writing a single feature. Linting, testing, i18n, auth, CI, pre-commit hooks, dark mode, Storybook. All of it needs to be configured, integrated, and wired together correctly.

GAIA React is the most thoroughly configured React Router 7 template available. Every tool is set up, every integration tested, every convention documented. You start writing features on day one.

## What You Get

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
- **Claude Code integration** with scaffolding commands, quality rules, and code review (see [Claude](#claude) section)
- **Documentation site** via [VitePress](https://vitepress.dev/) with GitHub Pages deployment
- **Knowledge base for LLMs**: a [committed `wiki/`](#wiki) of architecture, modules, decisions, and dependencies that Claude reads on demand — no token bloat, no stale CLAUDE.md sprawl
- Built on [React Router 7](https://reactrouter.com/), [TailwindCSS](https://tailwindcss.com/), and [FontAwesome](https://fontawesome.com/) icons

## Philosophy

GAIA is a **base template**, not a full-stack kit. It deliberately does not include a component library. You choose what fits your project.

- Configuring 20+ linting rules, four layers of testing, i18n, auth, and CI correctly takes days. GAIA solves that once.
- **Every tool is pre-configured but removable.** Don't need i18n? Remove it. Prefer a different icon set? Swap it. Nothing is locked in.
- Pre-commit hooks run typechecking, linting, and tests. The quality gate catches issues before they compound.
- Best practices are baked into working examples you can follow and modify.

## How GAIA Compares

| Feature                    |                       GAIA                       | Vite React | RR Template | Next.js |
| -------------------------- | :----------------------------------------------: | :--------: | :---------: | :-----: |
| ESLint                     |                   20+ plugins                    |   basic    |    basic    |  basic  |
| Prettier + Stylelint       |                  pre-configured                  |     —      |      —      |    —    |
| Pre-commit hooks           |             typecheck + lint + test              |     —      |      —      |    —    |
| Unit + integration testing |                   Vitest + RTL                   |     —      |      —      |    —    |
| E2E testing                |                    Playwright                    |     —      |      —      |    —    |
| Visual regression testing  |                   Chromatic CI                   |     —      |      —      |    —    |
| i18n                       |          2 languages, working examples           |     —      |      —      |    —    |
| Auth example               |          login + session + route guards          |     —      |      —      |    —    |
| Form validation            |            Conform + Zod + components            |     —      |      —      |    —    |
| Storybook                  |         Router + i18n + dark mode + MSW          |     —      |      —      |    —    |
| Dark mode                  | end-to-end (context + session + CSS + Storybook) |     —      |      —      |    —    |
| API mocking (MSW)          |                tests + Storybook                 |     —      |      —      |    —    |
| Claude Code integration    |             commands, skills, rules              |     —      |      —      |    —    |
| LLM knowledge base         |            committed wiki + Obsidian             |     —      |      —      |    —    |
| Documentation site         |           VitePress + GH Pages deploy            |     —      |      —      |    —    |

## Installation

Make sure you have [Node.js](https://nodejs.org/en/) >=22.19.0 LTS installed, preferably via [nvm](https://github.com/nvm-sh/nvm).

All you need to do is run this installation command and get to work.

```sh
npx create-react-router@latest --template gaia-react/react-router
```

### Install packages

```sh
npm install
```

If you're using [Claude Code](https://code.claude.com/docs/en/overview), you can run the `/gaia-init` command once you're ready (see below)

If not, duplicate the `.env.example` file and name it `.env`, and you can optionally delete the `.claude` folder.

### Setup Fix on Save in your IDE

Follow these [instructions](https://gaia-react.github.io/react-router/tech-stack/code-quality/#setup-fix-on-save).

## Documentation

GAIA comes with the documentation included. Run it locally with:

```sh
npm run docs
```

It is recommended that you keep these docs up to date as you build your project. There is also a GitHub action to deploy the docs to your repository's GitHub Pages.

Claude knows how to reference the documentation when necessary.

## Claude

GAIA comes with [Claude Code](https://claude.ai/) support built-in: commands, rules, and a quality gate that work out of the box.

### Commands

| Command            | What it does                                                            |
| ------------------ | ----------------------------------------------------------------------- |
| `/gaia-init`       | Remove example code, configure languages, set up a clean slate          |
| `/new-route`       | Scaffold a route with page component, test, story, and i18n keys        |
| `/new-component`   | Scaffold a component with optional test and story                       |
| `/new-service`     | Scaffold an API service with requests, Zod schemas, URLs, and MSW mocks |
| `/new-hook`        | Scaffold a custom hook with test file                                   |
| `/audit-code`      | Run the full quality gate (typecheck, lint, test, E2E, build)           |
| `/audit-knowledge` | Audit memory, wiki, and auto-loaded files for duplication and bloat     |
| `/migrate`         | Upgrade a package to latest, apply breaking changes, run quality gate   |
| `/handoff`         | Save a session handoff doc so the next session can resume cold          |
| `/pickup`          | Resume from the latest handoff — reports state, drift, and next action  |

### Rules

Claude automatically follows project rules for coding guidelines, component testing patterns, ESLint fixes, i18n conventions, accessibility, API services, route creation, and the quality gate. These rules are in `.claude/rules/` and activate based on file paths.

Once you're familiar with the GAIA framework, open Claude and run the `/gaia-init` command. This will remove the example code and give you a clean slate for your project.

> **Note:** Don't run the built-in `/init` on a fresh GAIA checkout — it would overwrite the curated `CLAUDE.md`. A `UserPromptSubmit` hook (`.claude/hooks/intercept-init.sh`) intercepts `/init` and redirects to `/gaia-init`. Both the hook and its settings entry are removed automatically when `/gaia-init` finishes, so your project is free to use `/init` normally afterward.

### Wiki

GAIA ships with a `wiki/` knowledge base — architecture, modules, dependencies, decisions, flows, and concepts — committed to git and shared across the team. It is structured for LLM consumption: small focused pages, wikilinks, frontmatter, and a `wiki/index.md` catalog so Claude fetches only what it needs.

- **No token bloat.** Claude reads `wiki/hot.md` (~200-word recent context) at session start and pulls specific pages on demand instead of preloading the whole codebase.
- **Survives across sessions and developers.** Unlike machine-local memory, the wiki is in git — every contributor gets the same context.
- **Editable in Obsidian.** Pages are standard markdown with wikilinks; open `wiki/` as an [Obsidian](https://obsidian.md) vault for graph view, backlinks, and search.

The [`claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian) plugin is installed automatically by `/gaia-init` and adds Claude skills for ingesting sources, querying, linting, and saving conversations into the vault.

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

[Playwright](https://playwright.dev/docs/intro)

```sh
npx playwright test
```

Interactive mode:

```sh
npx playwright test --ui
```

## Deployment

GAIA comes with the default React Router deployment configuration. You can change this to whatever deployment process you prefer.

Here's the basic React Router deployment process:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

You'll need to pick a host to deploy it to. Jacob Paris wrote an [article](https://www.jacobparis.com/content/where-to-host-remix) on where you can host your React Router 7 app.

### DIY

If you're familiar with deploying Node applications, the built-in React Router app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## History

The GAIA Flash Framework revolutionized Flash website development and became the most popular Flash framework in the world (second only to Adobe Flex, which was focused on enterprise applications). It was used to build over 100,000 Flash sites and relied upon by every major digital agency worldwide.

GAIA React is its spiritual successor, reborn as a React template. Like its predecessor, it's designed to be the most thorough and easy-to-use starting point available for building professional-grade frontend applications.
