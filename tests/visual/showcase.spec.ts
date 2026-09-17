// showcase.spec.ts — visual regression over every showcase component page,
// per docs/dev/phase-2-testing.md section 2.3. Iterates the committed
// registry snapshot rather than hand-listing components, so a new
// component is covered the moment its showcase entry ships.
//
// One page load per component (not per variant) screenshotting every
// `[data-variant-index]` container on it — ~315 page loads covering all
// ~739 variants, instead of 739 separate page loads.
//
// `video`, `canvas`, and external-URL `img`/`.leaflet-container` elements
// are masked out. All were caught by running this suite against its own
// just-generated baselines and finding it wasn't self-consistent:
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
//   - Several domain showcase entries use plain `<img>` tags pointing at
//     picsum.photos/unsplash/pravatar/etc. for illustrative photography;
//     MapView's Leaflet tiles are `<img src="https://...">` too, loaded
//     asynchronously after mount — `.leaflet-container` (present
//     synchronously at mount) covers the loading window a bare `img`
//     selector's mask evaluation can race with.
//
// Also runs axe-core on every page (phase-2-testing.md section 2.4, "in
// the same visual spec" so pages aren't visited twice). A full scan across
// all ~333 pages found and fixed ~25 real, mechanical a11y bugs, several
// of them shared/high-leverage (one fix, many pages):
//   - DropdownMenu.tsx put `aria-haspopup`/`aria-expanded` on a plain
//     wrapping <div> (implicit role "generic", which doesn't support
//     those attributes — aria-allowed-attr, critical). Moved them onto
//     the real trigger element via cloneElement.
//   - GithubButton.tsx: icon-only Button with no accessible name
//     (button-name, critical) — added aria-label="GitHub".
//   - PropsEditor.tsx: control <label> was never associated with its
//     input/select (no htmlFor/id pair) — added a stable id per control.
//   - Table.tsx and DataTable.tsx's horizontally-scrollable wrapper had no
//     way for a keyboard user to scroll it (scrollable-region-focusable) —
//     added tabIndex/role="region"/aria-label to both.
//   - Slider's off-screen slides were aria-hidden but kept their content
//     in the tab order (aria-hidden-focus) — added `inert`.
//   - Progress.tsx's aria-label was optional and most callers never passed
//     one (aria-progressbar-name, critical, 7 pages) — defaulted it to
//     `${value}% complete`; separately, 6 components that hand-roll their
//     own progressbar `<div>` instead of using Progress.tsx (CloudWorkspaceCard,
//     ReputationBar, ProcessingStatusIndicator, CardLimitMeter, SplashScreen,
//     OnboardingWizard x2) each got an explicit aria-label.
//   - 6 Chart.js components (`<canvas role="img">` with no name —
//     role-img-alt) got `aria-label` pointing at their existing visible
//     title text (Charts.tsx x5, PortfolioDonutChart, WatchTimeChart,
//     TelemetryTimeSeriesChart, TransactionVolumeChart, AssetAllocationCard).
//   - DatePicker's Trigger and CountrySelector both put `aria-required` on
//     a plain `<button>`, which doesn't support it (aria-allowed-attr).
//     DatePicker: removed it (the trigger isn't itself a form field).
//     CountrySelector: added `role="combobox"` instead, matching the
//     established pattern in Select.tsx — then had to add an explicit
//     `aria-label`, since a combobox (unlike a plain button) doesn't
//     derive its accessible name from visible text content the same way.
//   - FormBuilder's FieldRow nested a `role="button"` drag handle inside
//     a `<button>` (nested-interactive) — restructured as siblings under
//     a shared wrapper `<div>` instead of parent/child.
//   - VenueLeafletMap's mini map preview (wrapped in its own "expand map"
//     button) had its embedded Leaflet marker independently focusable
//     (nested-interactive) — wired the existing `interactive` prop to
//     Leaflet's `keyboard` marker option so it's only focusable in the
//     real (non-preview) map.
//   - MapView's own markers had no accessible name at all
//     (aria-command-name) — tried `alt` (react-leaflet's pass-through to
//     Leaflet's `alt` marker option) first, but it doesn't apply to a
//     `divIcon`-based marker (a custom SVG pin, not `L.icon`'s `<img>`).
//   - AuthorStatsRow and ChannelStatsCard's `<dl>` wrapped each dt/dd pair
//     in a `<div>` that also contained a decorative icon or a delta badge
//     as a third sibling (definition-list/dlitem — a `<dl>`'s per-item
//     wrapper may contain only dt/dd). Moved the icon inside `<dt>` and
//     the delta badge inside `<dd>`.
//   - MentionPicker's `<li role="option">` items lived in a plain `<ul>`
//     with no matching `role="listbox"` (list) — added it, which then
//     needed its own `aria-label` (aria-input-field-name) once it counted
//     as a real ARIA widget instead of a plain list.
//   - PricingGrid's Monthly/Yearly billing `role="switch"` had no
//     accessible name (button-name) — added aria-label.
//   - Gantt's dependency-line SVG layer was `aria-hidden="true"` while its
//     `<g role="button">` children (already properly `aria-label`led per
//     dependency, and NOT actually unclickable — pointer-events:auto
//     overrides the layer's pointer-events:none) stayed individually
//     focusable (aria-hidden-focus) — the aria-hidden was simply wrong
//     given the layer holds real, already-labeled interactive content;
//     removed it instead of stripping the interactivity.
//
// Six rules remain, all ratcheted rather than fixed here — real,
// pre-existing debt too broad for one pass, the same way
// modules/registry/registry.test.ts and
// $KUIEJS_ROOT/tests/html-validate.test.ts already ratchet their own:
//   - `color-contrast` (~7900 nodes, 330 pages): consistently traced to
//     specific token pairs (`--primary` text on `--primary-subtle`
//     backgrounds: 3.37:1 vs the 4.5:1 WCAG AA minimum; `--text-secondary`
//     bold on `--border`-tinted backgrounds: 3.9:1) used pervasively for
//     "active"/count-badge styling across the whole design system. A
//     deliberate design-token decision, not a per-component bug, and out
//     of scope to change unilaterally here.
//   - `scrollable-region-focusable` (~23 nodes, 8 pages): fixed the two
//     shared table components plus DiffViewer's occurrences, but ~47
//     files across modules/ use an `overflow-*-auto` class, each having
//     independently reinvented its own wrapper markup — auditing all of
//     them is a larger, separate pass.
//   - `aria-prohibited-attr` (~54 nodes, 11 pages): fixed the icon-badge/
//     star-rating instances found in this pass, but the same
//     `aria-label`-on-a-role-less-`<span>`/`<div>` anti-pattern exists in
//     ~30 files total, and not all of them want the same fix — icon
//     badges need `role="img"`, but e.g. LoadingState's `aria-busy`
//     wrapper needs `role="status"` instead. Needs per-file judgment, not
//     a mechanical sweep.
//   - `aria-command-name` (~25 nodes, 2 pages): MapView's Leaflet markers
//     — see above, third-party divIcon limitation.
//   - `aria-required-parent` + `aria-required-children` (~294 nodes
//     combined, 3 pages, all Gantt): Gantt's `role="grid"` >
//     `role="row"` > `role="gridcell"` structure is missing required
//     intermediate nesting — task bars are rendered in a separate
//     absolutely-positioned overlay layer from the row list (a common
//     Gantt-chart performance pattern) that doesn't naturally satisfy
//     strict ARIA grid nesting. Fixing it means either a DOM restructure
//     or moving off `role="grid"` entirely — a dedicated pass for this
//     one component, not a quick fix.

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../..');
const registry = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'public/registry/components.index.json'), 'utf8')
);

