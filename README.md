# GAIA React

<img src="./app/assets/images/gaia-logo.svg" height="100" alt="GAIA"/>

**The Claude-native React Router template.** Scaffolding commands, auto-loaded rules, enforcement hooks, a code-review agent, and a committed LLM knowledge base — your AI collaborator is a first-class citizen of the codebase, not a tool glued on top of it.

The full traditional stack — 20+ ESLint plugins, Prettier, Vitest, Playwright, Chromatic, Storybook, i18n, auth, Conform + Zod forms, dark mode, MSW, React Router 7 — is the foundation it's built on. You get both, and they're designed together.

## Why Claude-native?

Most templates treat AI as an afterthought: drop a `CLAUDE.md` in the root and hope the model figures out the rest. GAIA is different. Every convention the template enforces is also a rule Claude auto-loads. Every scaffolding script is also a slash command. Every code review runs a dedicated agent. Every piece of project knowledge lives in a committed wiki that Claude fetches on demand instead of hauling a giant `CLAUDE.md` into every request.

**GAIA prevents technical debt in your code — and in your Claude prompts.** The wiki and `/audit-knowledge` keep context lean, so Claude's effective attention isn't burned on stale memory and bloated auto-loaders. You spend fewer tokens per request and get sharper answers. Claude writes code that matches your patterns on day one, and stops writing the wrong thing before you have to review it.

## What Claude Gets

