---
type: concept
status: active
created: 2026-04-20
updated: 2026-04-20
tags: [concept, claude, command, session]
---

# `/handoff` Command

Source: `.claude/commands/handoff.md`. Generates a self-contained session handoff doc so the next session can pick up cold without re-reading the conversation.

## When to use

End of session, context break, or when state is non-obvious.

## What it does

1. **Gather** (parallel): branch, last commit, dirty files; extracts accomplishments, decisions, gaps, open questions from the transcript; derives a kebab-case slug.
2. **Write** to `.claude/handoff/HANDOFF-{YYYY-MM-DD}-{slug}.md` using a template (Accomplishments, Decisions, Gaps & Open Questions, Environment State, Reference Files, Next Actions).
3. **Confirm** with one line: saved path + counts.

## Rules

- Synthesize, don't dump the conversation
- Every Next Action must be concrete enough to execute without context
- Every Gap must name a file and a diagnostic
- Skip empty sections — never write "N/A"
- Never fabricate commit hashes, file paths, or device IDs
- Cross-reference files with `@path/to/file:line`

## Pairs with

- [[pickup command]] — `/pickup` resumes the next session from the latest handoff
- [[Claude Integration]] — registered alongside the other slash commands
