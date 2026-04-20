---
type: dependency
status: active
package: chromatic
version: ^16.3.0
role: visual-regression
created: 2026-04-20
updated: 2026-04-20
tags: [dependency, testing, visual, mcp]
---

# Chromatic

Visual regression service that consumes Storybook stories. Runs in CI via `.github/workflows/chromatic.yml`.

- `npm run chromatic` — uploads stories
- `CHROMATIC_PROJECT_TOKEN` — env var on CI
- `--auto-accept-changes 'main'` — auto-accept baseline shifts on `main`
- `--only-changed`, `--exit-zero-on-changes` — efficient PR runs

## Chromatic MCP (Claude integration)

Chromatic ships an MCP (Model Context Protocol) server that lets Claude read component documentation straight from Storybook, inspect visual snapshots, and reason about regressions. Storybook 10.3+ and a Chromatic account required — Storybook version is already satisfied in this template.

### Setup

Run `/setup-chromatic-mcp` at any time — from `/gaia-init` or later. It's idempotent, handles both first-time install and re-registration, and prompts for scope + URL.

The `/setup-chromatic-mcp` skill handles the full install (`@storybook/addon-mcp` + `mcp-add`). `--scope project` writes to `.mcp.json` (shared); `--scope user` writes to `~/.claude/mcp.json` (local). First connection prompts Chromatic sign-in in the browser.

Once registered, Claude can:

- Query components via `list-all-documentation` across this project's Storybook
- Fetch stories, props, and MDX docs on demand without re-reading source code
- (With local dev server running) invoke development + testing tools

### Team-wide MCP (optional)

Publish the MCP to Chromatic for team access:

- Deploy Storybook to Chromatic — any default-branch permalink becomes the stable MCP URL
- Contributors use `--url https://<your-project>.chromatic.com/mcp` instead of `localhost`
- Compose multiple Storybooks via `refs` in `.storybook/main.ts` to expose one merged MCP

### Typical Claude workflows

- **Before writing a component**: Claude queries Chromatic MCP for existing analogous components so new work matches established patterns
- **During review**: Chromatic flags visual diffs on a PR; Claude reads the diff, inspects the story, proposes a fix if the regression is unintentional
- **Refactor safety**: Claude compares pre/post snapshots on an in-flight branch before committing

## Opt-out

If you don't want Chromatic, see [[Chromatic Opt-Out]].
