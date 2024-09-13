import {defineConfig, devices} from '@playwright/test';
import {config} from 'dotenv';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
config();

/**
 * You can change this to "true" this to test in multiple browsers if you prefer.
 * Testing multiple browsers can significantly increase test time on CI.
 * Recommend only testing multiple browsers locally.
 */
const TEST_ALL_BROWSERS = false;

const otherBrowsers =
  !process.env.CI && TEST_ALL_BROWSERS ?
    [
      {
        name: 'webkit',
        use: {...devices['Desktop Safari']},
      },
      {
        name: 'mozilla',
        use: {...devices['Desktop Firefox']},
      },
      {
        name: 'Mobile Chrome',
        use: {...devices['Pixel 7']},
      },
      {
        name: 'Mobile Safari',
        use: {...devices['iPhone 15']},
      },
    ]
  : [];

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Run tests in files in parallel
  fullyParallel: true,

  // the .gitignore file is configured to ignore this directory
  // if you change this, change it in .gitignore, as well
  outputDir: './.playwright/output',

  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    ...otherBrowsers,
  ],

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  // Once you have a lot of tests, you can change this to 'github' or 'dot' on CI
  reporter: 'list',

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  testDir: './.playwright/e2e',
  testMatch: '**/*.spec.ts',

  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://localhost:5173',

    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'retain-on-failure',
  },

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    // enable stdout pipe when you need to debug server-side logs
    //stdout: 'pipe',
    url: 'http://localhost:5173',
  },

  workers: process.env.CI ? 1 : undefined,
});
