// showcase.spec.ts — visual regression over every showcase component page,
// per docs/dev/phase-2-testing.md section 2.3. Iterates the committed
// registry snapshot rather than hand-listing components, so a new
// component is covered the moment its showcase entry ships.
//
// One page load per component (not per variant) screenshotting every
// `[data-variant-index]` container on it — ~315 page loads covering all
// ~739 variants, instead of 739 separate page loads.
//
// `video`, `canvas`, and external-URL `img` elements are masked out. All
// three were caught by running this suite against its own just-generated
// baselines and finding it wasn't self-consistent:
//   - VideoPlayer's showcase demo streams a real remote video
//     (https://placeholdervideo.dev/...), so how much of a frame has
//     decoded by screenshot time is a function of network timing.
//   - Every Chart.js-based component (bar/line/sparkline charts across
//     common, fintech, media, iot) renders into a `<canvas>` with a
//     requestAnimationFrame-driven mount animation that CSS-animation
//     disabling (which Playwright already applies) has no effect on, so
//     the captured frame lands at a different point in the animation each
//     run. `canvas` also covers the Three.js (lib-kui-viewer) component,
//     for the same class of GPU-timing nondeterminism.
//   - Several domain showcase entries (10+ *.showcase.tsx files) use plain
//     `<img>` tags pointing at picsum.photos/unsplash/pravatar/etc. for
//     illustrative photography. Whether that request lands before the
//     screenshot, and what it returns, isn't this repo's code to assert on
//     — `img[src^="http"]` masks any absolute-URL image while leaving
//     locally-bundled `<img src="/...">` usage (if any) verified for real.
//   - MapView (Leaflet) tiles are also `<img src="https://...">`, so
//     `img[src^="http"]` should mask them too — except Leaflet mounts and
//     loads tiles asynchronously after the initial render, and an earlier
//     `.leaflet-container` (its outer wrapper, present synchronously at
//     mount) covers the tiles-still-loading window that a bare `img`
//     selector's mask evaluation can race with.

import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../..');
const registry = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'public/registry/components.index.json'), 'utf8')
);

const components: { id: string; variantCount: number }[] = registry.components;
const MASK_SELECTOR = 'video, canvas, img[src^="http"], .leaflet-container';

test.describe('showcase component variants', () => {
  for (const component of components) {
    test(component.id, async ({ page }) => {
      await page.goto(`/${component.id}`);

      const variantCount = component.variantCount ?? 0;
      for (let i = 0; i < variantCount; i++) {
        const variant = page.locator(`[data-variant-index="${i}"]`);
        await expect(variant).toBeVisible();
        await expect(variant).toHaveScreenshot(`${component.id}-${i}.png`, {
          mask: [variant.locator(MASK_SELECTOR)],
        });
      }
    });
  }
});
