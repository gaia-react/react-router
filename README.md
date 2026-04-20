# GAIA React

<img src="./app/assets/images/gaia-logo.svg" height="100" alt="GAIA"/>

**Claude as your lead engineer.** GAIA is the React Router template that makes Claude trustworthy enough to own features end-to-end, token-efficient enough to do it at scale, and grounded enough in the stack to answer how-do-I questions without re-reading the codebase.

Built on React Router 7, Tailwind v4, Vitest, Playwright, Chromatic, Storybook, i18n, Conform + Zod forms, dark mode, MSW, and 20+ ESLint plugins. Every piece is pre-configured *and* documented for Claude in a way that keeps per-request costs down and output quality up.

## Quick Start

```bash
# Requires Node >= 22.19.0
npx create-react-router@latest --template gaia-react/react-router
```

Open Claude Code in the project and type `/init`.

## The two problems GAIA solves

Most templates treat Claude as a tool you hold — bolt a `CLAUDE.md` onto the root and hope the model figures out the rest. GAIA treats Claude as an engineer you *manage*. That shift exposes two failure modes the bolt-on approach papers over.

**Trust.** You can't manage an engineer you can't predict. Without enforceable conventions, Claude reverts to its training distribution — which isn't your codebase. GAIA embeds project conventions as auto-loaded rules, pre-tool hooks that block mistakes at disk, a required code-review agent before every merge, and a quality gate before every commit. Claude writes code that matches your patterns on day one, and can't ship code that doesn't.

**Token economics.** Context bloat isn't just `CLAUDE.md` sprawl. Instructions get dropped into global memory, forgotten, and accumulate into redundancies or conflicts — an invisible cost that keeps growing every session. GAIA keeps token usage minimized: path-scoped rules that only load when relevant, and a fetch-on-demand Obsidian wiki that replaces `CLAUDE.md` sprawl entirely.

## How GAIA makes Claude trustworthy