const components: { id: string; variantCount: number }[] = registry.components;
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

// Written only when a page actually fails the strict check below, so CI
// (docs/dev/phase-2-testing.md 2.5) has the full axe payload — not just
// the truncated one-line-per-rule summary in the assertion message — to
// upload as an artifact. Ratcheted-rule pages that pass every other rule
// never write anything here.
const AXE_OUT_DIR = path.join(REPO_ROOT, 'test-results/axe');
function writeAxeFailure(id: string, violations: unknown) {
  mkdirSync(AXE_OUT_DIR, { recursive: true });
  writeFileSync(path.join(AXE_OUT_DIR, `${id}.json`), JSON.stringify(violations, null, 2));
}

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

      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');

      for (const rule of RATCHETED_RULES) {
        ratchetedViolationCounts[rule] += bad
          .filter((v) => v.id === rule)
          .reduce((sum, v) => sum + v.nodes.length, 0);
      }

      const strict = bad.filter((v) => !RATCHETED_RULES.includes(v.id));
      if (strict.length > 0) writeAxeFailure(component.id, strict);
      const details = strict
        .map((v) => `  [${v.impact}] ${v.id} (${v.nodes.length} nodes) — ${v.help}`)
        .join('\n');
      expect(strict, `axe found serious/critical violations on /${component.id}:\n${details}`).toHaveLength(0);
    });
  }

  test('does not regress past the ratcheted a11y baselines', () => {
    const BASELINES: Record<string, number> = {
      'color-contrast': 8200,
      'scrollable-region-focusable': 30,
      'aria-prohibited-attr': 65,
      'aria-command-name': 30,
      'aria-required-parent': 190,
      'aria-required-children': 120,
    };
    for (const rule of RATCHETED_RULES) {
      expect(
        ratchetedViolationCounts[rule],
        `${rule}: ${ratchetedViolationCounts[rule]} > baseline ${BASELINES[rule]}`,
      ).toBeLessThanOrEqual(BASELINES[rule]);
    }
  });
});
