# Phase 2: Testing

**Goal:** a test pyramid that is cheap on every PR and thorough nightly. Both repos have zero tests today; ROADMAP #25 and #26 have been open since the roadmap was written.
**Effort:** M to L, depending on how far unit coverage is pushed.
**Depends on:** phase 1 (CI to run the tests in).
**Repos:** both.

Principle: the registry already enumerates every component, variant, theme and route. Tests should iterate the registry rather than hand-list things, so a new component is tested the moment it is registered.

## 2.1 kui-react unit tests

- [x] `[react]` Installed `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`, `@vitejs/plugin-react`. `vitest.config.mts` (`.mts`, not `.ts` — Vite otherwise warns about loading ESM syntax as CommonJS and about `__dirname`, which doesn't exist in real ESM; use `import.meta.dirname`) with the `@` alias and `environment: jsdom`. Script `npm test`. **Pinned to `vitest@4.1.11`, not the latest 5.x** — vitest 5 requires `@types/node@^22 || >=24`, which conflicts with this repo's `@types/node@^20` (matching its stated `engines.node: ">=20"`); vitest 4.1.11 is the newest release that still accepts `^20.0.0`.
- [ ] `[react]` Test template for a ui atom, stored as `docs/dev/templates/component.test.tsx` and referenced from CONTRIBUTING.md:
  - renders with children
  - each `variant` applies its class from the `variantClasses` record
  - `disabled` sets the attribute and the `disabled:` classes
  - keyboard: Enter/Space triggers `onClick`, Escape closes overlays
  - ARIA: `aria-busy` when `loading`, `aria-pressed` when `selected`, `aria-invalid` + `aria-describedby` for inputs with `error`
- [~] `[react]` First wave, 4 of 11 done: `Button` (12 tests: every variant class, disabled, loading hides icons + aria-busy, selected/aria-pressed, click + Enter/Space, disabled blocks the click, polymorphic `as="a"` drops `type`, custom `className` merges via `cn()` rather than replacing), `Input` (9 tests: label, required, error → aria-invalid + aria-describedby + role="alert", hint → aria-describedby, password show/hide toggle, clearable, character count, `forwardRef` reaches the real `<input>`, read-only), `Toggle` (6 tests), `Checkbox` (6 tests: including `indeterminate`, which is a DOM property, not an HTML attribute — asserted via the element property, not `toHaveAttribute`), `Modal` (7 tests: closed renders nothing, title/description → `aria-labelledby`/`aria-describedby`, Escape closes, backdrop click closes (and is skippable), close button, footer). Remaining: `Select`, `Drawer`, `TabGroup`, `DropdownMenu`, `Pagination`, `Tooltip`. Second wave (every remaining `modules/ui` atom) and domain components not started.
  - **Two bugs found while writing these, both fixed, neither in the components under test**: the new `kui/use-client-header` ESLint rule (phase 1.4) flagged the test files themselves — a `*.test.tsx` file uses JSX to render a component but is never itself a Next.js client/server boundary, so the directive is meaningless there; added a `.test.tsx` exemption. Separately, `scripts/debt-ratchet.mjs`'s `windowDocumentInUi` metric counted `Modal.test.tsx`'s legitimate `document.querySelector`/`document.activeElement` assertions as the same SSR-unsafe pattern it exists to catch in real components; excluded `*.test.tsx`/`*.test.ts` from that specific metric (and `forwardRefUsages`, same reasoning) while leaving test files counted for the three general code-quality metrics (`any`, `eslint-disable`, `TODO`), where a hit inside a test is still real debt.
  - **A real Modal-specific gotcha worth keeping**: it renders through `createPortal` straight onto `document.body`, not into React Testing Library's `render()` return value's `container` — querying the backdrop via `container.querySelector(...)` silently finds nothing; query from `document` instead. Its focus-trap initial-focus effect is also deferred via `setTimeout(0)`, so an assertion that depends on focus having moved needs a `waitFor`/`findBy*` tick, not a synchronous check right after `render()`.
- [ ] `[react]` Hooks: `useFocusTrap`, `useBreakpoint` (SSR default, resize), `announce()` writes to the live region.
- [x] `[react]` Registry consistency test (`modules/registry/registry.test.ts`, 8 assertions), runs in ~0.7s against the committed `public/registry/components.json` snapshot (not the live registry — that still needs a browser until phase 6.2) and replaces several manual AGENTS.md checks:
  - `id` is globally unique — clean, hard requirement
  - `filePath` exists on disk — clean now; **found and fixed a real bug**: the showcase entry for `UserMenu` (id `user-menu`, in `app-user.showcase.tsx`) pointed at `modules/app/UserMenu.tsx`, which commit `5ef1606` deleted when the component moved to `modules/domains/common/user/UserMenu.tsx` — the showcase entry (with a full duplicated `sourceCode` string, an unused import, and two demo components used nowhere else) was simply never removed. The real, current, correctly-pathed entry already exists as `common-user-menu` — this was pure dead cruft, safe to delete outright rather than "fix."
  - `composes[]` and `relatedTo[]` resolve — `relatedTo` **found a second real gap**: `app-form.showcase.tsx`'s `StepShellField`(-adjacent) entry listed `relatedTo: ['step-flow', 'step-shell']`, but `modules/app/StepFlow.tsx` exists and is exported yet has **zero showcase coverage** — never added to `showcase.menu.ts` or any section file, so it's invisible to `/api/registry` and every AI agent reading it. Removed the dangling reference (with a comment pointing at the real gap) rather than fabricating a showcase entry as a side effect of writing a test; giving `StepFlow` real variants is content work for later.
  - abbr uniqueness and ≥2-variants (AGENTS.md rule): **not clean** — 101 components share an abbreviation with an earlier one, 29 have only 1 variant. Both are real, large, pre-existing gaps that surfaced only by actually running the test, not estimated in advance. Neither is a mechanical fix (a new abbr must avoid a *new* collision; a second variant needs someone to design a meaningfully different demo state). Ratcheted in the test itself against a documented baseline constant (`ABBR_COLLISION_BASELINE = 101`, `LOW_VARIANT_BASELINE = 29`) rather than hard-failing on 130 components at once or being left out of the suite entirely — a regression is still caught, a fix still needs its own dedicated pass.
  - every theme route in `themes[]` has a matching `app/theme/<v>/page.tsx` — clean
  - `npm test` is genuinely green end to end and wired as a **blocking** CI step (`Unit tests`), not report-only — verified with a full `tsc --noEmit` and a real `CI=1 npm run build` after the fixes above, and `scripts/debt-baseline.json`'s `showcaseSourceLiterals` count correctly fell 316→315 (the deleted entry's inlined source) and was lowered in the same commit.
