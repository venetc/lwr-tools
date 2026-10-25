import { defineConfig, devices } from '@playwright/test';

/**
 * Port of the server the end-to-end tests run against. A server already listening on it is used as is: start
 * `npx vite --port 5199` to test the code being edited without a build.
 */
const PORT = 5199;

export default defineConfig({
  testDir: './src/tests/e2e',
  testMatch: '**/*.test.ts',
  fullyParallel: true,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'desktop',
      grepInvert: /@phone/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },
    {
      name: 'phone',
      grepInvert: /@desktop/,
      use: {
        ...devices['iPhone 16'],
        viewport: { width: 393, height: 852 },
      },
    },
  ],
  webServer: {
    command: `npx vite build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
  },
});
