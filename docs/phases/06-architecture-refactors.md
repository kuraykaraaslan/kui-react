# Phase 6: Architecture refactors

**Goal:** fix the places where the same information lives in two copies (showcase source strings, Calendar/Gantt in three repos, error-state naming), remove the browser from the registry build, finish the form system, add the Next.js app-level files that every theme lacks, and give EJS partials a typed contract.
**Effort:** L. Split into independent PRs; nothing here needs to land together.
**Depends on:** phase 1 (lint rules and ratchet catch regressions), phase 2 (tests protect the refactors).
**Repos:** both.

## 6.1 kui-react: showcase source code from disk

61 showcase section files embed the full component source as template literals (`sourceCode: \`'use client'; …\``), 316 entries in total. Every edit to a component silently desynchronises its showcase copy. kui-ejs reads the file (`fs.readFileSync(... 'modules/ui/Button.ejs')`) and has no such problem.

- [ ] Showcase entries keep `filePath` and drop `sourceCode`. Make `sourceCode` optional in `ShowcaseComponent` first, migrate section files one by one, then remove the field.
- [ ] Source is resolved at build time from `filePath` by the snapshot builder (which already writes `public/components/<id>.md` with the source) and served to the client from `/components/<id>.md` or a generated `public/registry/sources.json`. The Source tab in `ShowcaseDetail` fetches it lazily.
- [ ] The phase 2 registry consistency test asserts every `filePath` exists; the phase 1 ratchet counts remaining literals (baseline 316 → 0).
- [ ] Variant `code` strings are usage examples, not copies of the component; they stay hand-written.

## 6.2 kui-react: registry snapshot without a browser

`scripts/build-registry-snapshot.mjs` starts a Next dev server and Puppeteer to render `app/internal/snapshot` because the showcase data is `'use client'` and imports React previews. That makes the snapshot slow, CI-hostile and impossible on Vercel (hence the skip).

- [ ] Split each section file into `*.meta.ts` (plain TypeScript: id, title, category, abbr, description, filePath, status, since, AI fields, variant titles and `code` strings) and `*.previews.tsx` (`'use client'`, only the `preview` nodes keyed by variant index).
- [ ] `buildShowcaseData()` merges the two on the client; the registry builder imports only the `*.meta.ts` files with `tsx` and runs in a plain Node process in under a second.
- [ ] Delete `app/internal/snapshot/page.tsx`, the Puppeteer dependency of the builder, and the `SKIP_REGISTRY_SNAPSHOT` special-casing; the `prebuild` hook can now run everywhere including Vercel.
- [ ] Hand the writer to `kui-tooling snapshot` (phase 4.1) once it exists.

## 6.3 kui-react: one form system

ROADMAP #10 is still partial: 11 domain `*Form*.tsx` files manage state with `useState`, 2 use `react-hook-form`. `FormField` (render-prop over react-hook-form) already exists.

- [ ] Decide react-hook-form + Zod resolver as the only pattern (record in ADR 0006). Domain `types.ts` already has the Zod schemas.
- [ ] Migrate per vertical: `common` (Login, Register, ForgotPassword, ChangePassword, Address, UserProfile, UserPreferences, SeoForm, CreditCardForm) first, since the other verticals import from it.
- [ ] Each migrated form gets an RTL test: submit with empty fields shows field errors from the schema; valid submit calls `onSubmit` with parsed data.
- [ ] Add the pattern to AGENTS.md "Forms" section and to the component template.

## 6.4 kui-react: split oversized files

- [ ] `modules/ui/Table/DataTable.tsx` (791 lines) into `Table/parts/` (Header, Body, Pagination, Toolbar) and `Table/hooks/` (useSort, useFilter, useSelection). `AdvancedDataTable`, `ServerDataTable` and `BulkActionTable` should share the hooks instead of re-implementing them.
- [ ] Showcase sections over 500 lines (`domain-common` 1,960 · `domain-event` 1,193 · `domain-api-doc` 980 · `domain-landing` 767 · `domain-nft` 693 · `ui-molecule-data` 679 · `app-extras` 675 · `app-calendar` 603) into one file per component, as kui-ejs already does (`ui-atom-button.showcase.ts`, …). 6.1 and 6.2 shrink them first; do this after.
- [ ] Domain `types.ts` files over 500 lines (`commerce` 702, `api-doc` 648, `event` 547) into `types/<entity>.ts` with a barrel.

## 6.5 kui-react: React 19 and hygiene

- [ ] Replace `forwardRef` in the 10 remaining files with a plain `ref` prop (React 19).
- [ ] Route the 13 `modules/ui` files that read `window`/`document` at render time through effects or `libs/utils/isBrowser`; then enable the phase 1 lint rule as an error.
- [ ] Review the 4 `dangerouslySetInnerHTML` sites; each needs a sanitiser or a comment explaining why the input is trusted.
- [ ] Reduce `eslint-disable` (47) and `any` (30) under the ratchet; target zero `any` in `modules/ui`.

## 6.6 kui-react: Calendar and Gantt live in three places

`modules/app/Calendar` + `modules/app/Gantt` (54 files, milestones M1–M6 shipped) coexist with the standalone repos `kui-calendar` (0.0.1, 5 commits) and `kui-gantt` (0.0.1, 3 commits) and with `Calendar.ejs`/`Gantt` in kui-ejs. `KUI_Package_Rules` says extract when self-contained and non-trivial; both qualify, but the extraction stalled.

- [ ] Decide (ADR 0007) between:
  - **A.** Finish the extraction: bring `kui-calendar` and `kui-gantt` to parity with the in-repo modules following `KUI_Package_Rules` (vanilla engine + React subpath), publish, then consume them in kui-react exactly like `@kuraykaraaslan/kui-viewer` and delete `modules/app/Calendar` and `modules/app/Gantt`.
  - **B.** Archive the two standalone repos now, keep the modules in-tree, and re-extract later from a stable base.
  Recommendation: **B** now, **A** when the in-tree versions have gone a full release without API changes. Three copies is the one option that must end.
