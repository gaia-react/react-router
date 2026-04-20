Provide a clean slate for the GAIA React project by removing example components, pages, and related files.

## Step 1: Gather user input

Ask the user two questions using AskUserQuestion with multiSelect where appropriate:

- What languages other than English to support (options: Japanese/ja, French/fr, Spanish/es, German/de, Other (comma-delimited list), None)
- Their GitHub username for CODEOWNERS (suggest @username format)
- The title of their project (default: "GAIA React App")

## Step 2: Delete files and folders

Run a single rm -rf command to delete all of these:

```
.github/FUNDING.yml .react-router/ .playwright/e2e/things.spec.ts .storybook/static/gaia-logo.png app/assets/images/gaia-logo.svg app/components/ExampleConsumer/ app/state/example.tsx app/pages/Public/Things/ app/pages/Public/IndexPage/Examples/ app/pages/Public/IndexPage/TechStack/ app/routes/_public+/things+/ app/services/gaia/things/ app/languages/en/pages/things.ts app/languages/ja/pages/things.ts test/mocks/things/
```

## Step 3: Update CODEOWNERS

Replace `.github/CODEOWNERS` contents with just the user's GitHub username.

## Step 4: Update source files

Read all these files in parallel, then edit them:

| File                                                       | Changes                                                                                                                                                                |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/state/index.tsx`                                      | Remove ExampleProvider import, remove `example` from StateProps and component props, remove ExampleProvider wrapper from JSX                                           |
| `app/pages/Session/Profile/ProfilePage/UserCard/index.tsx` | Remove ExampleConsumer import and `<ExampleConsumer />` from JSX                                                                                                       |
| `app/pages/Public/IndexPage/index.tsx`                     | Remove Examples, TechStack, GaiaLogo imports and from the JSX                                                                                                          |
| `app/services/gaia/index.server.ts`                        | Remove things import. Export only `{auth}`                                                                                                                             |
| `app/services/gaia/urls.ts`                                | Remove `things` and `thingsId` keys, keep only `login`                                                                                                                 |
| `app/languages/en/pages/index.ts`                          | Remove things import and export                                                                                                                                        |
| `app/languages/en/pages/_index.ts`                         | Remove `authExample`, `serviceExample`, and `techStack` keys (keep `meta` and `title`)                                                                                 |
| `test/mocks/index.ts`                                      | Remove things import. Set handlers to `[...auth]` only                                                                                                                 |
| `test/mocks/database.ts`                                   | Remove things import. Remove `things` from factory schema. Remove `things.deleteMany` and `things.data.forEach` from resetTestData                                     |
| `test/stubs/state-stub.tsx`                                | Remove StateDecoratorProps type. Simplify decorator to `() => (Story) => <State><Story /></State>`                                                                     |
| `.storybook/preview.ts`                                    | Remove brandImage import and BRAND constant. Remove `...BRAND` spread from darkMode.dark and darkMode.light. Update initialGlobals.locales to match selected languages |
| `app/languages/en/pages/_index.ts`                         | Update `meta.title` and `title` to the selected project title.                                                                                                         |

## Step 5: Configure languages

Note: By default, only `en` and `ja` folders exist in `app/languages/`.

Based on user's language selection:

1. **Delete unneeded folders**: If Japanese not selected, delete `app/languages/ja/`

2. **Create new language folders**: For any selected language that doesn't exist (fr, es, de), create folder structure mirroring `en/` (you do not need to ask permission to create these folders and files):

- `{lang}/index.ts` - same structure as en
- `{lang}/auth.ts` - translate values
- `{lang}/common.ts` - translate values
- `{lang}/errors.ts` - translate values
- `{lang}/pages/index.ts` - same structure as en
- `{lang}/pages/_index.ts` - translate values
- `{lang}/pages/legal.ts` - translate values
- `{lang}/pages/profile/index.tsx` - same as en
- `{lang}/pages/profile/_index.tsx` - translate meta.title only (keep fullName template as-is)

3. **Update language index**: Edit `app/languages/index.ts` to import/export only en + selected languages. Update LANGUAGES array and Language type.

4. **Update LanguageSelect**: Edit `app/components/LanguageSelect/index.tsx` OPTIONS array to include only selected languages with native labels (English, 日本語, Français, Español, Deutsch).

5. **Update Storybook**: Edit `.storybook/preview.ts` initialGlobals.locales to include only selected languages.

6. **Update Playwright Test**: Edit `.playwright/e2e/language-switch.spec.ts` with the selected languages.

## Step 6: Check .env file

If the `.env` file does not exist, rename `.env.example` to `.env`.

## Step 7: Update Project name

Update `package.json` "name" field to match the project title from step 1 in kebab-case.

Update `docs/.vitepress/config.ts` as follows:

- Update `base` to match the project title in kebab-case, i.e. `/project-name/`

## Step 8: Verify

Run these commands sequentially, stopping if any fails:

```bash
npm run typecheck && npm run test:ci && npm run lint && npm run build
```

## Step 9: Claude Configuration

If any of the following fail during installation or require the user to do it, provide the user with step-by-step instructions to run those manually.


### CLAUDE.md

Update CLAUDE.md "GAIA React Template" to project title using Title Case (e.g. "hello-world" becomes "Hello World")

### Install Skills

[React Doctor](https://github.com/millionco/react-doctor)

- `curl -fsSL https://react.doctor/install-skill.sh`

