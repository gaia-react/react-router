---
title: About
layout: doc
outline: deep
---

# About

Starting a new React project means days of setup before writing a single feature. Linting, testing, i18n, auth, CI, pre-commit hooks, dark mode, Storybook. All of it needs to be configured, integrated, and wired together correctly.

GAIA React is the most thoroughly configured React Router 7 template available. Every tool is set up, every integration tested, every convention documented. You start writing features on day one.

See the full [Features](/general/features) list for specifics.

## Philosophy

GAIA is a **base template**, not a full-stack kit. It deliberately does not include a component library. You choose what fits your project. The value is in the infrastructure and developer experience that every project needs but nobody wants to set up twice.

- 20+ ESLint plugins with fix-on-save, pre-commit hooks that typecheck, lint, and test, and a quality gate that catches issues before they compound. Let the tooling enforce consistency so your team can focus on features. Details in [Code Quality](/tech-stack/code-quality/).
- **Every tool is pre-configured but removable.** Don't need i18n? Remove it. Prefer different icons? Swap them. All configuration files are included and customizable.
- Working examples of auth flows, API services, form validation, and [Component-Driven Development](https://www.componentdriven.org/) with [Storybook](https://storybook.js.org/). Patterns you can follow, not a wiki you'll never read.
- Unit, integration, visual regression, and E2E testing share a mocking infrastructure and have working examples at every level. Details in [Testing](/tech-stack/testing/).

## Why GAIA?

Most engineers rarely get to build projects from scratch. When they do, the first few days disappear into tooling setup, and the choices made in those first days determine the project's quality for its lifetime. A weak foundation turns into tech debt that gets harder to fix the longer it sits.

GAIA comes from decades of building greenfield projects, learning the hard way what works, what breaks at scale, and what pays off long-term. It's a solid foundation for how a modern React project should be structured, organized, and reinforced with linting and tests to keep bugs and tech debt to a minimum.

## Background

GAIA React is the spiritual successor to the GAIA Flash Framework, which was the most popular Flash framework in the world. It was used to build over 100,000 Flash sites and relied upon by every major digital agency. GAIA React has been in development for over 4 years, refined across multiple production projects with different teams.
