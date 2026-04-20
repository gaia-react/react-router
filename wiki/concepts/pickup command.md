---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, claude, command, session]
---

# `/pickup` Command

Source: `.claude/commands/pickup.md`. Restores "where did we leave off" at session start and suggests the next action.

## What it does

1. **Locate** — `ls -t .claude/handoff/HANDOFF-*.md | head -1`. If none, fall back to `wiki/hot.md` and report "No handoff found — resuming from hot cache."
2. **Read** the handoff in full. In parallel: `git rev-parse --abbrev-ref HEAD`, `git status --short`, `git log -1 --oneline`. Compare handoff branch/commit vs current — flag drift.
3. **Report** a tight ≤15-line status block: branch (+ drift), last handoff filename + date, one-line context, state bullets, open bullets, suggested next action. Do **not** paste the whole handoff back.
4. **Archive** — once the user commits to a direction (picks an action, starts editing, or says "go"), move the consumed handoff to `.claude/handoff/archive/`. Create the dir if missing. **Don't archive until work has actually begun** — premature archive loses context on a context-break mid-pickup.

## Rules

- `wiki/hot.md` auto-loads — don't re-read unless the handoff is missing
- If git state diverges significantly, say so explicitly before suggesting next actions
- Never archive prematurely

## Pairs with

- [[handoff command]] — `/handoff` is the producer
- [[Claude Integration]] — registered alongside the other slash commands
- [[hot|wiki/hot.md]] — fallback when no handoff exists
