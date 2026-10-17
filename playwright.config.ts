import { defineConfig, devices } from '@playwright/test';

// Visual regression + a11y config, per docs/phases/02-testing.md 2.3/2.4.
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
  // terminal list; local runs stay list-only. See docs/phases/02-testing.md
  // 2.5 — CI uploads playwright-report/ and test-results/ as artifacts
  // on failure, so a nightly/PR failure is debuggable without rerunning.
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  // Comparison tolerances. The defaults (threshold 0.2, maxDiffPixelRatio
  // 0.02) let real regressions through: a swapped primary colour (blue
  // #3b82f6 vs purple #8b5cf6, close in luminance) is below a 0.2 per-pixel
  // YIQ threshold, and a misplaced pale panel or a recoloured button stays
  // under 2% of the image (both happened in kui-ejs's identical suite).
  // Measured on this suite (2026-10-17), with the browser clock fixed in the
  // specs: two consecutive full renders differ in no pixel at threshold 0.1
  // (only the RichTextEditor variants differ, below 0.1, by caret-level
  // shading). threshold 0.1 counts the colour swap; maxDiffPixelRatio
  // 0.0005 (0.05%) fails the smallest swapped-colour changes measured in
  // kui-ejs (0.11% of an image) with a 2x margin and leaves a little room
  // for anti-aliasing drift from a Chromium update. If a browser or font
  // update moves many baselines at once, regenerate them rather than
  // loosening these.
  expect: {
    toHaveScreenshot: { threshold: 0.1, maxDiffPixelRatio: 0.0005 },
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