[Matt Pocock's TDD Skill](https://www.aihero.dev/skill-test-driven-development-claude-code)

- `npx skills add mattpocock/skills/tdd`

[Playwright CLI](https://github.com/microsoft/playwright-cli)

- `playwright-cli install --skills`

### Install Plugins

Run these via the Bash tool. If any fail, print the command so the user can run it manually.

typescript-lsp plugin

- `claude plugin install typescript-lsp@claude-plugins-official`

claude-obsidian plugin ([repo](https://github.com/AgriciDaniel/claude-obsidian))

- `claude plugin marketplace add AgriciDaniel/claude-obsidian`
- `claude plugin install claude-obsidian@claude-obsidian-marketplace`

### Update Code Review Audit Agent

Update .claude/agents/code-review-audit.md `{variables}` to match this project and operating system paths:

- `{project_directory}` (example: `/Users/username/Documents/projects/my-gaia-app`)
- The "Session transcript logs" path should be updated based on the OS and where the global .claude logs for this project are stored

## Step 10: Clean up Wiki

The `wiki/` folder references example code that is now deleted. Apply these changes so the vault matches the post-init project state. Do this **after** the claude-obsidian plugin install in Step 9 but before Complete. The claude-obsidian skills won't be active until after restart — do these as direct file edits, not via wiki-lint/wiki-ingest.

### 10a. Delete

- `wiki/modules/things Service.md` — entire page describes the deleted example service.

### 10b. Overwrite `wiki/hot.md`

Replace the entire file with (keep the HTML comment header, update the `updated:` date and body):

```md
---
type: meta
title: Hot Cache
updated: <TODAY_ISO>
---

# Recent Context

## Last Updated

<TODAY>. Project initialized via `/gaia-init`. Example scaffolding (things service, ExampleConsumer/Provider, IndexPage Examples + TechStack sections, GaiaLogo, Storybook BRAND) stripped. Clean slate.

## Active Threads

- None.
```

### 10c. Prepend to `wiki/log.md`

Insert a new entry directly below the `# Log` heading (log is append-only, newest on top):

```md
## [<TODAY>] /gaia-init | template cleanup

- Deleted page: [[things Service]]
- Updated to remove example-code references: [[index]], [[Services]], [[API Service Pattern]], [[Pages]], [[Components]], [[State]], [[Storybook]], [[Testing]], [[MSW]], [[i18n]], [[Playwright]], [[remix-flat-routes]]
- Rationale: `/gaia-init` removes the `things` service, `ExampleConsumer`, `ExampleProvider`, IndexPage `Examples`/`TechStack`, `gaia-logo.svg`, Storybook `BRAND`/`brandImage`, `StateDecoratorProps`, and associated i18n/MSW/Playwright fixtures.
```

### 10d. Per-file edits

| File | Change |
|---|---|
| `wiki/index.md` | Delete the line `- [[things Service]] — example domain service (stripped by /gaia-init)` from the Modules list. |
| `wiki/modules/Services.md` | (a) Delete the sentence `See [[things Service]] for the canonical reference implementation (slated for removal by /gaia-init).` (b) Delete the `things/` block (folder + 4 inner files) from the folder-layout code fence. (c) In the `GAIA_URLS` example, keep only `login: 'login'`. (d) Replace the `getThingById` request-function code example with: `// See /new-service for the full pattern.` |
| `wiki/modules/Pages.md` | In the `Public/` row of the Structure table, change `(e.g. IndexPage, Things)` to `(e.g. IndexPage)`. |
| `wiki/modules/Components.md` | Delete the `\| ExampleConsumer \| Example state-consumer (deleted by /gaia-init) \|` row from the Bundled components table. |
| `wiki/modules/State.md` | (a) In the JSX snippet, remove the `<ExampleProvider initialState={example}>...</ExampleProvider>` wrapper (keep `ThemeProvider > UserProvider`). (b) Delete the `ExampleProvider` row from the Bundled providers table. |
| `wiki/modules/Storybook.md` | In the `static/` row of the Setup files table, change `Static assets (e.g. \`gaia-logo.png\` brand image)` to `Static assets`. |
| `wiki/modules/Testing.md` | (a) In the `mocks/` row, change the list to `auth/, user/, ping.ts` (remove `things/`). (b) On the Playwright sample tests bullet, leave only `language-switch.spec.ts` (drop `things.spec.ts`). |
| `wiki/modules/MSW.md` | (a) Delete the `├── things/             # same shape` line from the folder-layout code fence. (b) Change `database.things.getAll()` to `database.user.getAll()`. |
| `wiki/modules/i18n.md` | Delete the `│       ├── things.ts` line from the folder-layout code fence. |
| `wiki/concepts/API Service Pattern.md` | (a) In the `GAIA_URLS` example, replace the `things`/`thingsId` keys with `resource: 'resource'` and `resourceId: 'resource/:id'`. (b) In the request-function example, rename `getThingById` → `getResourceById`, `Thing` → `Resource`, `thingSchema` → `resourceSchema`, `GAIA_URLS.thingsId` → `GAIA_URLS.resourceId`. (c) On the final Related line, remove `[[things Service]] for the canonical worked example,` so it reads `See [[Services]], [[MSW]].` |
| `wiki/dependencies/remix-flat-routes.md` | Change the example path `_public+/things+/$id.tsx` to `_public+/{resource}+/$id.tsx`. |
| `wiki/dependencies/Playwright.md` | Delete the `- \`things.spec.ts\` (deleted by /gaia-init)` bullet from the Sample tests list. |

## Step 11: Complete

1. Remove the gaia-init command from the project to prevent accidental re-runs.

2. Output: "GAIA React project is ready for development with a clean slate!"

3. Output: "Please restart Claude."
