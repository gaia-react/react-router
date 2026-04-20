# Wiki Maintenance

Before executing `git commit` (or any commit command), evaluate whether the work warrants a wiki update. Goal: keep `wiki/` current so Claude's future context loads reflect the project's real state — without thrashing the vault on every commit.

## File a wiki update if the commit introduces any of:

- A new service, component family, hook, or pattern other developers should know about
- An added, updated, or removed dependency
- A decision worth recording as an ADR (chose X over Y, rejected approach Z with reason)
- A non-obvious invariant, gotcha, or workaround discovered while debugging
- A breaking change to a documented interface

## Do NOT file a wiki update for:

- Bug fixes inside existing patterns
- Refactors that don't change the mental model
- Typos, formatting changes, additions to existing test suites
- Changes that would duplicate existing wiki content (check `wiki/index.md` first)

## Process

1. Before commit, scan `wiki/index.md` to see what is already documented.
2. If the commit qualifies, pick the right skill:
   - `/save` — capture a chat insight as a new note
   - `/wiki-ingest` — file a specific source (PR body, spec, external doc)
   - Direct edit — update an existing module / concept / decision page
3. Update `wiki/log.md` with a one-line entry (newest on top).
4. The `claude-obsidian` Stop hook refreshes `wiki/hot.md` automatically when it detects wiki changes.

Periodic drift cleanup: run `/audit-knowledge` every few weeks to find orphan pages, dead wikilinks, and stale claims.