- **Claude writes code that matches best practices on day one — and can't ship code that doesn't.** Best practices are baked into GAIA, not pattern-matched from whatever's in the repo.
- **Guardrails against technical debt.** Rules block debt-accumulating patterns from being written in the first place — untyped exports, untested components, hardcoded strings, a11y gaps.
- **Test-driven development** via the bundled `tdd` skill. Red-green-refactor loop, tests before code — tailored for Vitest, React Testing Library, Storybook `composeStory`, and MSW.
- **Code-review audit agent runs before every merge.** A required Claude subagent scans the branch diff for security, performance, code smells, and anti-patterns, then invokes [React Doctor](https://github.com/millionco/react-doctor) for 47+ React-specific rules. The `pr-merge-workflow` rule makes it a hard gate — no "small PR" override.
- **Quality gate before commit** — typecheck, lint, tests, and build must all pass. Not "mostly clean" — actually clean.

## How GAIA keeps Claude token-efficient

- **Path-scoped rules** load only when Claude touches a matching file. The `accessibility` rule loads inside `app/components/`; the `api-service` rule loads inside `app/services/`. No preloaded manual.
- **Obsidian wiki replaces `CLAUDE.md` sprawl.** Architecture, flows, and decisions live in `wiki/` as focused, linked markdown. Claude pulls the specific page it needs; a ~200-word `hot.md` is the only thing loaded at session start.
- **Tailored wiki behavior for GAIA.** A `wiki-maintenance` rule and session-start/stop hooks keep the `claude-obsidian` plugin's habits (ingest cadence, hot-cache discipline, link hygiene) matched to this project's conventions.
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

|                          |         GAIA          |  Epic Stack   | create-t3-app | RedwoodJS |
| ------------------------ | :-------------------: | :-----------: | :-----------: | :-------: |
| TypeScript               |           ✓           |       ✓       |       ✓       |     ✓     |
| Routing                  |    React Router 7     | React Router 7 |    Next.js    | React Router |
| Tailwind                 |           ✓           |       ✓       |       ✓       |     ✗     |
| Dark mode                |           ✓           |       ✗       |       ✗       |     ✗     |
| i18n                     |           ✓           |       ✗       |       ✗       |     ✗     |
| Unit / integration tests |        Vitest         |    Vitest     |       ✗       |   Jest    |
| Component testing        | Storybook + Chromatic |       ✗       |       ✗       | Storybook |
| E2E tests                |      Playwright       |  Playwright   |       ✗       |     ✗     |
| Mock API                 |          MSW          |       ✗       |       ✗       |     ✗     |
| Forms                    |     Conform + Zod     |       ✗       |       ✗       |     ✗     |
| Accessibility guardrails |           ✓           |       ✗       |       ✗       |     ✗     |

### Claude-native

|                            | GAIA | Epic Stack | create-t3-app | RedwoodJS |
| -------------------------- | :--: | :--------: | :-----------: | :-------: |
| Path-scoped rules          |  15  |     ✗      |       ✗       |     ✗     |
| Enforcement hooks          |  7   |     ✗      |       ✗       |     ✗     |
| Claude Code commands       |  11  |     ✗      |       ✗       |     ✗     |
| Bundled skills             |  6   |     ✗      |       ✗       |     ✗     |
| Code-review audit agent    |  ✓   |     ✗      |       ✗       |     ✗     |
| Obsidian wiki integration  |  ✓   |     ✗      |       ✗       |     ✗     |
| MCP integrations           |  ✓   |     ✗      |       ✗       |     ✗     |

## Installation

Make sure you have [Node.js](https://nodejs.org/en/) >= 22.19.0 LTS installed, preferably via [nvm](https://github.com/nvm-sh/nvm).

```sh
npx create-react-router@latest --template gaia-react/react-router
```

Then open Claude Code in the project and type `/init`.

## One-Command Initialization

The template ships clean. `/init` finishes the last-mile setup:

- **Installs dependencies** — runs `npm install` for you
- **Strips GAIA branding** — FUNDING.yml, GAIA logo, Storybook BRAND config
- **Configures i18n** — prompts for your language set (English, Japanese, French, Spanish, German, or a custom list), scaffolds matching language files, updates `LanguageSelect` and Storybook globals
- **Sets project metadata** — `package.json` name, `CLAUDE.md` title, `CODEOWNERS`, and localized site titles
- **Installs Claude skills** — [React Doctor](https://github.com/millionco/react-doctor) and [Playwright CLI](https://github.com/microsoft/playwright-cli)
- **Installs Claude plugins** — `typescript-lsp` (from the official Claude Plugins marketplace) and [`claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian)
- **Offers Chromatic MCP setup** — runs `/setup-chromatic-mcp` if you opt in; otherwise you can run it any time later
- **Initializes the wiki** — refreshes `wiki/hot.md` and appends an init entry to `wiki/log.md`
- **Verifies** via the quality gate: `typecheck && lint && test:ci && build`

After `/init` finishes, you have a clean app shell **and** a fully-configured Claude workflow ready to use.

## Claude Workflow

GAIA ships a complete, opinionated Claude Code workflow. Everything is wired in `.claude/` and visible in the repo.

### Commands

| Command                | What it does                                                            |
| ---------------------- | ----------------------------------------------------------------------- |
| `/init`                | Full template initialization (see above)                                |
| `/new-route`           | Scaffold a route with page component, test, story, and i18n keys        |
| `/new-component`       | Scaffold a component with optional test and story                       |
| `/new-service`         | Scaffold an API service with requests, Zod schemas, URLs, and MSW mocks |
| `/new-hook`            | Scaffold a custom hook with test file                                   |
| `/audit-code`          | Run the full quality gate (typecheck, lint, test, E2E, build)           |
| `/audit-knowledge`     | Audit memory, wiki, and auto-loaded files for duplication and bloat     |
| `/migrate`             | Upgrade a package to latest, apply breaking changes, run quality gate   |
| `/handoff`             | Save a session handoff doc so the next session can resume cold          |
| `/pickup`              | Resume from the latest handoff — reports state, drift, and next action  |
| `/setup-chromatic-mcp` | Idempotent install of `@storybook/addon-mcp` + Chromatic MCP server     |

### Rules, hooks, skills

- **15 path-scoped rules** cover TypeScript, React, Tailwind, testing, i18n, accessibility, and state management. Ask Claude about any of them — they're in `.claude/rules/`.
- **7 hooks** guard the quality gate and keep the wiki fresh. Ask Claude what they do.
- **6 bundled skills** (`typescript`, `react-code`, `tailwind`, `skeleton-loaders`, `tdd`, `playwright-cli`) auto-load for matching tasks.

### Code review before merge

The `pr-merge-workflow` rule makes the `code-review-audit` agent a required step before `gh pr merge`. The agent reviews the branch diff for security, performance, code smells, and anti-patterns — and blocks the merge until reported issues are fixed and committed.

### Wiki

GAIA ships with a `wiki/` knowledge base — architecture, modules, dependencies, decisions, flows, concepts — committed to git and shared across the team. Editable in [Obsidian](https://obsidian.md) for graph view, backlinks, and search. The [`claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian) plugin (installed by `/init`) adds `/wiki-ingest`, `/wiki-query`, `/wiki-lint`, `/autoresearch`, and `/save` for working with the vault.

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

Standard React Router 7 build (`npm run build`) and start (`npm start`). Deploy to any Node host.

<details>
<summary>History</summary>

The GAIA Flash Framework was Flash's most popular framework — **its killer feature was automation**. It collapsed repetitive Flash plumbing into a few declarative patterns so engineers could focus on the product, and was used on over 100,000 sites at every major digital agency worldwide.

GAIA React carries that automation philosophy into the AI-native era. Where the original automated Flash boilerplate, this template automates the Claude workflow — conventions, rules, hooks, gates, wiki — so Claude can ship features end-to-end without the engineer wiring the scaffolding every time.

</details>
