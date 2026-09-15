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

- [ ] `[react]` Done in phase 6.7 (`app/sitemap.ts`, `app/robots.ts`); confirm every theme page and showcase slug is listed.
- [ ] `[ejs]` `/sitemap.xml` and `/robots.txt` routes generated from the registry; the phase 5.8 pre-render writes them as static files. `public/` has neither today.
- [ ] `[both]` `<link rel="canonical">` per page (kui-ejs `_head.ejs` currently points every page at `site.url`).
- [ ] `[both]` JSON-LD `ItemList` for the showcase index so search engines see the component catalog.

## 7.5 Dependency graph page

The registry already carries `composes[]` and `usedBy[]`.

- [ ] `[both]` `/graph` route: force-directed graph of components coloured by layer, click to open the component, filter by vertical. Render with SVG and the existing tokens; no new icon or chart library.
- [ ] `[both]` Per-component "Composes" and "Used by" lists in the component header, linking to the graph.
- [ ] `[react]` The phase 1 madge output (cycles, cross-vertical imports) is displayed on the same page in development.

## 7.6 Developer experience

- [ ] `[both]` `.vscode/extensions.json` (ESLint, Tailwind IntelliSense, EJS language support for kui-ejs) and `launch.json` for the dev server.
- [ ] `[both]` README "Ports" line: kui-react dev on 3002, kui-ejs on 3003, so both can run side by side for parity work.
- [ ] `[both]` `npm run parity:open <id>`: opens the same component in both showcases (needs both servers running).
- [ ] `[react]` `npm run new:component <layer> <Name>` scaffold: component file from the AGENTS.md template, showcase meta + previews files, test file, menu entry, and a reminder to run the snapshot. Removes the five-step manual procedure from AGENTS.md.
- [ ] `[ejs]` Same scaffold: partial, `.locals.ts`, showcase entry, menu entry.
- [ ] `[both]` Remove the editor-specific snapshot triggers (`.vscode/tasks.json` `runOn: folderOpen`, Claude `SessionStart` hook) once the pre-commit hook and CI drift check from phase 1 exist; they hide the problem from CI-only contributors.

## Definition of done

- kui-react has a props editor and sidebar search; both showcases restore variant, layout and dark mode from the URL.
- No hardcoded user-facing string in `modules/ui` without a `labels` override (react) or a `t()` call (ejs); `<html lang>` is dynamic in both.
- Both sites serve a generated sitemap and robots file.
- `/graph` exists in both showcases.
- `npm run new:component` scaffolds a registered, tested component in both repos.
