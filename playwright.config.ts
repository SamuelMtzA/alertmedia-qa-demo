import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 3,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15000,
  },

  timeout: 60000,

  projects: [
    {
      name: 'ui',
      use: {
        browserName: 'chromium',
        baseURL: 'https://opensource-demo.orangehrmlive.com',
      },
      testMatch: /ui\.spec\.ts/,
    },
    {
      name: 'api',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
      testMatch: /api\.spec\.ts/,
    },
    {
      name: 'a11y',
      use: {
        browserName: 'chromium',
        baseURL: 'https://opensource-demo.orangehrmlive.com',
      },
      testMatch: /accessibility\.spec\.ts/,
    },
    {
      name: 'cms',
      use: {
        browserName: 'chromium',
        baseURL: 'https://demo.dotcms.com',
      },
      testMatch: /cms\.spec\.ts/,
    },
  ],
});
