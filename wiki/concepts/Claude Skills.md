---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-21
tags: [concept, claude, skills]
---

# Claude Skills

`.claude/skills/` holds project-local skills (react-code, typescript, tailwind, skeleton-loaders). Each has a `SKILL.md` defining when it activates and its rules. Skills apply by context/intent; rules apply by file path.

See [[modules/Claude Integration|the modules page]] for the full skills inventory.

## Skill references convention

`SKILL.md` is stack-agnostic lazy philosophy. It auto-loads into context, so it must stay short and general.

Stack-specific or deep-dive content lives in `references/{topic}.md` inside the skill directory, loaded on demand. `SKILL.md` hints at available references via markdown links. Adding support for a new stack means adding a new reference file — `SKILL.md` itself is never touched.

**Example:** `skills/tdd/SKILL.md` links to `skills/tdd/references/tests-react.md`. A new Svelte testing reference would go in `skills/tdd/references/tests-svelte.md`.

See [[Claude Integration Conventions]] for the broader convention covering extension points, monorepo retrofit, and service swaps.

## Plugin skills (claude-obsidian v1.6.0)

GAIA's wiki workflow is powered by the `claude-obsidian` plugin, installed globally via the Claude Code marketplace (not vendored into this repo). The plugin contributes ten `claude-obsidian:*` skills. They auto-load on context match alongside GAIA's project-local skills:

- `claude-obsidian:wiki` — bootstrap or check the wiki vault; routes to specialized sub-skills.
- `claude-obsidian:wiki-ingest` — read a source (file or URL), extract entities/concepts, file structured pages, update cross-references and the log.
- `claude-obsidian:wiki-query` — answer questions using the vault (hot cache → index → drill in), with citations; quick / standard / deep modes.
- `claude-obsidian:wiki-lint` — health check: orphans, dead wikilinks, stale claims, missing cross-refs, frontmatter gaps; updates Dataview dashboards.
- `claude-obsidian:save` — file the current chat or a specific insight as a structured wiki note.
- `claude-obsidian:autoresearch` — autonomous iterative research loop that searches, synthesizes, and files findings into the vault.
- `claude-obsidian:canvas` — create and edit Obsidian canvas files (images, text, PDFs, wiki pages).
- `claude-obsidian:defuddle` — strip ads/nav/boilerplate from web pages before ingesting (saves 40-60% tokens).
- `claude-obsidian:obsidian-bases` — create and edit Obsidian Bases (the native database layer for dynamic tables, filters, formulas).
- `claude-obsidian:obsidian-markdown` — write correct Obsidian Flavored Markdown (wikilinks, embeds, callouts, properties, math, canvas syntax).

The skill source lives in the upstream plugin cache (`~/.claude/plugins/cache/claude-obsidian-marketplace/claude-obsidian/<version>/skills/`), informational reference only — adopters should not edit these files. See [[Claude Integration Conventions]] § Wiki vendor relationship and [[DragonScale Opt-Out]] for the v1.6.0 baseline policy and why DragonScale's `wiki-fold` skill is dormant in our environment.
