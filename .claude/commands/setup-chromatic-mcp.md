Install and register the Chromatic MCP server so Claude can query Storybook components, props, and visual-regression diffs directly.

Run this per project — and once per contributor machine, since MCP registration is machine-local.

Idempotent: safe to re-run if something failed mid-install or a new contributor is setting up the MCP for the first time.

## Prerequisites

- **Chromatic account** (free for open source): https://www.chromatic.com/start
- **Storybook 10.3+** (GAIA ships with 10.3.5; nothing to do here)

If the user doesn't have a Chromatic account, stop and tell them to create one at https://www.chromatic.com/start, then re-run `/setup-chromatic-mcp` when ready.

## Step 1: Check current state

Read `package.json` — is `@storybook/addon-mcp` already in `devDependencies`? Read `.storybook/main.ts` — is the addon already registered in the `addons` array?

- If both yes → skip to Step 3 (registration)
- If either no → proceed to Step 2

Also check if `.mcp.json` already has a `storybook` / `chromatic` MCP entry — if yes, tell the user "Chromatic MCP is already registered at the project scope. If you want to re-register or change scope, delete the entry and re-run this command." and stop.

## Step 2: Install the Storybook addon

Run:

```bash
npx storybook add @storybook/addon-mcp
```

This adds `@storybook/addon-mcp` to `devDependencies`, updates `.storybook/main.ts`, and installs dependencies. If it fails, print the command so the user can run it manually.

## Step 3: Register the MCP with Claude Code

Ask the user using AskUserQuestion:

- **Scope**: `project` (shared via `.mcp.json` in the repo — recommended for teams) or `user` (personal, `~/.claude/mcp.json`). Default: `project`.
- **URL**: `http://localhost:6006/mcp` (default — local dev Storybook) or a custom Chromatic permalink if they've already deployed their Storybook. Default: `http://localhost:6006/mcp`.

Then run:

```bash
npx mcp-add --type http --url "<URL>" \
  --client-id "cdf3737dff9d485485968e50b63fd8b4" \
  --scope <SCOPE>
```

The client ID is Chromatic's **static OAuth application identifier for Claude Code** — not a per-user secret. Published at https://www.chromatic.com/docs/mcp/.

On first connection, Claude will prompt Chromatic sign-in. The user completes that flow in their browser.

## Step 4: Verify

If the MCP registered successfully, `.mcp.json` (project scope) or `~/.claude/mcp.json` (user scope) now contains a `storybook` / `chromatic` entry.

Tell the user:

- "Chromatic MCP is registered at <SCOPE> scope against <URL>."
- "Start Storybook with `npm run storybook` and restart Claude Code to activate the MCP."
- "Claude can now query `list-all-documentation`, fetch component docs, and inspect visual-regression diffs once Storybook is running."

## Step 5: Team-wide tip (optional nudge)

If the user chose `project` scope with the default `localhost` URL, mention once:

> For team access without each contributor running Storybook locally, deploy to Chromatic and swap the URL to your project's default-branch permalink (e.g. `https://<project>.chromatic.com/mcp`). See `wiki/dependencies/Chromatic.md`.

## Troubleshooting

- **`npx storybook add` fails**: run `npx storybook upgrade` first, then retry.
- **`npx mcp-add` "command not found"**: the `mcp-add` CLI ships via Chromatic's npm package; `npx` fetches it on demand — no global install needed. Confirm network access + npm registry reachability.
- **MCP not appearing in Claude Code after restart**: verify the MCP entry in `.mcp.json` / `~/.claude/mcp.json` and check Claude Code's MCP connection log (`/mcp` in Claude Code).
