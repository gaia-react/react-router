---
title: Claude Integration
layout: doc
outline: deep
---

# Claude Integration

GAIA comes with [Claude Code](https://claude.ai/) support built-in: commands, rules, hooks, and a quality gate that work out of the box.

## Commands

Scaffolding commands generate files that follow GAIA's established conventions.

| Command          | What it does                                                              |
| ---------------- | ------------------------------------------------------------------------- |
| `/gaia-init`     | Remove example code, configure languages, set up a clean slate (run once) |
| `/new-route`     | Scaffold a route with page component, test, story, and i18n keys          |
| `/new-component` | Scaffold a component with optional test and story                         |
| `/new-service`   | Scaffold an API service with requests, Zod schemas, URLs, and MSW mocks   |
| `/new-hook`      | Scaffold a custom hook with test file                                     |
| `/audit-code`    | Run the full quality gate (typecheck, lint, test, E2E, build)             |
| `/migrate`       | Upgrade a package to latest, apply breaking changes, run quality gate     |
| `/handoff`       | Save a session handoff doc so the next session can resume cold            |
| `/pickup`        | Resume from the latest handoff — reports state, drift, and next action    |

## Rules

Rules activate automatically based on the file paths you're editing. You don't need to invoke them.

| Rule              | Applies to                                              | What it enforces                                          |
| ----------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Coding Guidelines | All code                                                | Simplicity, surgical changes, TDD                         |
| Component Testing | `app/components/**`                                     | composeStory pattern for component tests                  |
| New Route         | `app/routes/**`, `app/pages/**`                         | Thin routes, page component conventions, route groups     |
| API Service       | `app/services/**`, `test/mocks/**`                      | Request/schema/mock patterns following the Things service |
| i18n              | `app/pages/**`, `app/components/**`, `app/languages/**` | `useTranslation()` conventions, key organization          |
| Accessibility     | `app/components/**`, `app/pages/**`                     | Keyboard nav, alt text, ARIA, focus management            |
| ESLint Fixes      | ESLint-related files                                    | Fix in source code, not config                            |
| Test Runner       | Test files                                              | Use `npm run test -- --run` for CI, never bare `npm test` |
| Quality Gate      | Commits                                                 | Run `/audit-code` and fix all issues before `git commit`  |
| PR Merge Workflow | PR merges                                               | Code review audit before every merge                      |

## Agents

### Code Review Audit Agent

Runs automatically before every PR merge. Reviews security vulnerabilities, performance issues, code smells, and anti-patterns. Pre-seeded with GAIA's architecture knowledge.

## Hooks

Hooks run automatically on file edits:

- **Blocking:** Prevents modifying ESLint config to solve lint errors; prevents adding vitest globals to tsconfig
- **Advisory:** Reminds to use `useTranslation()` for user-facing strings in pages/components; reminds to add Storybook stories for new components

## Skills

GAIA includes custom skills for writing React code, TypeScript code, Tailwind CSS, and pixel-perfect skeleton loaders. These activate automatically based on context.

## Wiki & Knowledge Base

GAIA includes a `wiki/` directory — a committed, Obsidian-compatible knowledge base structured for LLM consumption.

### What it contains

| Folder          | Purpose                                                         |
| --------------- | --------------------------------------------------------------- |
| `modules/`      | Major architectural areas (Routing, Services, i18n, Testing, …) |
| `components/`   | Reusable UI components                                          |
| `dependencies/` | External packages with their role and version                   |
| `decisions/`    | ADRs — why GAIA chose X over Y                                  |
| `concepts/`     | Patterns and ideas (Quality Gate, Thin Routes, Co-location, …)  |
| `flows/`        | Data flows (auth, theme, language, form submit)                 |
| `entities/`     | Project, contributors, ecosystem actors                         |
| `sources/`      | One summary page per ingested source                            |

`wiki/index.md` is the master catalog. `wiki/hot.md` is a ~200-word recent-context cache that Claude auto-loads. `wiki/log.md` is an append-only ingest log.

### Why it's there

- **No token bloat.** Claude pulls specific pages on demand instead of preloading every doc.
- **Shared across the team.** Committed to git — unlike machine-local Claude memory, every developer sees the same wiki.
- **Outlives the chat.** Architectural decisions, dependency rationale, and flow diagrams persist beyond any single Claude session.
- **Standard markdown.** Open `wiki/` in [Obsidian](https://obsidian.md) for graph view, backlinks, and full-text search.

### claude-obsidian plugin

The [`claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian) Claude Code plugin is installed automatically by `/gaia-init`. It adds skills that let Claude operate on the vault:

- **Ingest** — drop a source in `.raw/` and say "ingest [filename]"
- **Query** — ask any question; Claude reads `hot.md` → `index.md` → drills into specific pages
- **Lint** — say "lint the wiki" for a health check (orphans, dead links, stale claims)
- **Save** — `/save` files the current chat as a structured note
- **Canvas** — visual layer over the vault (images, text cards, PDFs)

If you don't use the wiki, you can ignore the folder — nothing in the build or runtime depends on it.
