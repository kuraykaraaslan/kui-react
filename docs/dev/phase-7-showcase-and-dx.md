# Phase 7: Showcase and developer experience

**Goal:** make the showcase usable at 316 components and turn it into the primary documentation surface; add the i18n, sitemap and graph features both roadmaps list as open.
**Effort:** M.
**Depends on:** phase 4 (tokens and parity data), phase 6 (metadata split makes the showcase data cheap to load; locals contract feeds the props editor).
**Repos:** both.

## 7.1 Props editor for kui-react (ROADMAP #7)

kui-ejs already ships a working props editor (`views/showcase/partials/props-editor.ejs`, 305 lines). kui-react has none.

- [ ] `[react]` `modules/showcase/ui/PropsEditor.tsx`: renders controls from a `controls: ControlDef[]` array on the showcase entry (`select`, `boolean`, `text`, `number`, `icon`), re-renders the variant preview with the chosen props, and shows the resulting JSX in the code pane.
- [ ] `[react]` Seed `controls` for `modules/ui` atoms by hand; phase 8.2 derives them from docgen.
- [ ] `[react]` Shareable state: serialise the editor state to a `?p=<base64>` query param (ROADMAP #42) and restore on mount.
- [ ] `[ejs]` Point the existing editor at the `.locals.ts` schemas from phase 6.8 so the two editors share one control vocabulary.

## 7.2 Search, URL state, grid, theme toggle

- [ ] `[both]` Sidebar search (ROADMAP #18): client-side filter over `components.index.json` by title, description, layer, status, vertical; highlight the match; keyboard `⌘K` opens the existing `CommandPalette` (react) / `AppCommandBar` (ejs) with the same index.
- [ ] `[both]` URL state (ROADMAP #34): `?v=<variant>&layout=side|stack|grid&dark=1`; react via `useSearchParams` + `router.replace`, ejs via `history.replaceState`. Deep links in bug reports become possible.
- [ ] `[both]` Variant grid view (ROADMAP #21): `layout: 'grid'` renders every variant at once.
- [ ] `[both]` Theme selector in the top bar (ROADMAP #36) that sets `data-theme` on the preview container using the existing env-driven colour override CSS; demonstrates white-labelling without a rebuild.
- [ ] `[react]` `app/[slug]/page.tsx` should statically generate every slug (`generateStaticParams` from `NAV_GROUPS`) and load only the section that owns the slug; today `ShowcaseDetail` pulls in all 66 sections.
- [ ] `[both]` Status badges (ROADMAP #19) are rendered in the sidebar already; also show `since` and the per-component `version` from phase 3.7 in the component header, with a collapsible changelog (ROADMAP #24).

## 7.3 i18n foundation (ROADMAP #22)

Both repos hardcode `lang="en"` and English strings inside components (`aria-label="Dismiss"`, "Loading content", …). `DirectionProvider` and `LanguageSwitcher` exist in kui-react but no string ever passes through them.

- [ ] `[react]` `labels` prop convention: every user-facing string in `modules/ui` and `modules/app` becomes an optional prop with an English default (`labels?: Partial<ButtonLabels>`), and a `LabelsProvider` in `modules/app` supplies overrides globally. No i18n library dependency inside the package; consumers bring their own.
- [ ] `[react]` Audit script: `grep -rhoE 'aria-label="[^"]+"' modules/ui | sort | uniq -c` and the same for visible text nodes; add the count to the ratchet.
- [ ] `[react]` `app/layout.tsx` sets `lang` and `dir` from `DirectionProvider`'s locale.
- [ ] `[ejs]` `res.locals.t = (key) => dict[lang][key] ?? key` with `src/i18n/<lang>.json`, `lang` from a cookie then `Accept-Language`; layouts use `<html lang="<%= lang %>" dir="<%= dir %>">`. Partials call `t('dismiss')` with an English fallback.
- [ ] `[both]` Ship `en` only; the point is that a second locale needs no component change.

## 7.4 Sitemap, robots, SEO

- [x] `[react]` `app/sitemap.ts` + `app/robots.ts`, reading the committed registry snapshot (334 URLs: homepage + every showcase slug + every theme root route). Found two stale placeholder files (`public/robots.txt` pointed at `example.com`, `public/sitemap.xml` had exactly one URL) silently shadowing the dynamic routes — Next.js's static `public/` serving wins over `app/` special files with the same path, so they were dead code until the placeholders were deleted.
- [x] `[ejs]` `GET /sitemap.xml` and `GET /robots.txt` added to `src/routes/api.ts`, built from `buildRegistryIndex()` (213 URLs). No pre-render step (phase 5.8 not started) — served dynamically on every request instead, same as the AI-discoverability endpoints already in that file.
- [x] `[both]` `<link rel="canonical">` per page. react: `app/[slug]/page.tsx`'s `generateMetadata` now returns `alternates.canonical` (covers all ~315 showcase pages; the 127 theme `page.tsx` files still fall back to the layout's canonical — left as a follow-up, out of scope for this pass). ejs: both `views/partials/_head.ejs` (theme pages) and `views/showcase/index.ejs` (component + homepage, which renders with `layout: false` and has its own separate `<head>`) needed independent fixes, both now built from `res.locals.currentPath`.
- [x] `[both]` JSON-LD `ItemList` for the showcase index. react: `app/page.tsx`. ejs: appended to `views/showcase/index.ejs`'s existing `@graph`, only on the homepage.

## 7.5 Dependency graph page

The registry already carries `composes[]` and `usedBy[]`.

- [ ] `[both]` `/graph` route: force-directed graph of components coloured by layer, click to open the component, filter by vertical. Render with SVG and the existing tokens; no new icon or chart library.
- [ ] `[both]` Per-component "Composes" and "Used by" lists in the component header, linking to the graph.
- [ ] `[react]` The phase 1 madge output (cycles, cross-vertical imports) is displayed on the same page in development.

## 7.6 Developer experience

- [x] `[both]` `.vscode/extensions.json` and `launch.json` for the dev server. kui-react: ESLint + Tailwind IntelliSense. kui-ejs: Tailwind IntelliSense + EJS language support only — it has no eslint config at all (uses the bash-script token/spacing audits instead), so recommending the ESLint extension there would be wrong.
- [x] `[both]` README "Ports" line. Also fixed a real bug found along the way: kui-react's README claimed `npm run dev` serves `http://localhost:3000`; `package.json`'s `dev` script has run on 3002 for a while.
- [x] `[both]` `npm run parity:open <id>`: prints both dev URLs and tries the platform's native browser launcher, falling through to just the printed URLs with no local browser to open (headless/remote dev, this session included).
- [ ] `[react]` `npm run new:component <layer> <Name>` scaffold: component file from the AGENTS.md template, showcase meta + previews files, test file, menu entry, and a reminder to run the snapshot. Removes the five-step manual procedure from AGENTS.md.
- [ ] `[ejs]` Same scaffold: partial, `.locals.ts`, showcase entry, menu entry.
- [ ] `[both]` Remove the editor-specific snapshot triggers (`.vscode/tasks.json` `runOn: folderOpen`, Claude `SessionStart` hook) once the pre-commit hook and CI drift check from phase 1 exist; they hide the problem from CI-only contributors. **Not yet** — checked both repos' pre-commit hooks (husky/lint-staged): they only run `eslint --fix`/audit scripts, not `registry:snapshot`. CI's `snapshot-drift` job catches staleness but nothing locally auto-fixes it the way this task does for VS Code users, so removing it now would be a real regression with no replacement, not the "these are redundant now" cleanup the phase text describes.

## Definition of done

- kui-react has a props editor and sidebar search; both showcases restore variant, layout and dark mode from the URL.
- No hardcoded user-facing string in `modules/ui` without a `labels` override (react) or a `t()` call (ejs); `<html lang>` is dynamic in both.
- Both sites serve a generated sitemap and robots file.
- `/graph` exists in both showcases.
- `npm run new:component` scaffolds a registered, tested component in both repos.
