---
title: Claude Integration
layout: doc
outline: deep
---

# Claude Integration

GAIA comes with [Claude Code](https://claude.ai/) support built-in: commands, rules, hooks, and a quality gate that work out of the box.

## Commands

Scaffolding commands generate files that follow GAIA's established conventions.

| Command | What it does |
|---|---|
| `/gaia-init` | Remove example code, configure languages, set up a clean slate (run once) |
| `/new-route` | Scaffold a route with page component, test, story, and i18n keys |
| `/new-component` | Scaffold a component with optional test and story |
| `/new-service` | Scaffold an API service with requests, Zod schemas, URLs, and MSW mocks |
| `/new-hook` | Scaffold a custom hook with test file |
| `/audit` | Run the full quality gate (typecheck, lint, test, E2E, build) |
| `/migrate` | Upgrade a package to latest, apply breaking changes, run quality gate |
| `/upgrade-react-router` | Check for and apply React Router updates |

## Rules

Rules activate automatically based on the file paths you're editing. You don't need to invoke them.

| Rule | Applies to | What it enforces |
|---|---|---|
| Coding Guidelines | All code | Simplicity, surgical changes, TDD |
| Component Testing | `app/components/**` | composeStory pattern for component tests |
| New Route | `app/routes/**`, `app/pages/**` | Thin routes, page component conventions, route groups |
| API Service | `app/services/**`, `test/mocks/**` | Request/schema/mock patterns following the Things service |
| i18n | `app/pages/**`, `app/components/**`, `app/languages/**` | `useTranslation()` conventions, key organization |
| Accessibility | `app/components/**`, `app/pages/**` | Keyboard nav, alt text, ARIA, focus management |
| ESLint Fixes | ESLint-related files | Fix in source code, not config |
| Test Runner | Test files | Use `npm run test -- --run` for CI, never bare `npm test` |
| Quality Gate | All code | Full verification checklist |
| PR Merge Workflow | PR merges | Code review audit before every merge |

## Agents

### Code Review Audit Agent

Runs automatically before every PR merge. Reviews security vulnerabilities, performance issues, code smells, and anti-patterns. Pre-seeded with GAIA's architecture knowledge.

## Hooks

Hooks run automatically on file edits:

- **Blocking:** Prevents modifying ESLint config to solve lint errors; prevents adding vitest globals to tsconfig
- **Advisory:** Reminds to use `useTranslation()` for user-facing strings in pages/components; reminds to add Storybook stories for new components

## Skills

GAIA includes custom skills for writing React code, TypeScript code, Tailwind CSS, and pixel-perfect skeleton loaders. These activate automatically based on context.
