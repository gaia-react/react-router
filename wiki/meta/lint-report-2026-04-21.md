---
type: meta
status: active
created: 2026-04-21
updated: 2026-04-21
tags: [meta, lint]
---

# Wiki Lint Report — 2026-04-21

## Summary

- Pages scanned: 73
- Issues found: 11 (4 critical, 4 warnings, 3 suggestions)
- Auto-fixed: 1 (dead link `[[test-runner Rule]]` → `[[test-runner]]` in `concepts/Pre-commit Hooks.md`)

---

## Critical (must fix)

### C1. Dead link: `[[test-runner Rule]]` — FIXED
- **Affected**: `concepts/Pre-commit Hooks.md` (line 13)
- **Problem**: Page is named `test-runner`, not `test-runner Rule`. The link was broken post-compression.
- **Fix applied**: Replaced `[[test-runner Rule]]` with `[[test-runner]]`.

### C2. Dead link: `[[Auth Flow]]` in `log.md`
- **Affected**: `log.md` line 84 (Initial Ingest entry)
- **Problem**: `wiki/flows/Auth Flow.md` was deleted in Phase D (auth stack removal). The log entry references it as a created page.
- **Suggested fix**: Change `[[Auth Flow]]` to plain text `Auth Flow` (struck-through or annotated as deleted) since `log.md` is append-only history. Or add `~~[[Auth Flow]]~~` to signal deletion.

### C3. Dead link: `[[things Service]]` in `log.md`
- **Affected**: `log.md` line 66
- **Problem**: `things Service` page was never created as a standalone wiki page (the log says it was, but no file exists). Deleted in Phase C.
- **Suggested fix**: Same as C2 — annotate as deleted history.

### C4. Dead links: `[[VitePress]]` and `[[remix-auth]]` in `log.md`
- **Affected**: `log.md` line 86
- **Problem**: Both dependency pages were deleted (VitePress and remix-auth removed from the project). The Initial Ingest log lists them as created pages.
- **Suggested fix**: Annotate as deleted in the log, or plain text. These were historical creations that no longer exist.

---

## Warnings (should fix)

### W1. Missing frontmatter fields: `hot.md`, `log.md`, `index.md`
- **Affected**: All three top-level meta pages
- **Problem**: Missing `status`, `created`, and `tags` fields. These are meta pages intentionally kept minimal but the vault schema (CLAUDE.md) requires all five fields.
- **Suggested fix**: Add `status: active`, `created: 2026-04-20`, and appropriate `tags: [meta]` to each.

### W2. Missing frontmatter: `CLAUDE.md` (vault schema file)
- **Affected**: `wiki/CLAUDE.md`
- **Problem**: Has no YAML frontmatter at all — no `type`, `status`, `created`, `updated`, `tags`.
- **Suggested fix**: Add frontmatter with `type: meta`, `status: active`, `created: 2026-04-20`, `updated: 2026-04-20`, `tags: [meta, schema]`.

### W3. Stale claim: `dependencies/MSW.md` lists `msw-storybook-addon` as a companion package
- **Affected**: `dependencies/MSW.md` line 18 and `dependencies/Storybook.md` line 18
- **Problem**: `modules/Storybook.md` explicitly states "No `msw-storybook-addon` — API-level mocking is not used in stories." However, `msw-storybook-addon` IS in `package.json` at version `2.0.7`. The contradiction is between the module page (says not used) and the dependency pages (list it as companion). The module page appears to be the authoritative intent.
- **Suggested fix**: Clarify in `dependencies/MSW.md` and `dependencies/Storybook.md` that `msw-storybook-addon` is installed but deliberately unused — stories use `@mswjs/data` directly instead.

### W4. `log.md` references 6 flows in Initial Ingest entry but only 3 survive
- **Affected**: `log.md` line 84 and `sources/Initial Ingest.md` line 45
- **Problem**: Both pages state "6 flows" were created at ingest (`Auth Flow`, `Theme Flow`, `Language Flow`, `Form Submit Flow` — but that's only 4 listed; Auth Flow was then deleted). The count claim is now wrong.
- **Suggested fix**: `Initial Ingest.md` line 45 says "6 flows" — should be updated to note that Auth Flow was subsequently deleted.

---

## Suggestions (worth considering)

### S1. `index.md` does not include `wiki/meta/` directory
- **Affected**: `wiki/index.md`
- **Problem**: The `meta/` subdirectory is documented in `CLAUDE.md`'s structure table but has no entry in `index.md`. Now that this lint report exists, `index.md` should gain a `## Meta` section listing lint reports.
- **Suggested fix**: Add `## Meta` section with `- [[lint-report-2026-04-21]]`.

### S2. `Conform` page references `@conform-to/zod/v4` subpath but links to `[[Coding Guidelines]]` for the rule
- **Affected**: `dependencies/Conform.md`
- **Problem**: The `[[Coding Guidelines]]` page is now a one-line pointer stub. The actual Conform/Zod v4 import rule lives in `.claude/rules/coding-guidelines.md` but that specific detail was in the old full-text page. Worth verifying the rule file explicitly documents the `/v4` subpath.
- **Suggested fix**: Check `.claude/rules/coding-guidelines.md` — if the `/v4` subpath rule is there, no action needed. If not, add it.

### S3. `log.md` Initial Ingest entry lists `[[Claude Skills]]` but that page was created post-ingest
- **Affected**: `log.md` line 88
- **Problem**: The Initial Ingest concepts list includes `[[Claude Skills]]` and `[[Claude Hooks]]`, but these were added in the wiki-coherence hooks entry or later sessions, not the initial ingest. Minor historical inaccuracy.
- **Suggested fix**: Low priority — log is append-only history, acceptable to leave.

---

## Checks with clean results

- **Orphan pages**: None. All 73 pages have at least one inbound wikilink (excluding meta-exempt: index, hot, log, CLAUDE, overview, Initial Ingest).
- **Stale seed pages**: None. No pages have `status: seed`.
- **Pages over 300 lines**: None. All pages are within the recommended size limit.
- **Shrunk pointer pages**: All 9 compressed pages (Coding Guidelines, test-runner, Pre-commit Hooks, handoff command, pickup command, Chromatic Opt-Out, Claude Skills, Accessibility, PR Merge Workflow) have valid inbound links (2–7 each) and are not orphans.
- **Index staleness**: `wiki/index.md` has no stale entries pointing to deleted files. Auth Flow, remix-auth, VitePress, and things Service were already removed from the index.
