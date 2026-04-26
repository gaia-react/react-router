Initialize a new project from the GAIA React template. The template already ships clean (no example code, no docs site, no auth). This command renames, strips GAIA-specific branding, configures i18n, installs Claude skills/plugins, and hands you a ready-to-build project.

## Step 0: Ensure pnpm is available

Tell the user: "Checking for pnpm…" then run:

```bash
if command -v corepack &>/dev/null; then
  corepack enable pnpm
else
  npm install -g pnpm
fi
```

If this fails, stop and report the error. `corepack enable pnpm` installs the pnpm version pinned in the `packageManager` field of `package.json`. If corepack is unavailable, fall back to a global npm install.

## Step 1: Install dependencies

The project was just created from the template — `node_modules/` does not exist yet. Install before doing anything else so later steps (typecheck, tests, build) can run.

Tell the user: "Installing dependencies — this may take a minute…" then run:

```bash
pnpm install
```

If install fails, stop and report the error. Do not continue.

## Step 2: Gather user input

Ask the user using AskUserQuestion (multiSelect where appropriate):

- What languages other than English to support (options: Japanese/ja, French/fr, Spanish/es, German/de, Other (comma-delimited list), None)
- Their GitHub username for CODEOWNERS (suggest `@username` format)
- The title of their project (default: "GAIA React App")

## Step 3: Strip GAIA-specific branding

Run in one shell:

```bash
rm -rf .github/FUNDING.yml .storybook/static/gaia-logo.png app/assets/images/gaia-logo.svg app/components/GaiaLogo
```

Then edit `app/components/Header/index.tsx`:

- Remove the `GaiaLogo` import
- Replace `<GaiaLogo className="h-7 sm:h-9" role="img" />` with a text wordmark: `<span className="text-body text-xl font-bold">{t('meta.siteName')}</span>`

Then edit `.storybook/preview.ts`:

- Remove the `brandImage` import (if any)
- Remove the `BRAND` constant (if any)
- Remove any `...BRAND` spreads from `darkMode.dark` and `darkMode.light`

## Step 4: Update CODEOWNERS

Replace `.github/CODEOWNERS` contents with just the user's GitHub username (the whole file becomes a single line like `* @username`).

## Step 5: Configure languages

Note: by default only `en` and `ja` folders exist in `app/languages/`.

1. **Delete unneeded folders**: if Japanese not selected, `rm -rf app/languages/ja/`.
2. **Create new language folders**: for any selected language that doesn't exist (fr, es, de, etc.), mirror `app/languages/en/`:
   - `{lang}/index.ts` — same structure as en
   - `{lang}/common.ts` — translate values
   - `{lang}/errors.ts` — translate values
   - `{lang}/pages/index.ts` — same structure as en
   - `{lang}/pages/_index.ts` — translate values
   - `{lang}/pages/legal.ts` — translate values
3. **Update `app/languages/index.ts`**: import/export only `en` + selected languages. Update LANGUAGES array and Language type.
4. **Update `app/components/LanguageSelect/index.tsx`**: OPTIONS array to include only selected languages with native labels (English, 日本語, Français, Español, Deutsch).
5. **Update `.storybook/preview.ts`**: `initialGlobals.locales` to include only selected languages.
6. **Update `.playwright/e2e/language-switch.spec.ts`**: with the selected languages.

## Step 6: Rename the project

Use the project title from Step 2.

- `package.json` `"name"` field → kebab-case of project title (e.g. `"hello-world"`)
- `CLAUDE.md` — replace the `# GAIA React Template` heading with `# <Project Title>` (Title Case, e.g. `# Hello World`)
- `app/languages/en/pages/_index.ts` — update `meta.title`, `title`, and `heroTitle` to the project title
- `app/languages/en/common.ts` — update `meta.siteName` to the project title
- Do the same for every other `app/languages/<lang>/pages/_index.ts` and `common.ts` file (translate the title if appropriate, otherwise use the English project title)

## Step 7: Check `.env`

If a `.env` file does not exist, rename `.env.example` to `.env`. If `.env` already exists, leave it.

## Step 8: Verify the build

Run sequentially, stopping at the first failure:

```bash
pnpm typecheck && pnpm lint && pnpm test:ci && pnpm build
```

Fix any issues before moving on.

## Step 9: Claude configuration

If any install step fails, print the command so the user can run it manually.

### Install tools

GAIA bundles `tdd` and `playwright-cli` skills at `.claude/skills/` — they ship with the clone. Two external tools still need per-machine setup:

- [React Doctor](https://github.com/millionco/react-doctor): `curl -fsSL https://react.doctor/install-skill.sh | bash`
  Installs the `react-doctor` skill to `~/.claude/skills/`. Scans the project for React-specific issues (47+ rules: security, performance, correctness, architecture). Auto-runs after code edits in a `CLAUDECODE` environment and is invoked by the `code-review-audit` agent pre-merge.
- [Playwright CLI](https://github.com/microsoft/playwright-cli) binary: `npm install -g @playwright/cli@latest`
  Installs the global `playwright-cli` binary the bundled skill shells out to. Without it the skill's `allowed-tools: Bash(playwright-cli:*)` directive resolves to nothing. Used for E2E debugging and authoring Playwright specs with minimal token cost — each interaction is one shell call instead of a round-trip through an MCP session.

### Install plugins

- `claude plugin install typescript-lsp@claude-plugins-official`
- `claude plugin marketplace add AgriciDaniel/claude-obsidian`
- `claude plugin install claude-obsidian@claude-obsidian-marketplace`

## Step 10: Refresh the wiki

The template ships with a wiki shaped for the upstream GAIA project. Refresh the two files that encode "where we are right now" so the new project starts with a clean context:

### 9a. Overwrite `wiki/hot.md`

Replace the entire file with:

```md
---
type: meta
title: Hot Cache
updated: <TODAY_ISO>
---

# Recent Context

## Last Updated

<TODAY>. Project initialized via `/gaia-init`. Fresh slate.

## Active Threads

- None.
```

### 9b. Prepend an entry to `wiki/log.md`

Insert directly below the `# Log` heading (log is append-only, newest on top):

```md
## [<TODAY>] /gaia-init | project initialized

- Project name: <PROJECT_TITLE>
- Languages: en + <OTHER_LANGS>
- Removed: GAIA branding (FUNDING.yml, gaia-logo.svg/png, GaiaLogo component, Storybook BRAND)
- Installed: React Doctor, TDD, Playwright CLI skills; typescript-lsp, claude-obsidian plugins
```

## Step 11: Complete

1. Remove the `/init` interceptor — it protects the template's curated `CLAUDE.md` and is no longer needed once a project has been initialized:
   - Delete `.claude/hooks/intercept-init.sh`
   - Edit `.claude/settings.json`: from `hooks.UserPromptSubmit`, remove only the matcher entry whose inner `hooks[].command` is `.claude/hooks/intercept-init.sh`. Preserve any other entries the user may have added. If removing it leaves `UserPromptSubmit` as an empty array, also remove the `UserPromptSubmit` key itself.
2. Delete this command file so it can't be run again: `rm .claude/commands/gaia-init.md`
3. Output: "<Project Title> is ready for development. Restart Claude to pick up the new plugin and skill state."
