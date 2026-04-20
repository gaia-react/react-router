# GAIA React

<img src="./app/assets/images/gaia-logo.svg" height="100" alt="GAIA"/>

**Claude as your lead engineer.** GAIA is the React Router template that makes Claude trustworthy enough to own features end-to-end, token-efficient enough to do it at scale, and grounded enough in the stack to answer how-do-I questions without re-reading the codebase.

Built on React Router 7, Tailwind v4, Vitest, Playwright, Chromatic, Storybook, i18n, Conform + Zod forms, dark mode, MSW, and 20+ ESLint plugins. Every piece is pre-configured *and* documented for Claude in a way that keeps per-request costs down and output quality up.

## The two problems GAIA solves

Most templates treat Claude as a tool you hold — bolt a `CLAUDE.md` onto the root and hope the model figures out the rest. GAIA treats Claude as an engineer you *manage*. That shift exposes two failure modes the bolt-on approach papers over.

**Trust.** You can't manage an engineer you can't predict. Without enforceable conventions, Claude reverts to its training distribution — which isn't your codebase. GAIA embeds project conventions as auto-loaded rules, pre-tool hooks that block mistakes at disk, a required code-review agent before every merge, and a quality gate before every commit. Claude writes code that matches your patterns on day one, and can't ship code that doesn't.

**Token economics.** Every extra kilobyte in `CLAUDE.md` is paid on every turn. Teams hit this wall fast: as the project grows, the manual you stuff into context grows with it, and the model's effective attention shrinks. GAIA replaces preloaded manuals with path-scoped rules and a fetch-on-demand wiki. Claude loads the accessibility rule only when editing components; the `Routing.md` wiki page only when it needs to. Session context stays lean, your Claude bill stays low, and answers stay sharp.

## How GAIA makes Claude trustworthy

