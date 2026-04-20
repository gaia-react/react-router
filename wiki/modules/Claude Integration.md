---
type: module
path: .claude/
status: active
purpose: Claude Code integration — commands, rules, hooks, agents, skills
created: 2026-04-20
updated: 2026-04-20
tags: [module, claude, hooks]
---

# Claude Integration

GAIA ships with [Claude Code](https://claude.ai/) support out of the box. Everything in `.claude/` is checked in and shared with the team.

## Layout

```
.claude/
├── settings.json          # PreToolUse hooks, env, enabled plugins
├── settings.local.json    # personal overrides (gitignored)
├── agents/                # subagent definitions (code-review-audit)
├── agent-memory/          # persistent agent memory (versioned)
├── commands/              # slash commands
├── hooks/                 # bash hooks for PreToolUse events
├── rules/                 # auto-applied coding rules
└── skills/                # invocable skills
```

## Commands (slash)

| Command            | What it does                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `/gaia-init`            | Rename + strip GAIA branding + configure languages + install Claude toolchain (run once)                  |
| `/new-route`            | Scaffold a route + page + tests + i18n                                                                    |
| `/new-component`        | Scaffold a component with optional test + story                                                           |
| `/new-service`          | Scaffold an API service + Zod + URL constants + MSW mocks                                                 |
| `/new-hook`             | Scaffold a custom hook + test                                                                             |
| `/audit-code`           | Run the full [[Quality Gate]]                                                                             |
| `/audit-knowledge`      | Audit memory + wiki + auto-loaded files for dupes, stale entries, and bloat ([[audit-knowledge command]]) |
| `/migrate`              | Upgrade a package to latest, apply breaking changes, run audit                                            |
| `/handoff`              | Generate a session handoff doc at `.claude/handoff/HANDOFF-{date}-{slug}.md` ([[handoff command]])        |
| `/pickup`               | Resume from the latest handoff; falls back to `wiki/hot.md` ([[pickup command]])                          |
| `/setup-chromatic-mcp`  | Install + register the Chromatic MCP so Claude can query Storybook + visual-regression diffs              |

See individual rules for the patterns each command produces.

## Rules

Rules activate automatically based on file paths — no need to invoke them.

| Rule                         | Applies to                                              |
| ---------------------------- | ------------------------------------------------------- |
| [[Coding Guidelines]]        | All code                                                |
| [[Component Testing]]        | `app/**/tests/**`, `test/**`                            |
| `new-route.md` ([[Routing]]) | `app/routes/**`, `app/pages/**`                         |
| [[API Service Pattern]]      | `app/services/**`, `test/mocks/**`                      |
| `i18n.md` ([[i18n]])         | `app/pages/**`, `app/components/**`, `app/languages/**` |
| [[Accessibility]]            | `app/components/**`, `app/pages/**`                     |
| [[ESLint Fixes]]             | ESLint-related files                                    |
| [[test-runner]]              | Test files                                              |
| [[Quality Gate]]             | Commits                                                 |
| [[PR Merge Workflow]]        | PR merges                                               |

## Hooks

Bash hooks wired through `.claude/settings.json`. Mixed event types.

### PreToolUse (Edit/Write)

| Hook                               | Type         | Behavior                                                                                   |
| ---------------------------------- | ------------ | ------------------------------------------------------------------------------------------ |
| `block-eslint-config-edit.sh`      | **Blocking** | Prevents modifying `eslint.config.mjs` to fix lint errors. Fix the source, not the config. |
| `block-vitest-globals-tsconfig.sh` | **Blocking** | Prevents adding `vitest/globals` to `tsconfig.json`. Use explicit imports.                 |
| `check-i18n-strings.sh`            | Advisory     | Reminds to use `t()` for user-facing strings in pages/components                           |
| `check-story-exists.sh`            | Advisory     | Reminds to add a Storybook story for new components                                        |

### UserPromptSubmit

| Hook                | Behavior                                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `intercept-init.sh` | Blocks the built-in `/init` and auto-invokes the `/gaia-init` skill instead. Protects the curated `CLAUDE.md` from overwrite. Removes itself (hook + settings entry) when `/gaia-init` completes. |

### SessionStart / Stop (wiki coherence)

Pair of hooks that compensates for a gap in the [[claude-obsidian]] plugin: its `PostToolUse` hook auto-commits `wiki/` changes, so by Stop time the plugin's own diff-check against HEAD is always empty and its `wiki/hot.md` refresh prompt never fires.

| Hook                    | Event        | Behavior                                                                                                                                                            |
| ----------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wiki-session-start.sh` | SessionStart | Writes current HEAD SHA to `.git/claude-session-start` as a session marker.                                                                                         |
| `wiki-session-stop.sh`  | Stop         | If commits between the marker and HEAD touched `wiki/`, emits a `WIKI_CHANGED:` prompt and advances the marker. Silently resets on unreachable SHAs (rebase/reset). |

## Agents

### [[Code Review Audit Agent]]

Runs automatically before every PR merge (per [[PR Merge Workflow]]). Reviews:

- Security vulnerabilities (auth, injection, data exposure)
- Performance (N+1, re-renders, bundle size)
- Code smells & anti-patterns
- Architectural concerns
- Robustness & edge cases
- Maintainability

Pre-seeded with GAIA's architecture knowledge. Persistent memory in `.claude/agent-memory/code-review-audit/MEMORY.md`.

After its own review, it spawns 3 parallel specialist subagents to audit changed `.ts/.tsx` files against:

1. React patterns
2. TypeScript & architecture
3. Translation rules

## Skills

`.claude/skills/`:

| Skill              | Use                           |
| ------------------ | ----------------------------- |
| `react-code`       | React component/hook patterns |
| `typescript`       | TypeScript conventions        |
| `tailwind`         | Tailwind class conventions    |
| `skeleton-loaders` | Pixel-perfect loading states  |

These activate automatically based on context.

## settings.json

Registers the four hooks above on `Edit|Write` matchers. Enables `typescript-lsp@claude-plugins-official` plugin.
