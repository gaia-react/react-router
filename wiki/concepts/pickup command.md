---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-21
tags: [concept, claude, command, session]
---

# `/pickup` Command

Source: `.claude/commands/pickup.md`. Restores "where did we leave off" at session start — reads the latest handoff file, checks for branch/commit drift, and reports a ≤15-line status block with the suggested next action.

Falls back to `wiki/hot.md` if no handoff exists. Archives the handoff only after work has actually begun.

Pairs with [[handoff command]].
