---
type: source
source_type: codebase-scan
ingested: 2026-04-20
tags: [source, initial]
---

# Source: Initial Ingest of GAIA React Router

## What was read

- `README.md`
- `package.json`
- `app/root.tsx`, `app/routes.ts`
- `app/services/api/index.ts`, `app/sessions.server/auth.ts`, `app/state/index.tsx`
- `docs/general/{about,features,quick-start,claude}.md` (and the `general/CLAUDE.md` partial)
- `docs/architecture/{folder-structure,routes,components,pages,services,sessions,state,middleware,hooks,languages,utils,styles,types,assets}.md`
- `docs/tech-stack/{foundation,code-quality,testing/index,testing/unit-and-integration,testing/visual,testing/e2e}.md`
- `.claude/CLAUDE.md` (project) + `.claude/rules/*.md` (full)
- `.claude/commands/*.md` (full set: audit, gaia-init, migrate, new-component, new-hook, new-route, new-service)
- `.claude/hooks/*.sh` (all 4)
- `.claude/agents/code-review-audit.md`
- `.claude/settings.json`
- Folder listings for `app/`, `test/`, `.storybook/`, `.playwright/e2e/`

## Key takeaways

- **Mode**: Codebase wiki (Mode B) — modules, components, decisions, dependencies, flows
- **Big ideas**:
  - Pre-configured but removable. No component library. ([[GAIA Philosophy]])
  - Thin routes, fat pages. ([[Thin Routes]])
  - Quality enforced by tooling, zero-warning gate. ([[Quality Gate]])
  - One mocking layer (MSW) across Vitest, Storybook, Playwright. ([[MSW]])
  - composeStory pattern shares Storybook + Vitest setup. ([[Component Testing]])
  - TypeScript language files instead of JSON. ([[TypeScript Language Files]])
  - Husky runs tests on commit, not just lint. ([[Pre-commit Hooks]])
  - Form components are the headline feature. ([[Form Components]])
- **Claude integration is first-class**: 8 commands, 10 rules, 4 hooks, 1 review agent + 3 specialists, 4 skills. ([[Claude Integration]])

## Pages created

See [[index]] for the full list. Includes: 1 overview, 13 modules, 6 flows, 2 entities, 16 dependencies, 6 decisions, 11 concepts, 1 source summary.
