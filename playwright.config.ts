import { defineConfig, devices } from '@playwright/test';

// Visual regression + a11y config, per docs/dev/phase-2-testing.md 2.3/2.4.
//
// Runs against a production build (`next build && next start`), not
// `next dev` — dev compiles routes on demand, which would make the first
// visit to each of ~330 routes (315 components + 18 themes) pay a
// compilation tax and risk flaky timeouts under this suite's page-count.
//
// Only one project (Desktop / light) is wired up for now. Doubling to a
// dark project and/or a 400px-wide mobile project is real, valuable
// coverage the plan calls for, but doubles or quadruples the committed
// screenshot baseline size for each addition — deliberately deferred so
// the first baseline commit stays small enough to actually review.
export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  // CI gets an HTML report (browsable trace viewer) alongside the
  // terminal list; local runs stay list-only. See docs/dev/phase-2-testing.md
  // 2.5 — CI uploads playwright-report/ and test-results/ as artifacts
  // on failure, so a nightly/PR failure is debuggable without rerunning.
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  use: {
    baseURL: 'http://localhost:3002',
    // Retries are what 'on-first-retry' needs to ever produce a trace —
    // outside CI there are none, so no trace ever gets written for a
    // local failure investigated in the same run. CI always wants a
    // trace on every failed attempt, retried or not.
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop-light',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, colorScheme: 'light' },
    },
  ],
  webServer: {
    command: 'npm run build && npx next start --port 3002',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
