import {includeIgnoreFile} from '@eslint/compat';
import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import {configs, plugins} from 'eslint-config-airbnb-extended';
import {rules as prettierConfigRules} from 'eslint-config-prettier';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import canonical from 'eslint-plugin-canonical';
import checkFile from 'eslint-plugin-check-file';
import eslintComments from 'eslint-plugin-eslint-comments';
import importX from 'eslint-plugin-import-x';
import jestDom from 'eslint-plugin-jest-dom';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import noSwitchStatements from 'eslint-plugin-no-switch-statements';
import perfectionist from 'eslint-plugin-perfectionist';
import playwright from 'eslint-plugin-playwright';
import preferArrow from 'eslint-plugin-prefer-arrow';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import sonarjs from 'eslint-plugin-sonarjs';
import storybook from 'eslint-plugin-storybook';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import lodashUnderscore from 'eslint-plugin-you-dont-need-lodash-underscore';
import tseslint from 'typescript-eslint';
import path from 'node:path';

export const projectRoot = path.resolve('.');

export const gitignorePath = path.resolve(projectRoot, '.gitignore');

const jsConfig = [
  // ESLint Recommended Rules
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  // Stylistic Plugin
  plugins.stylistic,
  // Airbnb Base Recommended Config
  ...configs.base.recommended,
  {
    name: 'you-dont-need-lodash-underscore',
    plugins: {
      'you-dont-need-lodash-underscore': lodashUnderscore,
    },
    rules: {
      'consistent-return': 'off',
      curly: ['error', 'all'],
      'max-params': 'error',
      'no-param-reassign': 'off', // handled by sonarjs
      'no-undef': 'off',
      'no-unused-vars': 'off', // handled by sonarjs
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    name: 'test-files/all',
    rules: {
      'guard-for-in': 'off',
      'max-params': 'off',
      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['.playwright/**/*.ts?(x)'],
    name: 'playwright/all',
    rules: {
      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
    },
  },
];

const reactConfig = [
  // React Plugin
  plugins.react,
  // React Hooks Plugin
  plugins.reactHooks,
  // React JSX A11y Plugin
  plugins.reactA11y,
  // Airbnb React Recommended Config
  ...configs.react.recommended,
  {
    name: 'react',
    plugins: {
      react,
    },
    rules: {
      'jsx-a11y/control-has-associated-label': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'react/boolean-prop-naming': [
        'error',
        {
          propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
          rule: '^((can|has|hide|is|show)[A-Z]([A-Za-z0-9]?)+|(checked|disabled|hide|required|show))',
        },
      ],
      'react/function-component-definition': 'off',
      'react/jsx-boolean-value': ['error', 'always'],
      'react/jsx-curly-brace-presence': 'error',
      'react/jsx-filename-extension': 'off',
      'react/jsx-fragments': 'error',
      // off by default because it doesn't handle props onXyz function names correctly
      // turn this on from time to time to check for misnamed handlers elsewhere
      'react/jsx-handler-names': ['off', {checkLocalVariables: true}],
      'react/jsx-newline': ['error', {prevent: true}],
      'react/jsx-no-useless-fragment': ['error', {allowExpressions: true}],
      'react/no-children-prop': 'off',
      'react/no-danger': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
    },
  },
  {
    files: ['**/routes/**/*.tsx'],
    name: 'react-router/routes',
    rules: {
      'no-empty-pattern': 'off',
      'react/display-name': 'off',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    name: 'react/test-files',
    rules: {
      'react/jsx-props-no-spreading': 'off',
    },
  },
  {
    files: ['app/?(components|hooks|pages|services|utils)/**/*.ts?(x)'],
    name: 'react/components',
    rules: {
      'max-lines': 'error',
    },
  },
];

const typescriptConfig = [
  // TypeScript ESLint Plugin
  plugins.typescriptEslint,
  // Airbnb Base TypeScript Config
  ...configs.base.typescript,
  // Airbnb React TypeScript Config
  ...configs.react.typescript,
  {
    files: ['./*.ts'],
    name: 'root-ts-files',
    rules: {
      'global-require': 'off',
      'no-void': 'off',
    },
  },
];

const tsEslintConfig = tseslint.config([
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    files: ['**/*.ts?(x)'],
    name: 'typescript/config',
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/array-type': ['error', {default: 'array'}],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {ignoreArrowShorthand: true},
      ],
      '@typescript-eslint/no-floating-promises': [
        'error',
        {ignoreIIFE: true, ignoreVoid: true},
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {checksVoidReturn: false},
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {allowBoolean: true, allowNumber: true},
      ],
      '@typescript-eslint/return-await': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['app/hooks/**/*', 'app/routes/**/*', 'app/sessions.server/**/*'],
    name: 'typescript/only-throw-error',
    rules: {
      '@typescript-eslint/only-throw-error': 'off',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    name: 'typescript/test-files',
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  {
    files: ['test/**/*.ts?(x)'],
    name: 'typescript/test-config',
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    name: 'typescript/type-definitions',
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]);

const prettierConfig = [
  // Prettier Plugin
  {
    name: 'prettier/plugin/config',
    plugins: {prettier},
  },
  // Prettier Config
  {
    name: 'prettier/config',
    rules: {
      ...prettierConfigRules,
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          next: ['block-like', 'export', 'return', 'throw'],
          prev: '*',
        },
      ],
      '@stylistic/quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: 'avoidEscape',
          avoidEscape: true,
        },
      ],
      '@stylistic/spaced-comment': 'off',
      'prettier/prettier': ['error', {endOfLine: 'auto'}],
    },
  },
];

