# GAIA React

<img src="./app/assets/images/gaia-logo.svg" height="100" alt="GAIA"/>

[![Claude](https://img.shields.io/badge/Claude-D97757?logo=claude&logoColor=fff)](https://claude.com/claude-code)
[![Tests](https://img.shields.io/github/actions/workflow/status/gaia-react/react-router/tests.yml?event=pull_request&label=tests)](https://github.com/gaia-react/react-router/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/github/license/gaia-react/react-router)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.19.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Claude as your lead engineer.** GAIA is the React Router template that makes Claude trustworthy enough to own features end-to-end, token-efficient enough to do it at scale, and grounded enough in the stack to answer how-do-I questions without re-reading the codebase.

Built on React Router 7, Tailwind v4, Vitest, Playwright, Chromatic, Storybook, i18n, Conform + Zod forms, dark mode, MSW, and 20+ ESLint plugins. Every piece is pre-configured *and* documented for Claude in a way that keeps per-request costs down and output quality up.

## Quick Start

Make sure you have [Node.js](https://nodejs.org/en/) >= 22.19.0 LTS installed, preferably via [nvm](https://github.com/nvm-sh/nvm).

```bash
npx create-react-router@latest --template gaia-react/react-router
```

Open Claude Code in the project and type `/init`.

## The two problems GAIA solves

Most templates treat Claude as a tool you hold — bolt a `CLAUDE.md` onto the root and hope the model figures out the rest. GAIA treats Claude as an engineer you *manage*. That shift exposes two failure modes the bolt-on approach papers over.

### Trust

You can't manage an engineer you can't predict. Without enforceable conventions, Claude reverts to its training distribution — an average of every codebase on the internet, bad code and all. GAIA's codebase is what you actually want Claude matching. With GAIA, Claude writes code that follows best practices on day one — and can't ship code that doesn't.

### Token economics

Context bloat isn't just `CLAUDE.md` sprawl. Instructions get dropped into global memory, forgotten, and accumulate into redundancies and conflicts — an invisible cost that compounds every session. GAIA keeps token usage minimal by design.

## How GAIA makes Claude trustworthy

- **Best practices are baked in, not pattern-matched.** Rules encode the conventions directly instead of hoping Claude infers them from whatever's already in the repo.
- **Guardrails against technical debt.** Rules block debt-accumulating patterns from being written in the first place — untyped exports, untested components, hardcoded strings, a11y gaps.
- **Test-driven development** via the bundled `tdd` skill. Red-green-refactor loop, tests before code — tailored for Vitest, React Testing Library, Storybook `composeStory`, and MSW.
- **Code-review audit before every merge.** A Claude subagent scans the branch diff for security, performance, code smells, and anti-patterns — and blocks the merge until the issues are fixed and committed.
- **Quality gate before commit** — typecheck, lint, tests, and build must all pass. Not "mostly clean" — actually clean.

## How GAIA keeps Claude token-efficient

- **Rules are scoped to activate only when needed.** Claude loads the ones that match what it's editing — nothing else.
- **[Obsidian](https://obsidian.md) wiki, fetched on demand.** Project knowledge lives as focused, linked markdown pages. Claude opens the one page it needs — *"How does dark mode wire through?"* — instead of preloading the whole manual.
- **Wiki behavior tailored to GAIA.** Session hooks keep Obsidian's workflow (ingest cadence, cache discipline, link hygiene) aligned with the project's conventions.
- **Periodic knowledge audit** sweeps memory, wiki, and auto-loaded files for duplication, conflicts, and stale instructions before they start costing tokens.
- **Session continuity.** `/handoff` + `/pickup` replace re-briefing Claude from scratch at every session start.

## What Claude rides on (the foundation)

GAIA bundles the traditional stack Claude's output rests on. Every piece is pre-configured and wired into the Claude layer.

- **20+ ESLint plugins** with [Prettier](https://prettier.io/) and [Stylelint](https://stylelint.io/) for consistent code from the first commit
- **Pre-commit hooks** ([Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)) — typecheck, lint, and test before CI
- **Four testing layers sharing one mock layer** — [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit/integration, [Playwright](https://playwright.dev/docs/intro) for E2E, [Chromatic](https://chromatic.com/) for visual regression
- **i18n in 2 languages** via [remix-i18next](https://github.com/sergiodxa/remix-i18next) with working examples
- **Form components with validation** using [Conform](https://conform.guide/) + [Zod](https://zod.dev/)
- **Dark mode end-to-end** — context, session, CSS, and Storybook all in sync
- **[Storybook](https://storybook.js.org/)** with React Router + i18n + dark mode + [MSW](https://mswjs.io/) integration
- **API mocking** with [Mock Service Worker](https://mswjs.io/) and [msw/data](https://github.com/mswjs/data), working handlers for tests and Storybook
- **Toast notifications** with [remix-toast](https://remix.run/resources/remix-toast) and [Sonner](https://sonner.emilkowal.ski/)
- Built on [React Router 7](https://reactrouter.com/), [Tailwind v4](https://tailwindcss.com/), and [FontAwesome](https://fontawesome.com/) icons

## How GAIA Compares

Opinionated starter templates solve different slices of the "day-zero engineering setup" problem. GAIA focuses on making Claude a first-class collaborator; the alternatives don't.

### Foundation

|                          |         GAIA          |   Epic Stack   |     RedwoodJS     | create-t3-app |
| ------------------------ | :-------------------: | :------------: | :---------------: | :-----------: |
| TypeScript               |          ✅           |       ✅       |        ✅         |      ✅       |
| Routing                  |    React Router 7     | React Router 7 | @redwoodjs/router |    Next.js    |
| Tailwind                 |          ✅           |       ✅       |        ❌         |      ✅       |
| Dark mode                |          ✅           |       ❌       |        ❌         |      ❌       |
| i18n                     |          ✅           |       ❌       |        ❌         |      ❌       |
| Unit / integration tests |        Vitest         |     Vitest     |       Jest        |      ❌       |
| Component testing        | Storybook + Chromatic |       ❌       |     Storybook     |      ❌       |
| E2E tests                |      Playwright       |   Playwright   |        ❌         |      ❌       |
| Mock API                 |          MSW          |       ❌       |        ❌         |      ❌       |
| Forms                    |     Conform + Zod     |       ❌       |        ❌         |      ❌       |
| Accessibility guardrails |          ✅           |       ❌       |        ❌         |      ❌       |

### Claude-native

Epic Stack, RedwoodJS, and create-t3-app don't ship Claude tooling at all. GAIA adds 15 path-scoped rules, 7 enforcement hooks, 11 Claude Code commands, 6 bundled skills, a code-review audit agent, Obsidian wiki integration, and MCP integrations out of the box.

## One-Command Initialization

The template ships clean. `/init` finishes the last-mile setup:

- **Configures your project** — prompts for a title, sets the package name, docs title, CODEOWNERS, and localized site titles
- **Installs dependencies** — runs `npm install` for you
- **Configures i18n** — prompts for your language set, scaffolds the matching language files, and updates the component and Storybook wiring
- **Installs Claude skills and plugins** — [React Doctor](https://github.com/millionco/react-doctor), [Playwright CLI](https://github.com/microsoft/playwright-cli), `typescript-lsp`, and [`claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian)
- **Offers Chromatic MCP setup** — opts you in to the Storybook MCP server if you want it

After `/init` finishes, you have a clean app shell **and** a fully-configured Claude workflow ready to use.

## Claude Workflow

GAIA ships a complete, opinionated Claude Code workflow. Everything is wired in `.claude/` and visible in the repo.

### Commands

| Command            | What it does                                                           |
| ------------------ | ---------------------------------------------------------------------- |
| `/init`            | Full template initialization (see above)                               |
| `/migrate`         | Upgrade a package to latest, apply breaking changes, run quality gate  |
| `/audit-knowledge` | Audit memory, wiki, and auto-loaded files for duplication and bloat    |
| `/handoff`         | Save a session handoff doc so the next session can resume cold         |
| `/pickup`          | Resume from the latest handoff — reports state, drift, and next action |

### Rules, hooks, skills

- **15 path-scoped rules** cover TypeScript, React, Tailwind, testing, i18n, accessibility, and state management. Ask Claude about any of them — they're in `.claude/rules/`.
- **7 hooks** guard the quality gate and keep the wiki fresh. Ask Claude what they do.
- **6 bundled skills** (`typescript`, `react-code`, `tailwind`, `skeleton-loaders`, `tdd`, `playwright-cli`) auto-load for matching tasks.

### Code review before merge

Every merge runs through a code-review pass against the branch diff — security, performance, code smells, anti-patterns — and blocks until the issues are fixed and committed.

### Wiki

GAIA ships with an [Obsidian](https://obsidian.md) wiki knowledge base — architecture, modules, dependencies, decisions, flows, concepts — committed to git and shared across the team. The [`claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian) plugin (installed by `/init`) adds `/wiki-ingest`, `/wiki-query`, `/wiki-lint`, `/autoresearch`, and `/save` for working with the vault. Open `wiki/` in Obsidian for graph view, backlinks, and search.

### Chromatic MCP

Storybook 10.3+ ships support for `@storybook/addon-mcp`, which pairs with the [Chromatic MCP](https://www.chromatic.com/docs/mcp/) server to let Claude query components, props, and visual-regression diffs directly. `/init` offers to set it up; otherwise run `/setup-chromatic-mcp` any time — it's idempotent.

## Development

GAIA is driven through Claude. Ask for what you need.

**Build things:**

- *"Add a new route for settings."* → triggers `/new-route`, applies routing + i18n + test rules.
- *"Add German as a supported language."* → Claude walks the i18n setup.
- *"Add a zip-code field to the address form with validation."* → Claude uses the form patterns from the wiki.

**Ask about the codebase:**

- *"How does dark mode wire through?"* → Claude fetches the wiki page on demand.
- *"What state patterns do we use?"* → one page lookup, no context bloat.
- *"Explain the form-submit flow."* → direct answer from the wiki.

**Extend:**

- Rules, hooks, skills, and commands live in `.claude/`. Ask Claude to add, modify, or explain any of them.

## Testing

Ask Claude to run, add, or debug tests — Vitest, Storybook + Chromatic, and Playwright are all wired up.

## Deployment

GAIA isn't prescriptive about hosting. Ask Claude to set up your deployment for the target you want — Vercel, Cloudflare, Fly, AWS, a bare Node host, a Docker container, anywhere React Router 7 can run. Claude will wire up the build, environment variables, and any CI/CD you need.

## History

The GAIA Flash Framework was Flash's most popular framework — **its killer feature was automation**. It collapsed repetitive Flash plumbing into a few declarative patterns so engineers could focus on the product, and was used on over 100,000 sites at every major digital agency worldwide.

GAIA React carries that automation philosophy into the AI-native era. Where the original automated Flash boilerplate, this template automates the Claude workflow — conventions, rules, hooks, gates, wiki — so you can ship features end-to-end without wiring the scaffolding every time.
