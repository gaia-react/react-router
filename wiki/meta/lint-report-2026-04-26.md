---
type: meta
title: 'Lint Report 2026-04-26'
created: 2026-04-26
updated: 2026-04-26
tags: [meta, lint]
status: active
---

# Lint Report: 2026-04-26

First lint after claude-obsidian v1.4.3 → v1.6.0 bump, Mode B+E declaration normalization, and new ADR `wiki/decisions/DragonScale Opt-Out.md`.

## Summary

- Pages scanned: 81
- Issues found: 7 (2 critical, 3 warnings, 2 suggestions)
- Auto-fixed: 0
- Needs review: 7

---

## Critical (must fix)

### C1. Dead link: `[[CLAUDE]]` in `wiki/log.md`

- **Affected**: `wiki/log.md` (Initial Ingest entry, line ~118)
- **Problem**: `[[CLAUDE]]` resolves to nothing. `wiki/CLAUDE.md` was renamed to `wiki/README.md` in an earlier session. The log is append-only history, so this is a historical artifact, but the wikilink is still broken.
- **Suggested fix**: Replace `[[CLAUDE]]` with plain text `CLAUDE (now README.md)` since the log is append-only. Alternatively link to `[[README]]`.

### C2. Stale mode claim in `wiki/sources/Initial Ingest.md`

- **Affected**: `wiki/sources/Initial Ingest.md` line 31
- **Problem**: States `"Mode: Codebase wiki (Mode B)"`. Since the v1.4.3 → v1.6.0 update, the mode was formally normalized to `Mode: B (Codebase) + E (Research)` per upstream `references/modes.md`. The page now contradicts `wiki/README.md`, `wiki/concepts/Claude Integration Conventions.md` §1, and `wiki/decisions/DragonScale Opt-Out.md`.
- **Suggested fix**: Update the line to `"Mode: B (Codebase) + E (Research)"` and annotate it as the mode at ingest time if historical accuracy matters.

---

## Warnings (should fix)

### W1. `wiki/modules/Claude Integration.md` Skills table missing `tdd` skill

- **Affected**: `wiki/modules/Claude Integration.md` — Skills section
- **Problem**: The Skills table lists four skills (`react-code`, `typescript`, `tailwind`, `skeleton-loaders`). The `tdd` skill with its `references/` convention is documented in `wiki/concepts/Claude Integration Conventions.md` §3 and `wiki/concepts/Claude Skills.md` but absent from the Claude Integration module inventory.
- **Suggested fix**: Add a `tdd` row to the Skills table.

### W2. `wiki/modules/Claude Integration.md` missing `wiki-squash-autocommits.sh`

- **Affected**: `wiki/modules/Claude Integration.md` — SessionStart/Stop section
- **Problem**: `wiki/concepts/Claude Hooks.md` lists `wiki-squash-autocommits.sh` as a Stop hook (alongside `wiki-session-stop.sh`). The Claude Integration module's Stop hooks table lists only `wiki-session-start.sh` and `wiki-session-stop.sh` — the squash hook is absent. This is a carry-over from the previous lint (C3 in lint-report-2026-04-21) that was not fixed.
- **Suggested fix**: Add `wiki-squash-autocommits.sh` to the Stop hooks row in `modules/Claude Integration.md`.

### W3. Naming convention violations — command and concept page filenames

- **Affected**:
  - `concepts/audit-knowledge command.md` — mixed case; should be `Audit-Knowledge Command.md` or `Audit Knowledge Command.md`
  - `concepts/handoff command.md` — should be `Handoff Command.md`
  - `concepts/pickup command.md` — should be `Pickup Command.md`
  - `concepts/test-runner.md` — should be `Test Runner.md`
  - `decisions/composeStory Pattern.md` — leading lowercase; `ComposeStory Pattern.md` would satisfy Title Case
  - `modules/i18n.md`, `dependencies/i18next.md`, `dependencies/remix-flat-routes.md`, `dependencies/remix-i18next.md`, `dependencies/remix-toast.md` — intentional package-name lowercase (flagged for awareness; likely acceptable by project convention)
