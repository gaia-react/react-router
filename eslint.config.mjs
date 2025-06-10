import {includeIgnoreFile} from '@eslint/compat';
import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import {configs, plugins} from 'eslint-config-airbnb-extended';
import {rules as prettierConfigRules} from 'eslint-config-prettier';
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
    plugins: {
      'you-dont-need-lodash-underscore': lodashUnderscore,
    },
    rules: {
      '@stylistic/quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: false,
          avoidEscape: true,
        },
      ],
      '@stylistic/spaced-comment': 'off',
      'consistent-return': 'off',
      curly: ['error', 'all'],
      'max-params': ['error'],
      'no-param-reassign': 'off', // handled by sonarjs
      'no-undef': 'off',
      'no-unused-vars': 'off', // handled by sonarjs
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    rules: {
      'guard-for-in': 'off',
      'max-params': 'off',
      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['.playwright/**/*.ts?(x)'],
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
    plugins: {
      react,
    },
    rules: {
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
      'react/jsx-filename-extension': 'off',
      // off by default because it doesn't handle props onXyz function names correctly
      // turn this on from time to time to check for misnamed handlers elsewhere
      'react/jsx-handler-names': ['off', {checkLocalVariables: true}],
      'react/jsx-newline': ['error', {prevent: true}],
      'react/no-danger': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
    },
  },
  {
    files: ['**/routes/**/*.tsx'],
    rules: {
      'no-empty-pattern': 'off',
      'react/display-name': 'off',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    rules: {
      'react/jsx-props-no-spreading': 'off',
    },
  },
  {
    files: ['app/?(components|hooks|pages|services|utils)/**/*.ts?(x)'],
    rules: {
      'max-lines': ['error', 200],
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
    rules: {
      'global-require': 'off',
      'no-void': 'off',
    },
  },
];

const tsEslintConfig = tseslint.config([
  {
    files: ['**/*.ts?(x)'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/array-type': ['error', {default: 'array'}],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': ['error'],
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  {
    files: ['app/hooks/**/*', 'app/routes/**/*', 'app/sessions.server/**/*'],
    rules: {
      '@typescript-eslint/only-throw-error': 'off',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['test/**/*.ts?(x)'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
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
      'prettier/prettier': 'error',
    },
  },
];

const canonicalConfig = [
  canonical.configs['flat/recommended'],
  {
    rules: {
      'canonical/destructuring-property-newline': 'off',
      'canonical/id-match': 'off',
      'canonical/import-specifier-newline': 'off',
    },
  },
  {
    files: ['**/*.tsx', '**/hooks/*.ts?(x)'],
    rules: {
      'canonical/filename-match-exported': 'error',
      'canonical/sort-react-dependencies': 'error',
    },
  },
  {
    files: ['**/routes/**/*.tsx'],
    rules: {
      'canonical/filename-match-exported': 'off',
    },
  },
  {
    files: ['.storybook/**/*.ts?(x)'],
    rules: {
      'canonical/filename-match-exported': 'off',
    },
  },
  {
    files: [
      '**/*.stories.tsx',
      'app/root.tsx',
      'app/entry.server.tsx',
      'test/**/*.ts?(x)',
    ],
    rules: {
      'canonical/filename-match-exported': 'off',
    },
  },
  {
    files: ['.playwright/**/*.ts?(x)'],
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
    files: ['app/**/*.*'],
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
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unresolved': 'error',
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    rules: {
      'import-x/extensions': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
  {
    files: ['app/**/!(*.test|*.stories).ts?(x)'],
    rules: {
      'import-x/no-unresolved': 'error',
    },
  },
  {
    files: ['test/**/*.ts?(x)'],
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['.storybook/**/*.ts?(x)'],
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unresolved': 'off',
    },
  },
  {
    files: ['.playwright/**/*.ts?(x)'],
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unresolved': 'off',
    },
  },
];

const noRelativeImportPathsConfig = [
  {
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
    plugins: {
      'no-switch-statements': noSwitchStatements,
    },
    ...noSwitchStatements.configs.recommended,
  },
];

const perfectionistConfig = [
  perfectionist.configs['recommended-natural'],
  {
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
    ...playwright.configs['flat/recommended'],
    files: ['.playwright/**/*.ts?(x)'],
  },
];

const preferArrowConfig = [
  {
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
    rules: {
      'prefer-arrow/prefer-arrow-functions': 'off',
    },
  },
];

const sonarConfig = [
  sonarjs.configs.recommended,
  {
    rules: {
      'sonarjs/cognitive-complexity': 'error',
      'sonarjs/fixme-tag': 'off',
      'sonarjs/no-commented-code': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/no-selector-parameter': 'off',
      'sonarjs/regex-complexity': 'off',
      'sonarjs/todo-tag': 'off',
    },
  },
  {
    files: ['**/*.tsx', '**/hooks/*.ts?(x)'],
    rules: {
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/function-return-type': 'off',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    rules: {
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-identical-functions': 'off',
    },
  },
  {
    files: ['app/languages/**/*.ts', 'eslint.config.mjs'],
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
    plugins: {
      'jest-dom': jestDom,
      vitest,
    },
  },
  {
    files: ['*.test.ts?(x)', '*.stories.ts?(x)'],
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
];

const unicornConfig = [
  unicorn.configs.recommended,
  {
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
    rules: {
      'unicorn/prefer-module': 'off',
      'unicorn/prevent-abbreviations': 'off',
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
  },
  // Javascript Config
  ...jsConfig,
  // React Config
  ...reactConfig,
  // TypeScript Config
  ...typescriptConfig,
  ...tsEslintConfig,
  // Prettier Config
  ...prettierConfig,
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
];
