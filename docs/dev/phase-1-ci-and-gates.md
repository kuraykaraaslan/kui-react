# Phase 1: CI and quality gates

**Goal:** every push to either repo is type-checked, linted, built and checked for registry drift by a machine. Conventions that AGENTS.md states in prose become lint rules.
**Effort:** M.
**Depends on:** phase 0 (metadata and stale paths, so the first CI run is green).
**Repos:** both.

Today neither repo has a workflow file. `kui-viewer/.github/workflows/ci.yml` and `kui-player/.github/workflows/{ci,release}.yml` are the family's existing templates; start from those.

## 1.1 GitHub Actions

- [x] `[react]` `.github/workflows/ci.yml` with jobs `check` (tsc, lint, build), `stale-strings`, `snapshot-drift`. Node 22, npm cache, concurrency group, runs on `push` to `main` and on `pull_request`.
- [x] `[ejs]` `.github/workflows/ci.yml` with jobs `check` (build, token audit, spacing lint, raw-output audit, dead-partial scan), `stale-strings`, `snapshot-drift`.
- [x] `[both]` Concurrency group per branch so superseded runs cancel.
- [ ] `[both]` Enable branch protection on `main`: require the `check` and `snapshot-drift` jobs. (Needs repo admin access on github.com — not doable from a local checkout.)
- [x] `[both]` Add a CI status badge to `README.md`.

**What actually happened wiring this up** (both workflows are verified working, not aspirational — `next build` with `CI=1`, the full `npm run ci` equivalent, and the forced snapshot regeneration were all run locally before committing):