- [ ] `[react]` Wire `useA11yCheck` into the showcase `Widget` in development (0 call sites today). It costs nothing in production because the axe import is behind a `NODE_ENV` check.

## 2.2 kui-ejs route smoke tests

The cheapest, highest-value tests in the EJS repo: boot the app in-process and request every known URL.

- [x] `[ejs]` Installed `vitest@4.1.11` (same `@types/node@^20` pin reasoning as kui-react's phase 2.1) and `supertest` + `@types/supertest`. `src/app.ts` already exports `app` without calling `listen` (that's `src/server.ts`'s job) — no change needed there.
- [x] `[ejs]` `tests/routes.smoke.test.ts`: `/`, `/health`, `/api/registry`, `/api/registry?index=1`, `/llms-full.txt`, one genuinely-unmatched path (`/this/path/does/not/exist` — a bare `/:slug` route matches *any* single-segment path with a 200, so the unknown-path case has to be multi-segment to actually reach the 404 handler), every `themes[].route` (6) and every component id (207) from the committed `public/registry/components.json` — 219 requests total, iterating the registry rather than hand-listing routes. **Genuinely green on the first real run.** Wired as a blocking CI step (`Route smoke tests`).
- **Found and fixed a real, serious, intermittent bug while building this** (not part of the smoke test itself, but surfaced by running the registry snapshot repeatedly while testing): `scripts/build-registry-snapshot.mjs` spawns a `tsx` child process and captures its stdout with `child.stdout.on('data', (b) => { stdout += b.toString() })` — decoding each stream chunk independently. A `Buffer` chunk boundary can land in the middle of any multi-byte UTF-8 character, and decoding the two halves separately turns it into two `U+FFFD` replacement characters. This had already **silently corrupted a comment in the committed `FormField.ejs` snapshot** (fixed once in an earlier commit, on the assumption it was a one-off stale artifact) and then **reappeared** on a later `npm run build`, proving it was live, ongoing, non-deterministic data corruption in the registry every AI agent reads from — not a fixed historical mistake. Root-caused and fixed with `child.stdout.setEncoding('utf8')` (Node's stream `StringDecoder` correctly holds back an incomplete trailing multi-byte sequence until the next chunk instead of mangling it), then verified clean across 13 consecutive regenerations before trusting it.
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