const betterTailwindConfig = [
  {
    name: 'better-tailwindcss',
    plugins: {
      'better-tailwindcss': betterTailwind,
    },
    rules: {
      'better-tailwindcss/enforce-consistent-important-position': 'error',
      'better-tailwindcss/enforce-consistent-variable-syntax': 'error',
      'better-tailwindcss/enforce-shorthand-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-deprecated-classes': 'error',
      'better-tailwindcss/no-unregistered-classes': [
        'error',
        {ignore: ['plain-link', 'plain-table']},
      ],
    },
    settings: {
      'better-tailwindcss': {
        detectComponentClasses: true,
        entryPoint: './app/styles/tailwind.css',
      },
    },
  },
];

const canonicalConfig = [
  canonical.configs['flat/recommended'],
  {
    name: 'canonical',
    rules: {
      'canonical/destructuring-property-newline': 'off',
      'canonical/filename-match-exported': 'error',
      'canonical/id-match': 'off',
      'canonical/import-specifier-newline': 'off',
    },
  },
  {
    files: ['**/*.tsx', '**/hooks/*.ts?(x)'],
    name: 'canonical/sort-react-dependencies',
    rules: {
      'canonical/sort-react-dependencies': 'error',
    },
  },
  {
    files: [
      'app/root.tsx',
      'app/entry.server.tsx',
      'app/**/tests/*',
      'test/**/*.ts?(x)',
      '**/*.stories.tsx',
      '**/routes/**/*.tsx',
      '**/hooks/*.ts?(x)',
      '.storybook/**/*.ts?(x)',
      '.playwright/**/*.ts?(x)',
    ],
    name: 'canonical/filename-match-exported-disabled',
    rules: {
      'canonical/filename-match-exported': 'off',
    },
  },
];