- `[react]` `npm run lint` was never green: 1576 errors, and its process exit code (1) doesn't get checked when the output is piped, which is likely why nobody had noticed. Most of that was `eslint.config.mjs` linting directories it was never meant to cover — `dist/` (tsup build output), `public/**` (generated snapshot JSON, markdown, and `public/wasm`'s vendored third-party JS), `scripts/**/*.js` (plain Node/CommonJS tooling, not `modules/`-layer source). Ignoring those correctly drops it to **307 real errors** (mostly `@next/next/no-html-link-for-pages` across `app/theme/**` — `<a>` instead of `next/link`, plus `no-unused-vars` and `no-img-element`). 307 real errors is real, pre-existing debt, not something to fix as a side effect of adding CI. Lint runs with `continue-on-error: true` (report-only) until section 1.6's debt ratchet gives it a baseline; **307 is that baseline**.
- `[ejs]` `npm run ci` was never green either: `audit:tokens` failed because its allowlist still pointed at `modules/ui/MapView.ejs`, which moved to `modules/ui/MapView/partials/_popup.ejs` in a refactor, and was missing legitimate categories entirely (`Charts.ejs` itself, `ColorPicker`'s swatch palette, `src/registry/registry.ts`'s `DESIGN_TOKENS` — the token contract necessarily contains hex — and `SeoPreview.ejs`'s Google-link-blue). Fixed in `scripts/audit-tokens.sh`; verified green.
- `[ejs]` `audit:raw` fails too: **138 unapproved `<%- %>` sites** (grown from the ~46 `ROADMAP.md` noted). Most look like legitimate component-slot passthroughs (`locals.children`, `_trigger`, icon slots, `col.render(row)`), but at least one — `MapView.ejs` building a `<script>` literal from `_id`/`_center`/`_zoom` — genuinely needs a per-site XSS review before it's blessed, which is not something to rush through as a CI side effect. `audit:raw` also runs report-only until section 6.9 does that review properly.
- Both `git diff --exit-code` drift checks needed `-I'"generatedAt"'` — a plain regeneration touches only that one timestamp field every run; without the ignore-pattern the drift job would fail on every single CI run, forever, on both repos. Verified by actually forcing a regeneration and diffing.

See `.github/workflows/ci.yml` in each repo for the actual, verified-working workflow (this doc no longer keeps a parallel copy — that's exactly the kind of thing that goes stale). `npm run audit:conventions` from section 1.3 does not exist yet; add it as a `check` step once it does.

The react `snapshot-drift` job needs Puppeteer and a Next dev server until phase 6.2 makes the snapshot browser-free — budget about 3 minutes for it. The ejs one is already fast (browser-free `tsx` invocation).

## 1.2 Registry snapshot drift

AGENTS.md calls a stale catalog "worse than no catalog", but nothing enforces freshness. The Claude `SessionStart` hook in `.claude/settings.json` (kui-ejs) and `.vscode/tasks.json` help one editor on one machine and nothing else.

- [x] `[both]` CI job that regenerates the snapshot and fails if `public/registry/**` or `public/components/**` differ from the commit. Live as `snapshot-drift` in both `ci.yml` files.
- [x] `[both]` Interim determinism fix: the drift job's `git diff --exit-code -I'"generatedAt"'` ignores the one line that legitimately changes every run, instead of flapping on every single CI run. Verified by forcing a real regeneration on both repos and diffing.
- [ ] `[both]` The proper fix is still open: strip `generatedAt` out of `components.json`/`components.index.json` entirely and write it to a separate `public/registry/meta.json`, plus sort keys and a trailing newline, so the committed files are byte-identical across a no-op regeneration and the `-I` workaround above can be deleted.
- [ ] `[both]` Pre-commit hook (1.5) that runs the snapshot when any file under `modules/showcase/**`, `modules/**/index.ts`, `app/theme/**` (react) or `src/data/**`, `views/theme/**`, `modules/**` (ejs) is staged.

## 1.3 Convention audits for kui-react

kui-ejs already has `scripts/audit-tokens.sh`, `lint-spacing.sh`, `audit-raw-output.sh` and `find-dead-partials.sh`. kui-react enforces the same conventions only in prose. Port them as Node scripts (`.mjs`) so they run on Windows too, and expose a single `npm run audit:conventions`.

- [x] `[react]` `scripts/audit-tokens.mjs`: raw hex outside an allowlist. Pure Node (`scripts/lib/walk-source-files.mjs`, no shell-out to `grep`) so it genuinely runs on Windows, unlike a naive bash port. Scoped to `modules/` only — `app/theme/**` is explicitly out of scope of the token-only rule (see the comment at the top of the script). Allowlist ended up needing 14 entries, not the handful guessed above: the ones this task predicted (ColorPicker, MapView popup, the Chart.js family, OAuth/card brand colors) plus three found only by actually running it — `modules/ui/MapView/types.ts` (same Leaflet rationale as `parts/Popup.tsx`, different file), `modules/registry/registry.ts` (the token contract itself necessarily contains hex), and a code-editor mockup's fixed syntax-highlighting palette. **11 genuine violations remain** (`modules/domains/iot/**`, `modules/domains/event/**` — arbitrary Tailwind shades close to but not identical to existing tokens); report-only in CI, baseline for section 1.6.
- [x] `[react]` `scripts/audit-spacing.mjs`: same pure-Node approach. **Zero violations** — blocking in CI already.
- [x] `[react]` `scripts/audit-conventions.mjs`: runs both and OR's their exit codes (a shell `cmd1; cmd2` would only reflect `cmd2`'s status, silently hiding a `cmd1` failure — worth a real script instead of a package.json one-liner).
- [ ] `[react]` Dead exports and unused dependencies: adopt `knip` (`npx knip`) rather than writing a custom scanner. Configure entry points as `index.ts`, `modules/*/index.ts`, `app/**`.
- [ ] `[react]` Circular imports: `npx madge --circular --extensions ts,tsx modules libs`. Fail CI on any cycle. (ROADMAP #31.)
- [ ] `[react]` Cross-vertical import check: `modules/domains/<a>/**` must not import `modules/domains/<b>/**` unless `<b>` is `common`. Implement as a madge dependency filter or a 20-line script over `import` statements.
- [ ] `[ejs]` Keep `npm run ci` as the aggregate; add `stale-strings` and, once phase 6 makes it precise, promote `dead-partials` from informational to a gate.

## 1.4 ESLint rules that encode AGENTS.md

`eslint.config.mjs` notes that `eslint-plugin-tailwindcss` is installed but not wired because it lacks Tailwind v4 support. Evaluate `eslint-plugin-better-tailwindcss`, which targets v4, at adoption time; if it fits, drop the unused v3 plugin.

Write a local flat-config plugin under `eslint-rules/` (no publish needed) with:

- [ ] `[react]` `kui/use-client-header`: files under `modules/ui`, `modules/app`, `modules/domains` must start with `'use client';`. Allow-list `*.types.ts`, `types.ts`, `index.ts`, `*.store.ts`, `*.data.ts`.
- [ ] `[react]` `kui/no-default-export`: same directories; allow files whose default export is a `next/dynamic` wrapper (the one existing case is `modules/domains/event/VenueLeafletMap.tsx`).
- [ ] `[react]` `kui/classname-uses-cn`: a `className` prop whose value is a template literal or string concatenation is an error; `cn(...)` is required.
- [ ] `[react]` `kui/no-raw-hex-in-jsx`: hex literals in `className`, `style`, or string props, with the same allowlist as 1.3.
- [ ] `[react]` `kui/no-bare-browser-globals-in-ui`: `window.` / `document.` outside `useEffect`, event handlers, or `isBrowser` guards in `modules/ui` (13 files today; fix them as part of adopting the rule or start it as a warning).
- [ ] `[react]` Turn `@typescript-eslint/no-explicit-any` to `error` with the existing 30 sites either fixed or individually disabled with a reason.

## 1.5 Pre-commit and commit hygiene

- [ ] `[both]` `husky` + `lint-staged`: `eslint --fix` and `prettier` (if adopted) on staged `ts/tsx/mjs`; `tsc --noEmit` on commit is too slow for large repos, run it in CI only.
- [ ] `[both]` `commitlint` with the conventional config. The history already follows `feat(scope):` almost everywhere; the exceptions (`updage package`, `cleaning`) are what this prevents.
- [ ] `[both]` Snapshot-on-commit rule from 1.2.

## 1.6 Debt thresholds (ratchet)

Rather than fixing 358 TODOs at once, freeze the numbers and only allow them to go down.

- [ ] `[react]` `scripts/debt-ratchet.mjs` that counts: `any` usages, `eslint-disable`, `TODO|FIXME|HACK`, files in `modules/ui` touching `window`/`document`, `forwardRef` usages, showcase entries with inline `sourceCode` literals, **`npm run lint` error count**, and **`npm run audit:tokens` violation count** (seed: 30 / 47 / 358 / 13 / 10 / 316 / **307** / **11** — the last two measured while wiring CI in section 1.1, now the actual gates for turning `lint` and `audit:tokens`'s `continue-on-error` blocking). Compare with `scripts/debt-baseline.json`. Fail if any count rises; print a "you may lower the baseline" hint when it falls. Update the baseline in the same PR that lowers it.
- [ ] `[ejs]` Same script with: inline `<script>` partials (86), `onclick=` (96), **`audit:raw` unapproved `<%- %>` sites (138** — measured in section 1.1, was ~46 when `ROADMAP.md` was last written, so this had already been silently growing), raw hex outside allowlist (0, gated and green as of section 1.1).

## 1.7 Dependency updates

- [x] `[both]` `.github/dependabot.yml`: weekly, npm + github-actions, group minor/patch into one PR. `[react]` ignores `next` majors (need the docs read per AGENTS.md); `[ejs]` groups express/express-ejs-layouts/helmet majors together instead (the planned Express 5 migration in phase 5.6 should be one deliberate PR, not three).
- [x] `[both]` `npm audit --audit-level=high` as a non-blocking CI step. **Genuinely fails today** — 19 vulnerabilities in kui-react (1 critical, 12 high), 15 in kui-ejs (2 critical, 10 high), all transitive through puppeteer's `ws` dependency. `npm audit fix` (non-force) does not touch them; only `--force` would, and bumping puppeteer's resolved `ws` version is a real dependency decision that needs its own look (puppeteer's screenshot/snapshot functionality depends on it), not something to do as a side effect of adding the audit step. Stays report-only until that's deliberately done.

## Definition of done

- Both repos have a green `ci.yml` on `main` and branch protection requiring it.
- Editing a showcase file and forgetting the snapshot fails CI with a clear diff.
- `npm run audit:conventions` exists in kui-react and passes.
- The four missing `'use client'` files from phase 0 would now fail lint if reverted.
- `scripts/debt-baseline.json` exists and CI enforces it.
