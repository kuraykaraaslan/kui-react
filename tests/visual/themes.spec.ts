// themes.spec.ts — full-page visual regression of every theme landing
// page, per docs/dev/phase-2-testing.md section 2.3. Iterates the
// committed registry snapshot's themes[], so a new theme is covered the
// moment it's registered.
//
// Masking, axe-core integration, and the ratcheted rules (color-contrast,
// scrollable-region-focusable, aria-prohibited-attr, aria-command-name,
// aria-required-parent, aria-required-children) all mirror
// showcase.spec.ts — see that file's header for the ~25 fixes this drove
// and why each ratcheted rule is ratcheted rather than fixed here.

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../..');
const registry = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'public/registry/components.index.json'), 'utf8')
);

const themes: { id: string; route: string }[] = registry.themes;
const MASK_SELECTOR = 'video, canvas, img[src^="http"], .leaflet-container';

const RATCHETED_RULES = [
  'color-contrast',
  'scrollable-region-focusable',
  'aria-prohibited-attr',
  'aria-command-name',
  'aria-required-parent',
  'aria-required-children',
];
const ratchetedViolationCounts: Record<string, number> = Object.fromEntries(
  RATCHETED_RULES.map((id) => [id, 0]),
);

test.describe('theme landing pages', () => {
  for (const theme of themes) {
    test(theme.id, async ({ page }) => {
      await page.goto(theme.route);
      await expect(page).toHaveScreenshot(`${theme.id}.png`, {
        fullPage: true,
        mask: [page.locator(MASK_SELECTOR)],
      });

      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');

      for (const rule of RATCHETED_RULES) {
        ratchetedViolationCounts[rule] += bad
          .filter((v) => v.id === rule)
          .reduce((sum, v) => sum + v.nodes.length, 0);
      }

      const strict = bad.filter((v) => !RATCHETED_RULES.includes(v.id));
      const details = strict
        .map((v) => `  [${v.impact}] ${v.id} (${v.nodes.length} nodes) — ${v.help}`)
        .join('\n');
      expect(strict, `axe found serious/critical violations on ${theme.route}:\n${details}`).toHaveLength(0);
    });
  }

  test('does not regress past the ratcheted a11y baselines', () => {
    const BASELINES: Record<string, number> = {
      'color-contrast': 600,
      'scrollable-region-focusable': 25,
      'aria-prohibited-attr': 15,
      'aria-command-name': 10,
      'aria-required-parent': 10,
      'aria-required-children': 10,
    };
    for (const rule of RATCHETED_RULES) {
      expect(
        ratchetedViolationCounts[rule],
        `${rule}: ${ratchetedViolationCounts[rule]} > baseline ${BASELINES[rule]}`,
      ).toBeLessThanOrEqual(BASELINES[rule]);
    }
  });
});
