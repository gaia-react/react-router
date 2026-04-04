---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'GAIA React Template'
  tagline: 'The most thoroughly configured React Router 7 template available. Every tool set up, every integration tested, every convention documented.'
  actions:
    - theme: brand
      text: Quick Start
      link: /general/quick-start
    - theme: alt
      text: Tech Stack
      link: /tech-stack/foundation/
    - theme: alt
      text: Architecture
      link: /architecture/folder-structure

features:
  - title: Solid Foundation
    icon: 🚀
    details: React Router 7, TailwindCSS, Conform + Zod forms, i18n with working examples, auth with session management, dark mode end-to-end
  - title: Quality Enforced by Default
    icon: ️✅
    details: 20+ ESLint plugins, Prettier, Stylelint, pre-commit hooks that typecheck, lint, and test before code reaches CI
  - title: Four Layers of Testing
    icon: 🛠
    details: Unit (Vitest), integration (React Testing Library + MSW), visual regression (Storybook + Chromatic), and E2E (Playwright), all sharing a common mocking layer
  - title: Claude Code Integration
    icon: 🤖
    details: Scaffolding commands, auto-activating rules, code review agent, and quality gate built into the development workflow
---
