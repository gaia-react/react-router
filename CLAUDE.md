# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GAIA React is a comprehensive template for building modern React web applications using React Router 7 with SSR enabled. It includes authentication, i18n, form handling, testing, and component documentation out of the box.

## Common Commands

### Development

- `npm run dev` - Start dev server (opens browser)
- `npm run storybook` - Start Storybook on port 6006
- `npm run docs` - Start VitePress documentation on port 5175

### Code Quality

- `npm run lint` - ESLint with auto-fix (no warnings allowed)
- `npm run typecheck` - React Router typegen + TypeScript compilation
- `npm run lint-all` - Complete quality check: typecheck + lint + format + stylelint

### Testing

- `npm run test` - Vitest watch mode
- `npm run test:ci` - CI mode (run once, with coverage)
- `npm run pw` - Playwright E2E tests
- `npm run pw-ui` - Playwright with interactive UI

### Build

- `npm run build` - Build for production
- `npm run start` - Run production build

## Architecture

### Directory Structure

```
/app
├── /components       # Reusable UI components (PascalCase folders)
├── /routes           # React Router file-based routes
│   ├── _auth+/       # Authentication routes
│   ├── _legal+/      # Legal pages
│   ├── _public+/     # Public pages
│   └── _session+/    # Session/user routes
├── /services         # API clients and business logic
├── /utils            # Shared utility functions
├── /hooks            # Custom React hooks
├── /state            # State management
├── /styles           # Tailwind CSS stylesheets
├── /languages        # i18n translation files
├── /types            # TypeScript type definitions
├── /pages            # Page components
├── /middleware       # Server middleware
└── /sessions.server  # Server-side session handling
```

### Key Technologies

- React 19 + React Router 7 (SSR enabled)
- TailwindCSS 4 for styling
- Zod for schema validation
- Conform for form management
- remix-auth for authentication
- i18next for internationalization
- MSW for API mocking

### Path Aliases

- `~/*` → `./app/*`
- `test` → `./test/*`

## Code Style Requirements

### File Naming Conventions

- **Components**: Must be in PascalCase folders with `index.tsx` as the main file and the component named after the folder
- **Hooks**: Must be camelCase (to match the hook name) with named export
- **Other files**: Must be kebab-case
- **Tests/Stories**: Must be inside `tests/` folders within components

### TypeScript Rules

- Use `type` keyword instead of `interface` (enforced)
- Use consistent type imports: `import type { Foo } from 'bar'`
- Arrays must use bracket notation: `string[]` not `Array<string>`
- Boolean props and variables must follow pattern: `^((can|has|hide|is|show)[A-Z]|checked|disabled|hide|required|show)`

### Import Rules

- React imports must come first
- Use absolute imports with `~` prefix for app imports
- Relative imports allowed only within same folder or two levels deep
- ESLint will automatically sort and group imports

### Code Patterns

- Arrow functions preferred over function declarations (enforced)
- No switch statements (use if/else or object maps)
- No TypeScript enums (use const objects with `as const`)
- JSX boolean props must use explicit `={true}` syntax (enforced)
- Max 3 function parameters (enforced)

### Testing

- Test files: `./app/**/tests/*.test.{ts,tsx}`
- Storybook files: `./app/**/tests/*.stories.tsx`
- Playwright tests: `./.playwright/e2e/*.spec.ts`
- Use vitest for unit tests

## Pre-commit Hooks

Husky runs on staged files:

1. TypeScript compilation check
2. ESLint + Prettier via lint-staged
3. Tests for changed files

## Environment Variables

Rename `.env.example` to `.env`:

```
SITE_URL=http://localhost:5173
SESSION_SECRET=local
API_URL=http://localhost:3001/api/
MSW_ENABLED=true
```

## Installing Packages

Dependencies should always be pinned to exact versions. Use the `-E` flag when installing packages. For example:

```
npm install <package-name> -E
```

## Documentation

You can reference the Vitepress documentation in @docs if you need more details on specific technologies and patterns used in this project.

Update the documentation and/or the CLAUDE.md file if you make changes to the architecture or replace any of the packages mentioned in the documentation.