- **4 scaffolding commands** — `/new-route`, `/new-component`, `/new-hook`, `/new-service` match your project conventions out of the box
- **6 project commands** — `/audit-code` (quality gate), `/audit-knowledge` (prompt-debt sweep), `/migrate` (package upgrades), `/handoff` + `/pickup` (session continuity), `/gaia-init` (template init)
- **11 path-scoped rules** — accessibility, API services, coding guidelines, component testing, ESLint fixes, i18n, route creation, PR merge workflow, quality gate, test runner, wiki maintenance; auto-loaded based on what Claude is editing
- **4 pre-tool hooks** — block ESLint config edits, block vitest globals in `tsconfig.json`, advise on missing i18n strings, advise on missing Storybook stories
- **Code-review-audit agent** — required before every PR merge via the `pr-merge-workflow` rule
- **LLM knowledge base (wiki)** — architecture, modules, dependencies, decisions, flows. Claude reads a ~200-word cache at session start and fetches specific pages on demand. Replaces bloated `CLAUDE.md` sprawl and keeps per-request token costs down.
- **Obsidian integration** — the [`claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian) plugin adds skills for ingesting sources, querying, linting, auto-research loops, and saving conversations directly into the vault
- **4 bundled project skills** — `react-code`, `typescript`, `tailwind`, `skeleton-loaders`

## What You Get (Foundation)

The traditional tooling Claude rides on top of:

- **20+ ESLint plugins** pre-configured with [Prettier](https://prettier.io/) and [Stylelint](https://stylelint.io/) for consistent code from the first commit
- **Pre-commit hooks** ([Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)) that typecheck, lint, and test before code reaches CI
- **Unit, integration, E2E, and visual regression testing** with [Vitest](https://vitest.dev), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [Playwright](https://playwright.dev/docs/intro), and [Chromatic](https://chromatic.com/), all sharing a common mocking layer
- **i18n in 2 languages** via [remix-i18next](https://github.com/sergiodxa/remix-i18next) with working examples, not just the package installed
- **Auth flow** with login, session management, and route guards via [remix-auth](https://remix.run/resources/remix-auth)
- **Form components with validation** using [Conform](https://conform.guide/) + [Zod](https://zod.dev/)
- **Dark mode end-to-end**: context, session, CSS, and Storybook all in sync
- **[Storybook](https://storybook.js.org/) with React Router support**, including i18n, dark mode, and [MSW](https://mswjs.io/) integration
- **API mocking** with [Mock Service Worker](https://mswjs.io/) and [msw/data](https://github.com/mswjs/data), with working handlers for tests and Storybook
- **Toast notifications** with [remix-toast](https://remix.run/resources/remix-toast) and [Sonner](https://sonner.emilkowal.ski/)
- Built on [React Router 7](https://reactrouter.com/), [TailwindCSS](https://tailwindcss.com/), and [FontAwesome](https://fontawesome.com/) icons

## How GAIA Compares

| Feature                       |                       GAIA                       | Vite React | RR Template | Next.js |
| ----------------------------- | :----------------------------------------------: | :--------: | :---------: | :-----: |
| **Claude Integration**        |                                                  |            |             |         |
| Scaffolding Commands          |                        4                         |     ❌     |     ❌      |   ❌    |
| Project Commands              |                        6                         |     ❌     |     ❌      |   ❌    |
| Auto-Loaded Project Rules     |                        11                        |     ❌     |     ❌      |   ❌    |
| Pre-Tool Enforcement Hooks    |                   4 (2 Block)                    |     ❌     |     ❌      |   ❌    |
| Bundled Project Skills        |                        4                         |     ❌     |     ❌      |   ❌    |
| Code-Review Agent (Pre-Merge) |                        ✅                        |     ❌     |     ❌      |   ❌    |
| Obsidian Vault Integration    |                        ✅                        |     ❌     |     ❌      |   ❌    |
| **Traditional Tooling**       |                                                  |            |             |         |
| ESLint                        |                   20+ Plugins                    |   Basic    |    Basic    |  Basic  |
| Prettier + Stylelint          |                  Pre-Configured                  |     ❌     |     ❌      |   ❌    |
| Pre-Commit Hooks              |             Typecheck + Lint + Test              |     ❌     |     ❌      |   ❌    |
| Unit + Integration Testing    |                   Vitest + RTL                   |     ❌     |     ❌      |   ❌    |
| E2E Testing                   |                    Playwright                    |     ❌     |     ❌      |   ❌    |
| Visual Regression Testing     |                   Chromatic CI                   |     ❌     |     ❌      |   ❌    |
| i18n                          |          2 Languages, Working Examples           |     ❌     |     ❌      |   ❌    |
| Auth Example                  |          Login + Session + Route Guards          |     ❌     |     ❌      |   ❌    |
| Form Validation               |            Conform + Zod + Components            |     ❌     |     ❌      |   ❌    |
| Storybook                     |         Router + i18n + Dark Mode + MSW          |     ❌     |     ❌      |   ❌    |
| Dark Mode                     | End-to-End (Context + Session + CSS + Storybook) |     ❌     |     ❌      |   ❌    |
| API Mocking (MSW)             |                Tests + Storybook                 |     ❌     |     ❌      |   ❌    |

## Philosophy

GAIA is a **Claude-native base template**, not a full-stack kit or a component library. It sets up everything Claude needs to write your app correctly and leaves the product-layer choices to you.

- Configuring 20+ linting rules, four layers of testing, i18n, auth, CI — **and** the full Claude toolchain (commands, rules, hooks, agents, wiki, plugins) — correctly takes days. GAIA solves that once.
- **Every tool is pre-configured but removable.** Don't need i18n? Remove it. Prefer a different icon set? Swap it. Nothing is locked in — including the Claude layer.
- Pre-commit hooks run typechecking, linting, and tests. Pre-tool hooks catch Claude mistakes before they reach disk. The quality gate catches issues before they compound.
- Best practices are baked into working examples you can follow and modify — and into rules Claude loads automatically.

## Installation

Make sure you have [Node.js](https://nodejs.org/en/) >=22.19.0 LTS installed, preferably via [nvm](https://github.com/nvm-sh/nvm).

All you need to do is run this installation command and get to work:

```sh
npx create-react-router@latest --template gaia-react/react-router
```

### Install packages

```sh
npm install
```

### Setup Fix on Save in your IDE

Follow these [instructions](https://gaia-react.github.io/react-router/tech-stack/code-quality/#setup-fix-on-save).

### Initialize the template

If you're using [Claude Code](https://code.claude.com/docs/en/overview), run `/gaia-init` (or just `/init` — it's intercepted and redirected). See [`/gaia-init`](#gaia-init--one-command-initialization) below for the full scope.

If you're not using Claude, duplicate `.env.example` to `.env`, then delete `.claude/`, `wiki/`, and any other Claude-specific artifacts you won't need.

## `/gaia-init` — one-command initialization

Running `/gaia-init` (or `/init` — they're interchangeable) initializes the template end-to-end in one command:

- **Strips example code** — `things` service, `ExampleConsumer`/`ExampleProvider`, IndexPage examples + TechStack, GAIA branding assets
- **Configures i18n** — prompts for your language set (English, Japanese, French, Spanish, German, or a custom list), scaffolds matching language files, updates `LanguageSelect` and Storybook globals
- **Sets project metadata** — `package.json` name, `CLAUDE.md` title, `CODEOWNERS`
- **Installs Claude skills** — [React Doctor](https://github.com/millionco/react-doctor), [Matt Pocock's TDD](https://www.aihero.dev/skill-test-driven-development-claude-code), [Playwright CLI](https://github.com/microsoft/playwright-cli)
- **Installs Claude plugins** — `typescript-lsp` (from the official Claude Plugins marketplace) and [`claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian)
- **Syncs the wiki** to the new project state (removes references to deleted example code)
- **Verifies** via the quality gate: `typecheck && test:ci && lint && build`

