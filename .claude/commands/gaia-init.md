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

| File | Changes                                                                                                                                                                |
|------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `app/state/index.tsx` | Remove ExampleProvider import, remove `example` from StateProps and component props, remove ExampleProvider wrapper from JSX                                           |
| `app/pages/Session/Profile/ProfilePage/UserCard/index.tsx` | Remove ExampleConsumer import and `<ExampleConsumer />` from JSX                                                                                                       |
| `app/pages/Public/IndexPage/index.tsx` | Remove Examples, TechStack, GaiaLogo imports and from the JSX
| `app/services/gaia/index.server.ts` | Remove things import. Export only `{auth}`                                                                                                                             |
| `app/services/gaia/urls.ts` | Remove `things` and `thingsId` keys, keep only `login`                                                                                                                 |
| `app/languages/en/pages/index.ts` | Remove things import and export                                                                                                                                        |
| `app/languages/en/pages/_index.ts` | Remove `authExample`, `serviceExample`, and `techStack` keys (keep `meta` and `title`)                                                                                 |
| `test/mocks/index.ts` | Remove things import. Set handlers to `[...auth]` only                                                                                                                 |
| `test/mocks/database.ts` | Remove things import. Remove `things` from factory schema. Remove `things.deleteMany` and `things.data.forEach` from resetTestData                                     |
| `test/stubs/state-stub.tsx` | Remove StateDecoratorProps type. Simplify decorator to `() => (Story) => <State><Story /></State>`                                                                     |
| `.storybook/preview.ts` | Remove brandImage import and BRAND constant. Remove `...BRAND` spread from darkMode.dark and darkMode.light. Update initialGlobals.locales to match selected languages |
| `app/languages/en/pages/_index.ts` | Update `meta.title` and `title` to the selected project title.                                                                                                         |

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

5. **Update Playwright Test**: Edit `.playwright/e2e/language-switch.spec.ts` with the selected languages.

## Step 6: Verify

Run these commands sequentially, stopping if any fails:
```bash
npm run typecheck && npm run test:ci && npm run lint && npm run build
```

## Step 7: Complete

1. Remove the gaia-init command from the project to prevent accidental re-runs.

2. Output: "GAIA React project is ready for development with a clean slate!"

3. Output: "Please restart Claude."
 
