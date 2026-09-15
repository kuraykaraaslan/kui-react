# Phase 3: Release and package

**Goal:** the npm story becomes true. `README.md`, `docs/versus/*.md` and the tsup build all describe `@kuraykaraaslan/kui-react` as an installable package; the registry returns 404 for it. Either publish it properly or remove the claim. This phase assumes **publish**, because the copy-paste path keeps working for everyone else and the build already exists.
**Effort:** M.
**Depends on:** phase 1 (CI to run the package checks and the release workflow).
**Repos:** mostly kui-react; a small versioning task for kui-ejs.

## 3.1 Decision: publish or retract

- [ ] `[react]` Decide and record as `docs/adr/0005-npm-distribution.md`. If **retract**: delete `build:lib`, `tsup.config.ts`, `dist` from `files`, the `exports` map, and the npm sentences in README and `docs/versus`. If **publish**: everything below.

## 3.2 package.json for publishing

- [ ] `[react]` `publishConfig: { access: "public" }`, `repository`, `homepage`, `bugs` (from phase 0), `sideEffects` kept as is.
- [ ] `[react]` Replace `prepare: npm run build:lib` with `prepublishOnly: npm run build:lib && npm run check:package`. `prepare` runs tsup on every `npm install` for every contributor and on Vercel; that is wasted minutes and a source of install failures.
- [ ] `[react]` `files`: keep `dist` and `styles`; add `README.md` and `LICENSE` explicitly (npm includes them anyway, but be explicit), exclude `dist/**/*.map` only if maps are not shipped.
- [ ] `[react]` Verify `npm pack --dry-run` lists nothing from `app/`, `public/`, `modules/showcase/`.

## 3.3 Exports map and build output

The build currently exposes `.`, `./ui`, `./app`, `./common`, `./styles`. Seventeen domain verticals are not importable from the package at all, and the combined `index.ts` re-exports only a hand-picked subset of `common`.

- [ ] `[react]` Add `./domains/<vertical>` for all 18 verticals. Extend `scripts/generate-barrels.mjs` to emit both the tsup `entry` map and the `exports` block from `modules/domains/*/index.ts`, so the list can not drift.
- [ ] `[react]` Consider per-component subpaths (`@kuraykaraaslan/kui-react/ui/Button`) by switching tsup to `bundle: false` with per-file output. This also solves the directive problem: esbuild drops `'use client'` when bundling, which is why a global banner is applied to every chunk today, including chunks that are server-safe. With per-file output the original directive survives per file.
- [ ] `[react]` `sourcemap: true`. Consumers debugging a 294 KB `app.js` without maps is a support burden.
- [ ] `[react]` `target` and `platform` set explicitly (`es2020`, `browser`); `treeshake: true`.
- [ ] `[react]` Types: keep `dts` on; confirm `index.d.ts` does not leak `@/` path aliases (tsup `esbuildOptions.alias` covers JS, the dts step must resolve them too).

## 3.4 Peer dependency cleanup

Optional peers (`chart.js`, `react-chartjs-2`, `quill`, `leaflet`, `react-leaflet`, `zustand`, `zod`) are also listed in `dependencies`, so every consumer downloads all of them. Font Awesome packages are in both `peerDependencies` and `dependencies`, which can create two `fontawesome-svg-core` instances in a consumer bundle.

- [ ] `[react]` Remove from `dependencies` everything that is a declared optional peer; keep it in `devDependencies` for the showcase app.
- [ ] `[react]` Font Awesome: peer only. Document the required versions in README.
- [ ] `[react]` Keep `clsx`, `tailwind-merge` as real dependencies.
- [ ] `[react]` `countries-list`, `country-flag-icons`, `iso-639-1`: only the common domain uses them; make them optional peers of `./common` and note it in the README's "optional dependencies" table.
- [ ] `[react]` `@kuraykaraaslan/kui-viewer`: it is external in tsup, so it must be a peer, not a dependency, unless the package should force it on consumers.

## 3.5 Package quality checks (`npm run check:package`)

- [ ] `[react]` `publint` (exports map, ESM/CJS correctness).
- [ ] `[react]` `@arethetypeswrong/cli` (`attw --pack`) for type resolution under every module setting.
- [ ] `[react]` `size-limit` with a budget per entry (`ui`, `app`, each `domains/*`). Fail CI when a budget is exceeded by more than 5 %.
- [ ] `[react]` Smoke install in CI: `npm pack`, then in a temp Next.js app `npm i ./kui-react-*.tgz` and import `Button` in a page, `next build`. Catches broken exports better than any unit test.

## 3.6 CSS contract

`styles/index.css` ships only the token variables. Every component class is a Tailwind utility, so a consumer must let Tailwind scan the package or nothing is styled. README does not say this.

- [ ] `[react]` README section "Styling setup" with the Tailwind v4 line `@source "../node_modules/@kuraykaraaslan/kui-react/dist";` and the `@import "@kuraykaraaslan/kui-react/styles";` token import.
- [ ] `[react]` Ship a precompiled `dist/kui.css` for consumers without Tailwind, built with `scripts/build-css.mjs` as described in `KUI_Package_Rules/build-and-config.md` (strip preflight, include tokens). Add `./css` to `exports`.
- [ ] `[react]` Document dark mode (`.dark` class on `<html>`) and the `data-theme` override mechanism in the same section.

## 3.7 Versioning, changelog, tags

There are no tags in either repo. `CHANGELOG.md` in kui-react stops at 0.1.0 while the package is 1.0.1.

- [ ] `[react]` Adopt `changesets`: `.changeset/config.json`, `npm run changeset` in CONTRIBUTING, `changeset version` + `changeset publish` in `.github/workflows/release.yml` on push to `main` (the "version packages" PR pattern). `kui-player/.github/workflows/release.yml` is the family template.
- [ ] `[react]` Backfill tags `v1.0.0` and `v1.0.1` on the commits that introduced the library build and the bump, so `git describe` and GitHub Releases have history.
- [ ] `[react]` GitHub Releases with generated notes (`.github/release.yml` categories by conventional-commit type).
- [ ] `[react]` Per-component `version` field in the showcase metadata, bumped by the changeset that touches the component's file. Feeds ROADMAP #24 (component changelog) and the CLI in phase 8.
- [ ] `[ejs]` kui-ejs stays `private: true` but should still be versioned and tagged when themes or partial sets ship, so parity docs (phase 4) can pin "kui-react 1.2 ↔ kui-ejs 0.4". Use the same changesets setup without `publish`.

## 3.8 Engines and Node

- [ ] `[both]` `engines.node: ">=20"` now; move to `">=22"` together with phase 5.
- [ ] `[both]` `.nvmrc` = `22`.

## Definition of done

- `npm view @kuraykaraaslan/kui-react version` prints the same value as `package.json`, or the npm claim is gone from all docs (ADR 0005 says which).
- `npm run check:package` passes in CI: publint, attw, size-limit, pack-and-install smoke.
- `import { ProductCard } from '@kuraykaraaslan/kui-react/domains/commerce'` works in the smoke app.
- `git tag` lists `v1.0.0`, `v1.0.1` and every release since.
- README has a "Styling setup" section.
