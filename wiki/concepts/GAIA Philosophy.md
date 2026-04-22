---
type: concept
status: mature
created: 2026-04-20
updated: 2026-04-20
tags: [concept, philosophy]
---

# GAIA Philosophy

> [!key-insight] Base template, not full-stack kit
> GAIA is the infrastructure that every React project needs but nobody wants to set up twice. It deliberately ships **no component library** — you choose what fits.

## Core tenets

1. **Pre-configured but removable — ask Claude to swap.** Don't need i18n? Tell Claude to rip it out. Prefer different icons? Ask Claude to swap them in. Because Claude understands how the pieces are wired, removals and substitutions stay coherent. Nothing is locked in.
2. **Quality enforced by tooling, not vigilance.** 20+ ESLint plugins + pre-commit hooks + the [[Quality Gate]] catch issues before they compound. Let the tooling enforce consistency so the team can focus on features.
3. **Working examples, not just installs.** Every tool ships with a real, working example: i18n in 2 languages, MSW handlers for tests and Storybook, Conform-validated forms.
4. **Co-location with discipline.** Tests, stories, assets, hooks, state live next to the component — but in their own subfolders so the component folder stays scannable.
5. **Thin routes, fat pages.** Routes do data; pages do UI. See [[Thin Routes]].
6. **Best practices baked in.** Patterns over docs. The way to learn GAIA is to clone the example, follow the patterns, modify.

## Origin

Decades of greenfield projects, learning the hard way what works, what breaks at scale, and what pays off long-term. Refined over 4+ years across multiple production teams. See [[GAIA]] entity.

## What GAIA explicitly avoids

- A component library (see [[No Component Library]])
- A specific deployment target — uses default React Router deploy, you pick the host
- Heavy state management (no Redux, Zustand) — Context+Provider is enough
- Backend assumptions (no Prisma, Drizzle, etc.) — your services layer talks to your API
