// themes.spec.ts — full-page visual regression of every theme landing
// page, per docs/dev/phase-2-testing.md section 2.3. Iterates the
// committed registry snapshot's themes[], so a new theme is covered the
// moment it's registered.
//
// video/canvas/external-img masking mirrors showcase.spec.ts — see that
// file's header for why. 11 of 18 theme *.data.ts files use external
// photography (picsum.photos, unsplash, pravatar, ...) for illustrative
// product/property/avatar imagery; a self-consistency run (this suite
// against its own just-generated baselines) flaked on real-estate's hero
// and card images for exactly that reason.

import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../..');
const registry = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'public/registry/components.index.json'), 'utf8')
);

const themes: { id: string; route: string }[] = registry.themes;
const MASK_SELECTOR = 'video, canvas, img[src^="http"], .leaflet-container';

test.describe('theme landing pages', () => {
  for (const theme of themes) {
    test(theme.id, async ({ page }) => {
      await page.goto(theme.route);
      await expect(page).toHaveScreenshot(`${theme.id}.png`, {
        fullPage: true,
        mask: [page.locator(MASK_SELECTOR)],
      });
    });
  }
});
