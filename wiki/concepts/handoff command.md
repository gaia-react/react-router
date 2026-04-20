---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-21
tags: [concept, claude, command, session]
---

# `/handoff` Command

Source: `.claude/commands/handoff.md`. Generates a self-contained session handoff doc so the next session can pick up cold without re-reading the conversation.

Writes to `.claude/handoff/HANDOFF-{YYYY-MM-DD}-{slug}.md`. Synthesizes accomplishments, decisions, gaps, open questions, and concrete next actions — never dumps the transcript raw.

Pairs with [[pickup command]].