const checkFileConfig = [
  {
    plugins: {
      'check-file': checkFile,
    },
  },
  {
    files: ['app/**/*'],
    name: 'check-file',
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          // React hook files must be camelCase (to match the hook name)
          '**/hooks/*.{ts,tsx}': 'CAMEL_CASE',
          'app/state/*.tsx': 'KEBAB_CASE',
          // React component files must be named index.tsx
          'app/{components,pages}/**/!(assets|hooks|state|tests|utils)/*.tsx':
            'index+()',
          // Generally, non-component files must be named kebab-case
          'app/{components,pages}/**/!(hooks)/*.ts': 'KEBAB_CASE',
          // Non-component files inside specific components folders must be kebab-case
          'app/{components,pages}/**/(assets|state|tests|utils)/*.{ts,tsx}':
            'KEBAB_CASE',
          'test/**/*.ts?(x)': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-match-with-fex': [
        'error',
        {
          // require stories and test files to be inside tests folders
          '*.(stories|test).{ts,tsx}': 'app/**/tests/',
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          // enforce PascalCase component folders, and allow assets, hooks, tests, and utils subfolders
          'app/components/**/':
            '(assets|hooks|state|tests|utils|[A-Z][a-zA-Z0-9]*)',
        },
      ],
    },
  },
  {
    files: ['test/**/*.*'],
    name: 'check-file/test-files',
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          'test/**/*.ts?(x)': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
];

const eslintCommentsConfig = [
  {
    name: 'eslint-comments',
    plugins: {
      'eslint-comments': eslintComments,
    },
    rules: {
      'eslint-comments/disable-enable-pair': 'off',
      'eslint-comments/no-unused-disable': 'error',
    },
  },
];

const importXConfig = [
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    name: 'import-x',
    rules: {
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import-x/extensions': 'off',
      'import-x/no-anonymous-default-export': [
        'error',
        {
          allowArray: true,
          allowLiteral: true,
          allowObject: true,
        },
      ],
      'import-x/no-rename-default': 'off',
      'import-x/no-useless-path-segments': 'off',
      'import-x/order': 'off',
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['./*.ts'],
    name: 'import-x/root-ts-files',
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unresolved': 'error',
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    name: 'import-x/test-files',
    rules: {
      'import-x/extensions': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
  {
    files: ['app/**/!(*.test|*.stories).ts?(x)'],
    name: 'import-x/app-test-files',
    rules: {
      'import-x/no-unresolved': 'error',
    },
  },
  {
    files: ['test/**/*.ts?(x)'],
    name: 'import-x/test-config-files',
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['.storybook/**/*.ts?(x)', '.playwright/**/*.ts?(x)'],
    name: 'import-x/storybook-playwright',
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unresolved': 'off',
    },
  },
];

const noRelativeImportPathsConfig = [
  {
    name: 'no-relative-import-paths',
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowedDepth: 1,
          allowSameFolder: true,
          prefix: '~',
          rootDir: 'app',
        },
      ],
    },
  },
];

const noSwitchStatementsConfig = [
  {
    name: 'no-switch-statements',
    plugins: {
      'no-switch-statements': noSwitchStatements,
    },
    ...noSwitchStatements.configs.recommended,
  },
];

const perfectionistConfig = [
  perfectionist.configs['recommended-natural'],
  {
    name: 'perfectionist',
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          customGroups: {
            type: {
              'react-other-type': ['^react-.+'],
              'react-type': ['^react$'],
            },
            value: {
              react: ['^react$'],
              'react-other': ['^react-.+'],
            },
          },
          groups: [
            'react-type',
            'react',
            'react-other-type',
            'react-other',
            ['external-type', 'external'],
            ['builtin-type', 'builtin'],
            ['internal-type', 'internal'],
            ['parent-type', 'parent'],
            ['sibling-type', 'sibling'],
            ['index-type', 'index'],
            ['object', 'unknown'],
            'style',
            'side-effect',
            'side-effect-style',
          ],
          newlinesBetween: 'never',
          type: 'natural',
        },
      ],
      'perfectionist/sort-jsx-props': [
        'error',
        {
          customGroups: {
            reserved: ['key', 'ref'],
          },
          groups: ['reserved'],
          type: 'natural',
        },
      ],
    },
  },
];

const playwrightConfig = [
  {
    name: 'playwright',
    ...playwright.configs['flat/recommended'],
    files: ['.playwright/**/*.ts?(x)'],
  },
];

