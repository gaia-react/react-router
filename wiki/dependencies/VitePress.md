---
type: dependency
status: active
package: vitepress
version: 1.6.4
role: docs-site
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, docs]
---

# VitePress

Static docs generator. GAIA's docs source lives in `docs/` (general/, architecture/, tech-stack/, public/) and deploys to GitHub Pages via the bundled GitHub Actions workflow.

## Scripts

- `npm run docs` — dev server on port 5175 (auto-opens)
- `npm run docs:build` — build
- `npm run docs:preview` — preview build

The `base` in `docs/.vitepress/config.ts` should match your project's repo slug (e.g. `/project-name/`). `/gaia-init` updates this when you set the project name.