- [ ] Whichever option: the EJS `Calendar.ejs` is a separate implementation by nature; document in the parity exceptions that it tracks the React feature list, not the code.

## 6.7 kui-react: Next.js app-level files

No `error.tsx`, `not-found.tsx`, `loading.tsx`, `sitemap.ts`, `robots.ts` or `manifest.ts` exists under `app/`. Eighteen themes have no error boundary (ROADMAP #39).

- [ ] `app/error.tsx` rendering `ErrorState` with `reset`; `app/not-found.tsx` rendering `NotFoundPage`; `app/loading.tsx` rendering `LoadingState`.
- [ ] `app/theme/<v>/error.tsx` for each theme (a shared `ThemeErrorBoundary` component in `modules/app`, one line per theme file).
- [ ] `app/sitemap.ts` generated from `NAV_GROUPS` + `themes[]` (replaces the single-URL `public/sitemap.xml`), `app/robots.ts`, `app/manifest.ts` (replaces `public/site.webmanifest`).
- [ ] Theme pages: `export const dynamic = 'error'` to guarantee static generation; audit every `[slug]` route for `generateStaticParams`.
- [ ] Per-theme OG image through the existing `app/api/og/route.tsx` (`?title=&theme=`), wired in each theme's `layout.tsx` metadata.
- [ ] `next.config.ts` is empty. Read `node_modules/next/dist/docs/` first (AGENTS.md), then enable: `typedRoutes`, `reactCompiler` (needs `babel-plugin-react-compiler`), `images.remotePatterns` for the sample image hosts, `headers()` with the same security headers phase 5 gives kui-ejs, `output: 'standalone'` for container deploys.
- [ ] `@next/bundle-analyzer` behind `ANALYZE=1`; confirm `chart.js`, `quill`, `leaflet` only enter through `modules/ui/lazy.tsx`; the phase 1 cross-vertical import check keeps theme chunks separate (ROADMAP #29).

## 6.8 kui-ejs: partial locals contract

Every partial reads `locals.x || default` with no declared shape (ROADMAP #9 "Partial Locals Contract", still open). The props editor, the registry and the smoke tests all have to guess.

- [ ] `<Name>.locals.ts` next to each partial exporting a Zod schema and its inferred type; defaults live in the schema (`variant: z.enum([...]).default('primary')`). Start with `modules/ui`, then `modules/app`, then domains.
- [ ] Development-only include guard: `app.locals.kui.include(view, locals)` validates against the schema and throws a descriptive error (`Button: unknown local "colour", did you mean "variant"?`). Production skips validation.
- [ ] Typed render helper `src/lib/render.ts`: `renderPartial('ui/Button', { variant: 'ghost' })` with a generated `PartialLocalsMap` so route code gets autocomplete.
- [ ] Registry `props` field derived from the schemas via `zod-to-json-schema` (phase 8.2 consumes it); the props editor (`views/showcase/partials/props-editor.ejs`) reads the same JSON instead of hand-written controls.
- [ ] Phase 2.2's partial-render test uses the schema defaults as its input.

## 6.9 kui-ejs: raw-output policy that scales

689 `<%-` sites are tracked in a 415-line hand-written allowlist; ROADMAP says 46 violations are waiting to be added.

- [ ] Replace the grep-based audit with a scanner that classifies each `<%-` by its expression: `include(` (safe), `body` (layout), `locals.colorOverrideCss` / `cspNonce` (server-generated), `JSON.stringify(` inside `application/ld+json` (safe), a local whose schema type is `z.string().brand('SafeHtml')` (safe by contract), anything else requires a same-line annotation `<%# kui-raw: <reason> %>`.
- [ ] Generate `docs/raw-output-allowlist.md` from the annotations; delete the hand-written version.
- [ ] CI fails on unannotated sites; the phase 1 ratchet tracks the annotated count so it trends down.

## 6.10 kui-ejs: precise dead-partial detection

`scripts/find-dead-partials.sh` greps for the basename of each partial anywhere in an `include` line; same-named files in different directories (`Calendar.ejs` next to `Calendar/`) produce false results, which is why the script is informational only.

- [ ] Resolve `include('…')` paths relative to the including file, build the include graph from the layouts and the routers' `res.render` targets, and report nodes unreachable from any root.
- [ ] Turn the script into a CI gate once it has zero false positives across the smoke-test route set.

## 6.11 Naming parity

- [ ] Decide whether kui-react's `EmptyErrorState.tsx` (exports `ErrorState`, `NotFoundState`, `NoAccessState`) should be split into three files to mirror kui-ejs, or whether the EJS names are aliases. Record in `parity.exceptions.json`. Splitting is cheaper and makes the generated parity matrix cleaner.

## Definition of done

- `grep -rln 'sourceCode: \`' modules/showcase/data/sections | wc -l` is 0; the snapshot builds in Node without a browser and runs on Vercel.
- All domain forms use react-hook-form + Zod; no `useState` form state in `modules/domains/**/*Form*.tsx`.
- No file in `modules/` exceeds 500 lines except generated ones.
- `modules/app/Calendar` and `modules/app/Gantt` either consume the standalone packages or the standalone repos are archived; ADR 0007 records it.
- `app/error.tsx`, `app/not-found.tsx`, `app/sitemap.ts` exist; every theme has `error.tsx`.
- kui-ejs: every `modules/ui` partial has a `.locals.ts`; the raw-output allowlist is generated; dead-partial detection is a gate.
