# Phase 2: Testing

**Goal:** a test pyramid that is cheap on every PR and thorough nightly. Both repos have zero tests today; ROADMAP #25 and #26 have been open since the roadmap was written.
**Effort:** M to L, depending on how far unit coverage is pushed.
**Depends on:** phase 1 (CI to run the tests in).
**Repos:** both.

Principle: the registry already enumerates every component, variant, theme and route. Tests should iterate the registry rather than hand-list things, so a new component is tested the moment it is registered.

## 2.1 kui-react unit tests

- [ ] `[react]` Install `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom` (or `happy-dom`). `vitest.config.ts` with the `@` alias and `environment: jsdom`. Script `npm test`.
- [ ] `[react]` Test template for a ui atom, stored as `docs/dev/templates/component.test.tsx` and referenced from CONTRIBUTING.md:
  - renders with children
  - each `variant` applies its class from the `variantClasses` record
  - `disabled` sets the attribute and the `disabled:` classes
  - keyboard: Enter/Space triggers `onClick`, Escape closes overlays
  - ARIA: `aria-busy` when `loading`, `aria-pressed` when `selected`, `aria-invalid` + `aria-describedby` for inputs with `error`
- [ ] `[react]` First wave: `Button`, `Input`, `Select`, `Toggle`, `Checkbox`, `Modal` (focus trap via `useFocusTrap`), `Drawer`, `TabGroup`, `DropdownMenu`, `Pagination`, `Tooltip`. Second wave: every remaining `modules/ui` atom. Domain components are lower priority; their logic is mostly composition.
- [ ] `[react]` Hooks: `useFocusTrap`, `useBreakpoint` (SSR default, resize), `announce()` writes to the live region.
- [ ] `[react]` Registry consistency test (`modules/registry/registry.test.ts`), runs in seconds and replaces several manual AGENTS.md checks:
  - every `showcase.menu.ts` item has showcase data
  - every showcase component has at least 2 variants (AGENTS.md rule)
  - every `filePath` exists on disk
  - `id` and `abbr` are globally unique
  - every id in `composes[]` and `relatedTo[]` resolves
  - every theme route in `themes[]` has a matching `app/theme/<v>/page.tsx`
- [ ] `[react]` Wire `useA11yCheck` into the showcase `Widget` in development (0 call sites today). It costs nothing in production because the axe import is behind a `NODE_ENV` check.

## 2.2 kui-ejs route smoke tests

The cheapest, highest-value tests in the EJS repo: boot the app in-process and request every known URL.

- [ ] `[ejs]` Install `vitest` and `supertest`. Export `app` from `src/app.ts` (already the case) and never call `listen` there.
- [ ] `[ejs]` `tests/routes.smoke.test.ts`: for `/`, `/health`, `/api/registry`, `/api/registry?index=1`, `/llms-full.txt`, every `themes[].route` from `public/registry/components.json`, every showcase slug, and one unknown path: assert status, `content-type`, and that the body contains `<main id="main-content"`.
- [ ] `[ejs]` `tests/partials.render.test.ts`: render each `modules/**/*.ejs` through `ejs.renderFile` with the default locals from its showcase entry's first variant. Catches undefined-local crashes that only surface on a rarely visited page.
- [ ] `[ejs]` `tests/security.test.ts` (grows with phase 5): CSP header present, CSRF token present in every `<form method="post">`, no `unsafe-inline` once inline scripts are gone.
- [ ] `[ejs]` `html-validate` over the smoke-test bodies. Start with rules: unique ids, `label` has a control, `img` has `alt`, no duplicate `main`, valid nesting. Tailwind class soup is fine for it.

## 2.3 Visual regression (both)

- [ ] `[both]` Playwright (`@playwright/test`) with a config that starts the dev server (`webServer` option). One project each for light and dark; viewport 1280 and 400 wide.
- [ ] `[both]` `tests/visual/showcase.spec.ts`: iterate `components.index.json`, visit `/<id>` (react) or the showcase slug (ejs), screenshot each variant container (`data-variant-index` attribute added to the Widget), `toHaveScreenshot()`.
- [ ] `[both]` `tests/visual/themes.spec.ts`: iterate `themes[].route`, full-page screenshot of the landing page of each theme.
- [ ] `[both]` Baselines committed under `tests/__screenshots__/` (Git LFS if the folder grows past ~50 MB), regenerated with `--update-snapshots` in a dedicated PR only.
- [ ] `[both]` Replace `scripts/take-screenshots.js` (Puppeteer) with a Playwright script so there is one browser dependency per repo. Until phase 6 removes the browser from the snapshot builder, that builder is the last Puppeteer user in kui-react; migrate it too, or keep Puppeteer only as a devDependency.
- [ ] `[both]` Cross-repo parity screenshot: a nightly job that renders the same component id in both showcases and diffs them with a tolerance. This is the only mechanical check of the "pixel-perfect parity" rule. Report only; do not gate.

## 2.4 Automated accessibility

- [ ] `[both]` `@axe-core/playwright` in the same visual spec: run `axe` on each showcase page and each theme landing page; fail on `serious` and `critical` impacts; write the full report to CI artifacts. (ROADMAP #11 for EJS, #44 for React.)
- [ ] `[both]` Keyboard smoke: for each overlay component (Modal, Drawer, DropdownMenu, CommandPalette, Popover), open it, assert focus moved inside, press Escape, assert focus returned to the trigger.
- [ ] `[react]` A `/internal/a11y-report` page that reuses the registry to render every component and runs axe in the browser (ROADMAP #44). Optional once the Playwright job exists.

## 2.5 CI wiring and timing budget

| Job | Trigger | Budget |
|---|---|---|
| unit + registry consistency (react), smoke + partial render (ejs) | every PR | < 2 min |
| visual regression + axe | nightly, and on PRs labelled `visual` | < 15 min |
| cross-repo parity diff | nightly | report only |

- [ ] `[both]` Add the jobs to `ci.yml` and a `nightly.yml` with `schedule: cron`.
- [ ] `[both]` Upload Playwright traces and axe JSON as workflow artifacts on failure.

## Definition of done

- `npm test` exists and passes in both repos; CI runs it on every PR.
- kui-react: every `modules/ui` atom has a test file; the registry consistency test passes.
- kui-ejs: every route in the registry returns 200 in the smoke test.
- Nightly visual and axe jobs exist with committed baselines.
- ROADMAP #25 and #26 marked complete in both repos.
