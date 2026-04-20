---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, claude, command, knowledge, hygiene]
---

# `/audit-knowledge` Command

Source: `.claude/commands/audit-knowledge.md`. Two-stage audit over every knowledge store in the project — wiki, auto-loaded `CLAUDE.md` files, `.claude/rules/`, machine-local memory — checking for duplication, stale entries, and auto-load token bloat. **Wiki is the source of truth.**

## When to use

- After an ingestion spree that may have introduced overlap
- When auto-load payload starts feeling heavy (CLAUDE.md, `wiki/hot.md`, or rules growing)
- Periodic hygiene pass

## Two-stage execution

| Stage | Model  | Mode                       | Output                                                      |
| ----- | ------ | -------------------------- | ----------------------------------------------------------- |
| 1     | Opus   | `/audit-knowledge`         | Research report at `.claude/audit/KNOWLEDGE-{timestamp}.md` |
| 2     | Sonnet | `/audit-knowledge --apply` | Applies unchecked actions mechanically                      |

Stage 1 proposes actions — `delete`, `delete-entry`, `promote`, `shrink`, `merge`, `fix-link` — each with verbatim `expect` snippets and sha256 drift signals. Stage 2 reads the report, verifies drift signals still match, and applies changes verbatim; on mismatch it skips and reports rather than improvising.

## What it catches

- **Cross-store duplication** — fact lives in both memory and wiki → wiki wins; the memory entry is deleted
- **Promotable memory** — durable knowledge stuck in machine-local memory → moves to a specific wiki page
- **Intra-wiki duplication** — merges overlapping pages into a canonical + redirects
- **Auto-load bloat** — flags `wiki/hot.md`, `CLAUDE.md`, and rules over budget
- **Broken wikilinks** and **dead file paths**
- **Stale entries** referencing removed code, branches, or features

## Portability

Project root and machine-local memory paths resolve at runtime — the subagent computes them from `$CLAUDE_PROJECT_DIR` (with `pwd` fallback) and derives the memory directory via path-to-dash substitution. Nothing is hardcoded, so the command works unchanged across every clone of the template and every developer's machine.

## Guardrails

- Stage 2 never deletes a memory entry unless Stage 1 cited the canonical wiki target
- Only edit to `wiki/log.md` allowed is prepending a new line at the top
- Never runs `git add` or `git commit` — human reviews the diff and commits
- Reports are gitignored (`.claude/audit/`)
- Oldest reports auto-pruned (keep newest 5, delete anything beyond that older than 30 days)

## Pairs with

- [[Claude Integration]] — registered alongside the other slash commands
- [[Quality Gate]] — code-correctness counterpart; knowledge audit is the same idea for docs