- **15 path-scoped rules** — architecture conventions (state, API services, routes), quality invariants (accessibility, i18n, test-runner, PR workflow), and tooling prescriptions (Tailwind, Storybook, Playwright, component testing). Claude auto-loads only the rules that match the files it's touching.
- **7 enforcement hooks** — block edits to `eslint.config.mjs`, block `vitest/globals` in `tsconfig.json`, advise on missing i18n keys, advise on missing Storybook stories, intercept `/init` to protect the curated `CLAUDE.md`, plus two wiki-housekeeping hooks that keep the hot cache honest.
- **Code-review-audit agent + React Doctor** — a dedicated Claude subagent reviews the branch diff for security, performance, code smells, and anti-patterns, then invokes [React Doctor](https://github.com/millionco/react-doctor) (`npx -y react-doctor@latest . --verbose --diff`) to catch React-specific issues across 47+ rules: unnecessary re-renders, component complexity, dangerous patterns, dead code. The `pr-merge-workflow` rule makes the whole pass a required step before `gh pr merge` — no exceptions, no "small PR" override. React Doctor also auto-runs after code edits during normal development, giving Claude a continuous quality signal, not just a gate.
- **TDD skill** — red-green-refactor discipline wired to GAIA's four testing layers (hook / component / service / E2E). Based on [Matt Pocock's TDD skill](https://www.aihero.dev/skill-test-driven-development-claude-code), tailored for Vitest, React Testing Library, Storybook `composeStory`, and MSW. Claude writes one test at a time, reaches GREEN, then refactors — not "write five tests then batch-implement".
- **Quality gate before commit** — `/audit-code` runs typecheck, lint, tests, and build; the `quality-gate` rule blocks the commit until every warning is resolved. Not "mostly clean" — actually clean.
- **Scaffolding commands that match conventions** — `/new-route`, `/new-component`, `/new-hook`, `/new-service` emit code that already passes every rule, so Claude starts from a conforming baseline instead of retrofitting.

## How GAIA keeps Claude token-efficient

- **Wiki, not `CLAUDE.md` sprawl** — architecture, modules, dependencies, decisions, and flows live in `wiki/` as focused, linked markdown pages. Ask Claude "how do I add a new route?", "how does dark mode wire through?", or "what's the testing layer setup?" — it pulls the specific wiki page, not the whole manual. A ~200-word `hot.md` cache loads at session start; everything else is fetched on demand. You're not paying for the whole manual on every turn.
- **Path-scoped rules** — the `accessibility` rule only loads when Claude edits `app/components/`. The `api-service` rule only loads inside `app/services/`. Rules are surgical; context stays under control.
- **`playwright-cli` for E2E work** — the [Playwright CLI](https://github.com/microsoft/playwright-cli) lets Claude drive a real browser through a single shell call per interaction (`playwright-cli click e3`, `playwright-cli snapshot`), instead of a persistent MCP session round-tripping snapshots and screenshots. Debugging a failing spec or authoring a new one costs a handful of tool invocations, not dozens. The `playwright` rule enforces semantic selectors, web-first assertions, and the SSR hydration barrier — Claude writes specs Claude can run, automatically.
- **`/audit-knowledge`** — a periodic sweep that finds duplication and bloat across memory, wiki, and auto-loaded files. When project knowledge drifts, you clean it up instead of letting prompt debt compound.
- **`/handoff` + `/pickup`** — session boundaries are expensive. A handoff captures state, decisions, and open threads in a structured doc; pickup reads it and resumes cold with the right mental model in a few tool calls instead of dozens.
- **`claude-obsidian` for vault ops** — `/wiki-ingest`, `/wiki-query`, `/wiki-lint`, `/autoresearch`, `/save`. Each runs as a focused skill that pulls only what it needs.

## What Claude rides on (the foundation)

GAIA bundles the traditional stack Claude's output rests on. Every piece is pre-configured and wired into the Claude layer.

- **20+ ESLint plugins** with [Prettier](https://prettier.io/) and [Stylelint](https://stylelint.io/) for consistent code from the first commit
- **Pre-commit hooks** ([Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)) — typecheck, lint, and test before CI
- **Four testing layers sharing one mock layer** — [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit/integration, [Playwright](https://playwright.dev/docs/intro) for E2E, [Chromatic](https://chromatic.com/) for visual regression
- **i18n in 2 languages** via [remix-i18next](https://github.com/sergiodxa/remix-i18next) with working examples — `/gaia-init` prompts for your set
- **Form components with validation** using [Conform](https://conform.guide/) + [Zod](https://zod.dev/)
- **Dark mode end-to-end** — context, session, CSS, and Storybook all in sync
- **[Storybook](https://storybook.js.org/)** with React Router + i18n + dark mode + [MSW](https://mswjs.io/) integration
- **API mocking** with [Mock Service Worker](https://mswjs.io/) and [msw/data](https://github.com/mswjs/data), working handlers for tests and Storybook
- **Toast notifications** with [remix-toast](https://remix.run/resources/remix-toast) and [Sonner](https://sonner.emilkowal.ski/)
- Built on [React Router 7](https://reactrouter.com/), [Tailwind v4](https://tailwindcss.com/), and [FontAwesome](https://fontawesome.com/) icons

## How GAIA Compares

| Feature                       |                       GAIA                       | Vite React | RR Template | Next.js |
| ----------------------------- | :----------------------------------------------: | :--------: | :---------: | :-----: |
| **Claude Integration**        |                                                  |            |             |         |
| Scaffolding Commands          |                        4                         |     ❌     |     ❌      |   ❌    |
| Project Commands              |                        7                         |     ❌     |     ❌      |   ❌    |
| Auto-Loaded Project Rules     |                        15                        |     ❌     |     ❌      |   ❌    |
| Enforcement Hooks             |                   7 (2 Block)                    |     ❌     |     ❌      |   ❌    |
| Bundled Project Skills        |                        6                         |     ❌     |     ❌      |   ❌    |
| Code-Review Agent (Pre-Merge) |                        ✅                        |     ❌     |     ❌      |   ❌    |
| Committed LLM Wiki            |                        ✅                        |     ❌     |     ❌      |   ❌    |
| Obsidian Vault Integration    |                        ✅                        |     ❌     |     ❌      |   ❌    |
| **Traditional Tooling**       |                                                  |            |             |         |
| ESLint                        |                   20+ Plugins                    |   Basic    |    Basic    |  Basic  |
| Prettier + Stylelint          |                  Pre-Configured                  |     ❌     |     ❌      |   ❌    |
| Pre-Commit Hooks              |             Typecheck + Lint + Test              |     ❌     |     ❌      |   ❌    |
| Unit + Integration Testing    |                   Vitest + RTL                   |     ❌     |     ❌      |   ❌    |
| E2E Testing                   |                    Playwright                    |     ❌     |     ❌      |   ❌    |
| Visual Regression Testing     |                   Chromatic CI                   |     ❌     |     ❌      |   ❌    |
| i18n                          |          2 Languages, Working Examples           |     ❌     |     ❌      |   ❌    |
| Form Validation               |            Conform + Zod + Components            |     ❌     |     ❌      |   ❌    |
| Storybook                     |         Router + i18n + Dark Mode + MSW          |     ❌     |     ❌      |   ❌    |
| Dark Mode                     | End-to-End (Context + Session + CSS + Storybook) |     ❌     |     ❌      |   ❌    |
| API Mocking (MSW)             |                Tests + Storybook                 |     ❌     |     ❌      |   ❌    |

## Philosophy

GAIA is a **Claude-native base template**, not a full-stack kit or a component library. It sets up everything Claude needs to write your app correctly and leaves the product-layer choices to you.

- Configuring 20+ linting rules, four layers of testing, i18n, CI — **and** the full Claude toolchain (commands, rules, hooks, agents, wiki, plugins) — correctly takes days. GAIA solves that once.
- **Every tool is pre-configured but removable — ask Claude to swap it.** Don't need i18n? Tell Claude to rip it out. Prefer a different icon set? Ask Claude to swap it in. Because Claude understands how the pieces are wired together, removals and substitutions stay coherent instead of leaving orphaned imports and stale rules. Nothing is locked in — including the Claude layer.
- Pre-commit hooks run typechecking, linting, and tests. Pre-tool hooks catch Claude mistakes before they reach disk. The quality gate catches issues before they compound.
- Best practices are baked into working patterns documented in the wiki — and into rules Claude loads automatically.

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

### Initialize the template

If you're using [Claude Code](https://code.claude.com/docs/en/overview), run `/gaia-init` (or just `/init` — it's intercepted and redirected). See [`/gaia-init`](#gaia-init--one-command-initialization) below for the full scope.

If you're not using Claude, duplicate `.env.example` to `.env`, then delete `.claude/`, `wiki/`, and any other Claude-specific artifacts you won't need.

## `/gaia-init` — one-command initialization

The template ships clean — no example code, no docs site, no auth. `/gaia-init` (or `/init` — they're interchangeable) finishes the last-mile setup:

- **Strips GAIA branding** — FUNDING.yml, GAIA logo, Storybook BRAND config
- **Configures i18n** — prompts for your language set (English, Japanese, French, Spanish, German, or a custom list), scaffolds matching language files, updates `LanguageSelect` and Storybook globals
- **Sets project metadata** — `package.json` name, `CLAUDE.md` title, `CODEOWNERS`, and localized site titles
- **Installs Claude skills** — [React Doctor](https://github.com/millionco/react-doctor), [Matt Pocock's TDD](https://www.aihero.dev/skill-test-driven-development-claude-code), [Playwright CLI](https://github.com/microsoft/playwright-cli)
- **Installs Claude plugins** — `typescript-lsp` (from the official Claude Plugins marketplace) and [`claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian)
- **Offers Chromatic MCP setup** — runs `/setup-chromatic-mcp` if you opt in; otherwise you can run it any time later
- **Initializes the wiki** — refreshes `wiki/hot.md` and appends an init entry to `wiki/log.md`
- **Verifies** via the quality gate: `typecheck && test:ci && lint && build`

After `/gaia-init` finishes, you have a clean app shell **and** a fully-configured Claude workflow ready to use.

> **Why both `/init` and `/gaia-init` work:** the built-in `/init` would normally overwrite the curated `CLAUDE.md`. A `UserPromptSubmit` hook (`.claude/hooks/intercept-init.sh`) intercepts it and auto-invokes `/gaia-init` instead. The hook and its settings entry are removed automatically when `/gaia-init` finishes, so `/init` returns to its default behavior afterward.

## Claude Workflow

GAIA ships a complete, opinionated Claude Code workflow. Everything is wired in `.claude/` and visible in the repo.

### Commands

| Command                  | What it does                                                            |
| ------------------------ | ----------------------------------------------------------------------- |
| `/gaia-init`             | Full template initialization (see above)                                |
| `/new-route`             | Scaffold a route with page component, test, story, and i18n keys        |
| `/new-component`         | Scaffold a component with optional test and story                       |
| `/new-service`           | Scaffold an API service with requests, Zod schemas, URLs, and MSW mocks |
| `/new-hook`              | Scaffold a custom hook with test file                                   |
| `/audit-code`            | Run the full quality gate (typecheck, lint, test, E2E, build)           |
| `/audit-knowledge`       | Audit memory, wiki, and auto-loaded files for duplication and bloat     |
| `/migrate`               | Upgrade a package to latest, apply breaking changes, run quality gate   |
| `/handoff`               | Save a session handoff doc so the next session can resume cold          |
| `/pickup`                | Resume from the latest handoff — reports state, drift, and next action  |
| `/setup-chromatic-mcp`   | Idempotent install of `@storybook/addon-mcp` + Chromatic MCP server     |

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
| `playwright`           | E2E selectors, hydration barrier, MSW integration, parallelism            |
| `pr-merge-workflow`    | Run the code-review-audit agent before merging                            |
| `quality-gate`         | Run `/audit-code` and fix all issues before every commit                  |
| `state-pattern`        | Context shape, Provider/hook naming, `useX` vs `useMaybeX`                |
| `storybook`            | File location, meta typing, decorator order, variant naming               |
| `tailwind`             | `twJoin`/`twMerge`, dark-mode tokens, variant lookup tables               |
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

### Chromatic MCP

Storybook 10.3+ ships support for `@storybook/addon-mcp`, which pairs with the [Chromatic MCP](https://www.chromatic.com/docs/mcp/) server to let Claude query components, props, and visual-regression diffs directly. `/gaia-init` offers to set it up; otherwise run `/setup-chromatic-mcp` any time — it's idempotent and handles both first-time install and per-machine re-registration for new contributors.

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

This template uses [Tailwind v4](https://tailwindcss.com/) with the class-strategy dark mode, semantic `@utility` tokens, and `tailwind-merge` as the canonical helper. Configuration lives in `app/styles/tailwind.css` under `@theme` / `@layer` / `@utility` — there is no `tailwind.config.ts`. See `.claude/rules/tailwind.md` for conventions.

### Icons

[FontAwesome](https://fontawesome.com/) is included. Ask Claude to swap it for Heroicons, Lucide, or any other icon set — Claude will update imports and icon usages across the app.

### i18n

[Remix-i18next](https://github.com/sergiodxa/remix-i18next) is configured with examples. Storybook is already wired with react-i18n support.

## Testing

GAIA comes with a full testing suite already configured.

### Unit and Integration

- [vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

```sh
npm run test            # watch mode
npm run test -- --run   # CI-style single run
```

### Visual Regression

[Chromatic](https://chromatic.com)

You'll need to set your `CHROMATIC_PROJECT_TOKEN` env variable on your CI.

### E2E

[Playwright](https://playwright.dev/docs/intro)

```sh
npm run pw       # headless
npm run pw-ui    # interactive
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
