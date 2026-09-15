# Phase 1: CI and quality gates

**Goal:** every push to either repo is type-checked, linted, built and checked for registry drift by a machine. Conventions that AGENTS.md states in prose become lint rules.
**Effort:** M.
**Depends on:** phase 0 (metadata and stale paths, so the first CI run is green).
**Repos:** both.

Today neither repo has a workflow file. `kui-viewer/.github/workflows/ci.yml` and `kui-player/.github/workflows/{ci,release}.yml` are the family's existing templates; start from those.

## 1.1 GitHub Actions

- [ ] `[react]` `.github/workflows/ci.yml` with jobs:
  1. `check`: `npm ci`, `npx tsc --noEmit`, `npm run lint`.
  2. `build`: `npm run build` with `SKIP_REGISTRY_SNAPSHOT=1` (the `prebuild` hook already skips on Vercel/CI per commit `479eafa`; make the env name explicit and document it in `package.json` scripts).
  3. `snapshot-drift` (see 1.2).
  4. `stale-strings`: the grep from phase 0.1.
  Node 22 on `ubuntu-latest`; cache npm. Run on `push` to `main` and on `pull_request`.
- [ ] `[ejs]` `.github/workflows/ci.yml` running the existing `npm run ci` (build + token audit + raw-output audit + spacing lint + dead-partials) plus `snapshot-drift` and `stale-strings`.
- [ ] `[both]` Concurrency group per branch so superseded runs cancel.
- [ ] `[both]` Enable branch protection on `main`: require the `check` and `snapshot-drift` jobs.
- [ ] `[both]` Add a CI status badge to `README.md`.

Skeleton for the react workflow:

```yaml
name: ci
on:
  push: { branches: [main] }
  pull_request:
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm run audit:conventions   # from 1.3
      - run: SKIP_REGISTRY_SNAPSHOT=1 npm run build
  snapshot-drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run registry:snapshot
      - run: git diff --exit-code -- public/registry public/components
```

The `snapshot-drift` job needs Puppeteer and a Next dev server until phase 6 makes the snapshot browser-free. Budget about 3 minutes for it; that is acceptable as a separate job.

## 1.2 Registry snapshot drift

AGENTS.md calls a stale catalog "worse than no catalog", but nothing enforces freshness. The Claude `SessionStart` hook in `.claude/settings.json` (kui-ejs) and `.vscode/tasks.json` help one editor on one machine and nothing else.

- [ ] `[both]` CI job that regenerates the snapshot and fails if `public/registry/**` or `public/components/**` differ from the commit.
- [ ] `[both]` Make the snapshot builder deterministic: strip `generatedAt` from the diff comparison (write it to a separate `public/registry/meta.json`), sort keys, and end files with a newline, otherwise the drift job flaps.
- [ ] `[both]` Pre-commit hook (1.5) that runs the snapshot when any file under `modules/showcase/**`, `modules/**/index.ts`, `app/theme/**` (react) or `src/data/**`, `views/theme/**`, `modules/**` (ejs) is staged.

## 1.3 Convention audits for kui-react

kui-ejs already has `scripts/audit-tokens.sh`, `lint-spacing.sh`, `audit-raw-output.sh` and `find-dead-partials.sh`. kui-react enforces the same conventions only in prose. Port them as Node scripts (`.mjs`) so they run on Windows too, and expose a single `npm run audit:conventions`.

- [ ] `[react]` `scripts/audit-tokens.mjs`: raw hex outside an allowlist. Seed the allowlist with the legitimate hits from the audit: `modules/ui/ColorPicker/**` (palette swatches), `modules/ui/MapView/parts/Popup.tsx` (Leaflet popup HTML cannot use CSS variables), `modules/domains/**/chart/**` and `modules/domains/common/charts/**` (Chart.js reads colours before CSS resolves), OAuth and card brand colours. Every allowlist entry needs a one-line justification, as in the EJS script.
- [ ] `[react]` `scripts/audit-spacing.mjs`: reject arbitrary pixel values in spacing utilities (`p-[13px]`, `mt-[7px]`) outside an allowlist.
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

- [ ] `[react]` `scripts/debt-ratchet.mjs` that counts: `any` usages, `eslint-disable`, `TODO|FIXME|HACK`, files in `modules/ui` touching `window`/`document`, `forwardRef` usages, showcase entries with inline `sourceCode` literals. Compare with `scripts/debt-baseline.json` (seed: 30 / 47 / 358 / 13 / 10 / 316). Fail if any count rises; print a "you may lower the baseline" hint when it falls. Update the baseline in the same PR that lowers it.
- [ ] `[ejs]` Same script with: inline `<script>` partials (86), `onclick=` (96), `<%-` sites without a justification (see phase 6), raw hex outside allowlist (0, already gated).

## 1.7 Dependency updates

- [ ] `[both]` `.github/dependabot.yml`: weekly, npm, group minor and patch updates into one PR, separate PRs for majors. Ignore `next` majors (they need the docs read per AGENTS.md).
- [ ] `[both]` `npm audit --audit-level=high` as a non-blocking CI step first; make it blocking after the first clean run.

## Definition of done

- Both repos have a green `ci.yml` on `main` and branch protection requiring it.
- Editing a showcase file and forgetting the snapshot fails CI with a clear diff.
- `npm run audit:conventions` exists in kui-react and passes.
- The four missing `'use client'` files from phase 0 would now fail lint if reverted.
- `scripts/debt-baseline.json` exists and CI enforces it.