const preferArrowConfig = [
  {
    name: 'prefer-arrow',
    plugins: {
      'prefer-arrow': preferArrow,
    },
    rules: {
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          classPropertiesAllowed: false,
          disallowPrototype: true,
          singleReturnOnly: false,
        },
      ],
    },
  },
  {
    files: ['**/*.d.ts'],
    name: 'ts-definition-files/prefer-arrow-off',
    rules: {
      'prefer-arrow/prefer-arrow-functions': 'off',
    },
  },
];

const sonarConfig = [
  sonarjs.configs.recommended,
  {
    name: 'sonarjs',
    rules: {
      'sonarjs/cognitive-complexity': 'error',
      'sonarjs/fixme-tag': 'off',
      'sonarjs/no-commented-code': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/no-selector-parameter': 'off',
      'sonarjs/regex-complexity': 'off',
      'sonarjs/todo-tag': 'off',
    },
  },
  {
    files: ['**/*.tsx', '**/hooks/*.ts?(x)'],
    name: 'sonarjs/react-files',
    rules: {
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/function-return-type': 'off',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    name: 'sonarjs/test-files',
    rules: {
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-identical-functions': 'off',
    },
  },
  {
    files: ['app/languages/**/*.ts', 'eslint.config.mjs'],
    name: 'sonarjs/credential-checks',
    rules: {
      'sonarjs/no-hardcoded-credentials': 'off',
      'sonarjs/no-hardcoded-passwords': 'off',
    },
  },
];

const storybookConfig = [...storybook.configs['flat/recommended']];

const testHarnessConfig = [
  {
    files: ['*.test.ts?(x)', '*.stories.ts?(x)', 'test/**/*.ts?(x)'],
    name: 'vitest',
    plugins: {
      'jest-dom': jestDom,
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
];

const unicornConfig = [
  unicorn.configs.recommended,
  {
    name: 'unicorn',
    rules: {
      'unicorn/consistent-destructuring': 'error',
      'unicorn/filename-case': 'off',
      'unicorn/new-for-builtins': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-export-from': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-set-has': 'off',
      'unicorn/prefer-switch': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          ignore: [
            'acc',
            'ctx',
            'e2e',
            'env',
            'obj',
            'prev',
            'req',
            'res',
            /args/i,
            /fn/i,
            /param/i,
            /params/i,
            /props/i,
            /ref/i,
            /src/i,
            /utils/i,
          ],
        },
      ],
      'unicorn/text-encoding-identifier-case': 'off',
    },
  },
  {
    files: ['./*.ts'],
    name: 'unicorn/root-ts-files',
    rules: {
      'unicorn/prefer-module': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
];

const unusedImportsConfig = [
  {
    name: 'unused-imports',
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'sonarjs/no-unused-vars': 'off',
      'sonarjs/unused-import': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.d.ts'],
    name: 'unused-imports/ts-definition-files',
    rules: {
      'unused-imports/no-unused-vars': 'off',
    },
  },
];

export default [
  // Ignore .gitignore files/folder in eslint
  includeIgnoreFile(gitignorePath),
  {
    ignores: [
      '!.storybook',
      '!.playwright',
      '/.react-router/**',
      'public/**',
      '**/*.css',
      '**/*.svg',
    ],
    name: 'ignored-files',
  },
  // Javascript Config
  ...jsConfig,
  // TypeScript Config
  ...typescriptConfig,
  ...tsEslintConfig,
  // React Config
  ...reactConfig,
  // Prettier Config
  ...prettierConfig,
  // Tailwind Config
  ...betterTailwindConfig,
  // Custom
  ...canonicalConfig,
  ...checkFileConfig,
  ...eslintCommentsConfig,
  ...importXConfig,
  ...noRelativeImportPathsConfig,
  ...noSwitchStatementsConfig,
  ...perfectionistConfig,
  ...playwrightConfig,
  ...preferArrowConfig,
  ...sonarConfig,
  ...storybookConfig,
  ...testHarnessConfig,
  ...unicornConfig,
  ...unusedImportsConfig,
];