After `/gaia-init` finishes, you have a clean app shell **and** a fully-configured Claude workflow ready to use.

> **Why both `/init` and `/gaia-init` work:** the built-in `/init` would normally overwrite the curated `CLAUDE.md`. A `UserPromptSubmit` hook (`.claude/hooks/intercept-init.sh`) intercepts it and auto-invokes `/gaia-init` instead. The hook and its settings entry are removed automatically when `/gaia-init` finishes, so `/init` returns to its default behavior afterward.

## Claude Workflow

GAIA ships a complete, opinionated Claude Code workflow. Everything is wired in `.claude/` and visible in the repo.

### Commands

| Command            | What it does                                                            |
| ------------------ | ----------------------------------------------------------------------- |
| `/gaia-init`       | Full template initialization (see above)                                |
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

Claude follows project rules automatically based on file paths. Rules live in `.claude/rules/` and activate when Claude edits matching files.

| Rule                   | Enforces                                                                  |
| ---------------------- | ------------------------------------------------------------------------- |
| `accessibility`        | Keyboard nav, alt text, ARIA, focus management (scope: `app/components/`) |
| `api-service`          | Request / schema / mock patterns (scope: `app/services/`)                 |
| `coding-guidelines`    | Simplicity, surgical edits, TDD (scope: `app/`)                           |
| `component-testing`    | `composeStory` pattern for component tests                                |
| `eslint-fixes`         | Fix ESLint errors in source, not in the ESLint config                     |
| `i18n`                 | `t()` from `useTranslation()` for all user-facing strings                 |
| `new-route`            | Thin routes, page component conventions, route groups                     |
| `pr-merge-workflow`    | Run the code-review-audit agent before merging                            |
| `quality-gate`         | Run `/audit-code` and fix all issues before every commit                  |
| `test-runner`          | `npm run test -- --run` in CI; never bare `npm test`                      |
| `wiki-maintenance`     | Before commit, update the wiki if the change introduces new knowledge     |

### Hooks

Claude Code hooks let the template catch mistakes before they reach disk. GAIA ships seven:

| Hook                                 | Event            | What it does                                                            |
| ------------------------------------ | ---------------- | ----------------------------------------------------------------------- |
| `intercept-init.sh`                  | UserPromptSubmit | Blocks built-in `/init`, auto-invokes `/gaia-init`                      |
| `block-eslint-config-edit.sh`        | PreToolUse       | Blocks edits to `eslint.config.mjs`                                     |
| `block-vitest-globals-tsconfig.sh`   | PreToolUse       | Blocks adding `vitest/globals` to `tsconfig.json`                       |
| `check-i18n-strings.sh`              | PreToolUse       | Advisory: ensure user-facing strings use `t()`                          |
| `check-story-exists.sh`              | PreToolUse       | Advisory: remind to add a Storybook story for components                |
| `wiki-session-start.sh`              | SessionStart     | Records session-start HEAD so wiki commits can be detected at Stop time |
| `wiki-session-stop.sh`               | Stop             | Prompts a `wiki/hot.md` refresh when wiki commits happened this session |

### Code review before merge

The `pr-merge-workflow` rule makes the `code-review-audit` agent a required step before `gh pr merge`. The agent reviews the branch diff for security vulnerabilities, performance issues, code smells, and anti-patterns — and the workflow blocks the merge until reported issues are fixed and committed.

### Wiki

GAIA ships with a `wiki/` knowledge base — architecture, modules, dependencies, decisions, flows, concepts, components — committed to git and shared across the team. It's structured for LLM consumption: small focused pages, wikilinks, frontmatter, and a `wiki/index.md` catalog so Claude fetches only what it needs.

- **No token bloat.** Claude reads `wiki/hot.md` (~200-word recent context) at session start and pulls specific pages on demand instead of preloading the whole codebase.
- **Survives across sessions and developers.** Unlike machine-local memory, the wiki is in git — every contributor gets the same context.
- **Editable in Obsidian.** Pages are standard markdown with wikilinks; open `wiki/` as an [Obsidian](https://obsidian.md) vault for graph view, backlinks, and search.

The [`claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian) plugin is installed automatically by `/gaia-init` and adds Claude skills for ingesting sources (`/wiki-ingest`), querying (`/wiki-query`), linting (`/wiki-lint`), auto-research loops (`/autoresearch`), and saving conversations into the vault (`/save`).

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