- **Suggested fix**: Rename the four command/concept pages to Title Case. Dependency and abbreviation pages can stay as-is if the team treats package-name case as an intentional exception.

---

## Suggestions (worth considering)

### S1. `[[CLAUDE]]` dead link in `wiki/meta/lint-report-2026-04-21.md`

- **Affected**: `wiki/meta/lint-report-2026-04-21.md` (multiple occurrences — historical report content)
- **Problem**: The prior lint report references `[[CLAUDE]]` nine times in its own text (quoting the issues it found). These are dead wikilinks inside a historical document. Low impact since lint reports are reference-only.
- **Suggested fix**: No action required unless the report is used as a live reference. The dead links are self-documenting (they describe the very bug they reported).

### S2. `wiki/decisions/DragonScale Opt-Out.md` — new ADR cross-link coverage assessment

- **Status**: PASS. The new ADR is properly cross-linked. Inbound links confirmed from:
  - `wiki/README.md` (plugin baseline line)
  - `wiki/hot.md` (Recent Changes section)
  - `wiki/index.md` (Decisions catalog)
  - `wiki/concepts/Claude Integration Conventions.md` (§1 Wiki vendor relationship + cross-links footer)
  - `wiki/concepts/Claude Skills.md` (Plugin skills section)
- The ADR's own cross-links footer correctly links `[[Claude Integration Conventions]]`, `[[Claude Skills]]`, and `[[Quality Gate]]`. No gaps found.

---

## Checks with clean results

- **Orphan pages**: None. All 81 pages have at least one inbound wikilink. Pages with low link counts (1–2) that were borderline in the prior lint are acceptable: `Agentic Design` (1, from index), `lint-report-2026-04-21` (1, from index), `log` (1, from index), `README` (1, from prior lint report — see S1), `overview` (2), `hot` (2), `Co-located Tests Folder` (2), `composeStory Pattern` (2), `Initial Ingest` (2).
- **Dead links (wikilinks)**: Only `[[CLAUDE]]` in `log.md` and `lint-report-2026-04-21.md` (C1/S1 above). All other wikilinks resolve to existing files including path-style links (`[[modules/Claude Integration|the modules page]]`). The `[[Note Name]]` in `README.md` is a schema example string, not a real wikilink.
- **Frontmatter gaps**: None. `wiki/hot.md` has an HTML comment block before its YAML frontmatter — the YAML is valid and all five required fields (`type`, `status`, `created`, `updated`, `tags`) are present. All 81 pages pass.
- **Empty sections**: None. The heading-structure check was run with sub-heading awareness; all headings contain either direct content or sub-sections.
- **Stale seed pages**: None. No pages carry `status: seed`.
- **Large pages (>300 lines)**: None. Largest pages: `Claude Integration Conventions.md` (165 lines), `MSW Handlers.md` (158 lines), `Agentic Design.md` (140 lines), `Claude Integration.md` (136 lines). All within the 300-line limit.
- **Stale index entries**: None. All 38 wikilinks in `index.md` resolve to existing files.
- **Folder naming**: All domain folders use lowercase (`components/`, `concepts/`, `decisions/`, `dependencies/`, `entities/`, `flows/`, `meta/`, `modules/`, `sources/`). Convention satisfied.
- **Tag casing**: All tags are lowercase across all pages. Convention satisfied.
- **DragonScale cross-linking**: PASS (see S2).
- **Mode string consistency**: `wiki/README.md`, `wiki/concepts/Claude Integration Conventions.md`, and `wiki/decisions/DragonScale Opt-Out.md` all use `Mode: B (Codebase) + E (Research)` consistently. `wiki/sources/Initial Ingest.md` is the sole outlier (C2).
