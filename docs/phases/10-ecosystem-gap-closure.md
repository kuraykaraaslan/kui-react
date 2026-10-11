# Phase 10: Ecosystem gap closure

**Goal:** close the gaps found by comparing KUI against five reference libraries (shadcnspace, daisyUI, FlyonUI, Preline, Aceternity UI): primitives that most of them ship and KUI does not, a palette-preset mechanism for themes, a small set of marketing and commerce blocks, two missing site themes, and the drift between the three KUI repos found while comparing. Everything is placed per use case, not copied into every repo.
**Effort:** L. Every numbered section is an independent PR.
**Depends on:** nothing hard. 4.2 (shared token source) makes 10.1 cleaner; 4.4 (parity matrix) turns the exception records below into CI checks. Independent of phase 9.
**Repos:** kui-react first; kui-ejs and KUInative only where the placement table says so. Mirror plans: `$KUIEJS_ROOT/docs/phases/10-ecosystem-gap-closure.md` and `$KUINATIVE_ROOT/docs/phases/10-ecosystem-gap-closure.md`.
**Origin:** survey of 2026-10-11. The raw inventories (about 2 200 blocks, 410 components, 35 + 17 + 9 colour palettes, about 100 templates and pages) were collected outside the repos; the evidence each section needs is quoted inline as "Seen in N/M sites".

## Placement and parity rules for this phase

The owner's standing rules, as in phase 9, applied to this phase:

1. **Not everything in all three.** Placement follows the use case and the existing contract ([ADR 0003](../adr/0003-react-ejs-parity-contract.md), the parity section of kui-ejs `AGENTS.md`, KUInative's parity audit scope):
   - **KUInative** only gets ui-layer primitives that make sense on a phone. No marketing blocks, themes or app-layer items.
   - **kui-ejs** shares only the ui layer, the app layer and the `common` and `api-doc` verticals. Landing, commerce, blog, AI and the other React-only verticals stay React-only; widening that is ADR 0008, not this phase.
   - Web-only interaction patterns (keyboard hints, scrollspy, resizable panes) are `[both]` without native.
2. **Pixel-perfect when it lands in more than one repo.** The mirror is a task in the same section, never a follow-up. "Pixel-perfect" is ADR 0003's definition: same DOM shape and class names, same prop / local names and defaults, same token names and values, same icon and font versions. kui-react is built and snapshotted first.
3. **Everything added is visible in the demo shell.** Each new component, prop or theme gets a showcase section file (at least two variants) and a `showcase.menu.ts` entry in the group named in its section, then `npm run registry:snapshot`. kui-ejs does the same (`src/data/showcase.menu.ts`); KUInative adds its demo to `modules/showcase/registry.tsx` and runs `npm run showcase:sync`. Themes also get a route and an entry in the **Themes** group.

Tags as in phase 9: `[react]` only kui-react · `[ejs]` only kui-ejs · `[both]` kui-react + kui-ejs, and **`+native`** after a tag means "also mirror in KUInative". A deliberately one-sided item gets a line in `parity.exceptions.json` with the reason "new in phase 10, no counterpart".

Existence was checked on 2026-10-11:

| Item | kui-react | kui-ejs | KUInative |
|---|---|---|---|
| Carousel, OtpInput, List, Marquee, SortableList, Kbd, Link, CookieConsent, palette presets | missing | missing | missing (`Text` covers part of Link) |
| `Timeline` | `modules/ui/Timeline.tsx` | **missing** | `modules/ui/Timeline.tsx` |
| `BulkActionTable` | yes | **missing** | yes |
| CTA, contact, bento grid, integrations, product quick view blocks | missing | not in scope (React-only verticals) | not in scope |
| Portfolio and agency themes | missing | not in scope | not in scope |
| Named colour palettes | light and dark only (`ThemeSwitcher`) | light and dark only | `configureTheme()` overrides one brand, no named presets |
| `AccessibilityKit`, `AppDrawer`, `FormField`, `NotificationSystem`, `StepFlow`, `ServerDataTable` | files exist, **no showcase entry** | showcase entry exists | not in scope |
| `MiniCalendar`, `NoAccessState` | absent | partials exist, **no showcase entry** | not in scope |

## 10.0 Housekeeping first: make the three repos agree `[react]` / `[ejs]` / `[both]`

New items are only trustworthy if what exists today is visible and recorded. All small; do these before 10.1 onwards.

- [ ] `[react]`: showcase sections and `showcase.menu.ts` entries for `AccessibilityKit`, `AppDrawer`, `FormField`, `NotificationSystem`, `StepFlow`, `ServerDataTable` (kui-ejs already has them: copy the variants, keep titles identical), then `npm run registry:snapshot`.
- [ ] `[ejs]`: showcase sections and menu entries for `MiniCalendar` and `NoAccessState`, then `npm run registry:snapshot`. Neither exists in kui-react; record an exception for each (ejs-only, with reason) rather than creating them there.
- [ ] `[ejs]` `+native`: port `Timeline` to kui-ejs (`modules/ui/Timeline.ejs`, same locals and DOM as `Timeline.tsx`, showcase entry). KUInative already has it: re-check it against the kui-react classes while here.
- [ ] `[ejs]` `+native`: port `BulkActionTable` to kui-ejs the same way (KUInative has it).
- [ ] `[react]`: reconcile `parity.exceptions.json` with the real registries (4.4 does this by CI; until then by hand). Today it holds one record (`schema-form`). Add a record for every deliberately one-sided ui or app component that exists now, including the ones phase 9 created react-only or ejs-only.
- [ ] `[react]`: refresh stale text. ADR 0003 lists `CodeEditor` and `DiffViewer` as EJS-only (kui-react has both now) and omits the EJS-only Email Templates theme; kui-ejs `AGENTS.md` says "13 verticals" and lists 16 names.

## 10.1 Palette presets (themes) `[both]` `+native`

Seen in 3/3 sites that ship themes (daisyUI 35 palettes, FlyonUI 17, Preline 9): named palettes switched with one attribute, nestable on any element, over a single shared token set. KUI has light and dark only; KUInative can override one brand through `configureTheme()` but has no named presets.

- [ ] One token-preset source (build on 4.2): each preset is a named map over the existing design tokens, with a light and a dark value set. kui-react (`styles/index.css`), kui-ejs (`public/assets/css/input.css`) and KUInative (`libs/theme.ts`) are generated from it or compared against it in a test. Token names and values identical in all three.
- [ ] Web: `data-theme="<preset>"` on `<html>` or any ancestor, nestable, composes with the existing `.dark` class and the pre-paint theme bootstrap script. KUInative: named presets in `themes` / `tokenMaps`; `configureTheme()` keeps working and is applied on top of the active preset.
- [ ] First set (proposed, owner to confirm): `corporate`, `luxury`, `pastel`, `black`, `ocean`, `retro`. More only after the mechanism ships.
- [ ] `ThemeSwitcher` (kui-react, kui-ejs) gets a palette picker next to light / dark / system; the choice persists with the same `localStorage` approach as the mode.
- [ ] Showcase: `ThemeSwitcher` page gets a "Palette" variant (App Concepts group); a live preview that renders one card set under each preset, nested to prove nesting. KUInative: "Theme customization" (Foundations group) gets a "Presets" variant.
- [ ] Visual regression: one snapshot per preset in kui-react and kui-ejs (`test:visual`); KUInative compares `tokenMaps` against the shared source in a unit test. Contrast check (axe) per preset.

## 10.2 Primitives `[both]` `+native`

Each item: kui-react component, kui-ejs partial with identical locals and DOM, KUInative component with identical props and showcase variant titles (rule 2), registry and showcase entries (rule 3).

### 10.2.1 `Carousel` — seen in 5/5 sites. Group: Organisms

- [ ] Scroll-snap track, `items`, `slidesPerView`, optional arrows, dots, `loop`, `autoplay` (paused on hover and under reduced motion), keyboard (arrows) and swipe. kui-ejs: CSS scroll-snap plus a small script, same DOM. KUInative: horizontal paging list with the same props and indicator.
- [ ] Variants: basic, multi-slide, autoplay, with thumbnails.

### 10.2.2 `OtpInput` — seen in 4/5. Group: Molecules

- [ ] `length` (default 6), `value` / `onChange`, `onComplete`, paste splitting, auto-advance and backspace, `autoComplete="one-time-code"`, numeric or alphanumeric, error state. KUInative: same props, `textContentType="oneTimeCode"`.
- [ ] Wire it into the Common theme `auth/two-factor` and `auth/verify-email` pages in kui-react, and in kui-ejs where the page exists (first consumers).

### 10.2.3 `List` and `ListItem` — seen in 4/5. Group: Molecules

- [ ] Row list with leading and trailing slots, title, description, divider and selectable variants, dense size. Also the base for the description / key-value list (backlog) and for NotificationListItem-style rows.

### 10.2.4 `Marquee` — seen in 3/5. Group: Organisms

- [ ] Infinite horizontal scroller: `speed`, `direction`, `pauseOnHover`, `gap`, reduced-motion fallback (static row). Used by logo clouds and testimonial strips (10.3). KUInative: same props over an animated row.

### 10.2.5 `SortableList` — seen in 3/5. Group: App Concepts

- [ ] Generic drag-to-reorder list extracted from the existing `KanbanBoard` drag code (`useDnD.ts` in kui-react, `dnd.js` in kui-ejs) so both share one implementation; keyboard reordering (space to lift, arrows, space to drop) with live-region announcements. KUInative: gesture-handler reorder with the same `onReorder` contract.
- [ ] `KanbanBoard` is refactored onto it without a visual change (snapshots must not move).

### 10.2.6 `Kbd` and `Link` `[both]` — seen in 5/5 and 3/5. Group: Atoms

- [ ] `Kbd`: key-cap styled element, sizes, combination helper (`['Ctrl', 'K']`); first use in `CommandPalette` hints. `Link`: tokenised anchor with `variant` (default, muted, underline-on-hover), external-link icon and `rel` handling, `next/link` aware in kui-react. No native copy (KUInative `Text` covers it).
- [ ] Exception records: `Kbd` and `Link` absent in KUInative.

## 10.3 Web blocks `[react]`

Landing and commerce verticals are React-only (ADR 0003). Each block is a composed section under `modules/domains/landing/` or `modules/domains/commerce/`, data through props, no new tokens, a showcase entry in the matching Domain group, and used by the theme named. Exception record for each: absent in kui-ejs and KUInative.

- [ ] `CtaSection` — seen in 4/4 block sites. Variants: centred, split with image, with background. Domain — Landing. Use it on the Landing theme.
- [ ] `ContactSection` — seen in 4/4. Form built on the existing `Form`, details and map-free location block. Domain — Landing. Use it on the Landing theme.
- [ ] `BentoGrid` — seen in 3/4. Grid of mixed-size cards with slots. Domain — Landing.
- [ ] `IntegrationsGrid` — seen in 3/4. Logo tiles with name, short description and status. Domain — Landing.
- [ ] `ProductQuickView` — seen in 3/4. `Modal` plus `ProductImageGallery`, variant picker, add-to-cart. Domain — Commerce. Use it on the Commerce theme product list.
- [ ] `[both]` `CookieConsent` — seen in 3/4. Bottom bar and settings popup, accept / reject / customise, remembers the choice, no tracking before consent. Group: Organisms. Not in KUInative (native apps use the OS consent flow).

## 10.4 Themes (site templates) `[react]`

Seen in 4/4 template sellers: portfolio / personal site and agency / studio site. Each is a self-contained multi-page theme under `app/theme/<vertical>/` with `layout.tsx`, a `<vertical>.data.ts`, a README and a route entry, in the style of the existing themes.

- [ ] `portfolio` theme: home, projects, project detail (`[slug]`), about, contact. Uses `CtaSection`, `ContactSection`, `BentoGrid`.
- [ ] `agency` theme: home, services, case studies, team, contact. Uses `CtaSection`, `Marquee`, `IntegrationsGrid`.
- [ ] Add both to the **Themes** group in `showcase.menu.ts`, to `tests/visual/themes.spec.ts`, and run `npm run registry:snapshot`. Exception records: absent in kui-ejs.

## 10.5 Backlog (offered by two sites or one; do only on request) `[both]` / `[react]`

Not scheduled. Listed so the survey result is not lost; each needs the same three-rule treatment when picked up.

- Primitives, two sites: `Indicator` (badge overlay), input-number stepper (react done; verify ejs, add native), `StatusDot`, strong-password meter, copy-to-clipboard button (promote the showcase-only `CopyButton`), read-only `CodeBlock` (promote the showcase source block), `Scrollspy` and resizable split panes (web only), typography / prose foundation page (web).
- Primitives, one site: countdown, floating action button, input mask, animated count-up, attachment chip.
- Blocks, two sites: newsletter capture, waitlist, app-store badges, product comparison, frequently-bought-together, mega footer, email / inbox application, ticket workspace, invoice / receipt (kui-ejs already has an invoice domain; React-only gap by design).
- Blocks, one site: services section, notes application, activity feed, description list, order tracking, message composer, emoji rating, roadmap section for kui-ejs.
- Themes: general and ecommerce admin dashboards, FAQ / changelog / contact / integrations pages, CRM, CMS, LMS, help desk, inbox, mobile-app marketing page.

Deliberately not planned (decorative, one site, or off-audience): animated backgrounds and shaders, motion illustrations, 3D / tilt cards, text effects, device mockups, bio-link pages, video-call layouts.

## Order

10.0 first (it is cheap and makes the catalog honest), then 10.1 (every later visual check runs under the presets), then 10.2.2, 10.2.1 and 10.2.3 (they unblock the two-factor pages and 10.3), then 10.2.4, 10.2.5, 10.2.6, then 10.3, then 10.4. 10.5 only on request.

## Open decisions (proposed defaults in the sections above; owner to confirm)

- ADR 0008 (kui-ejs domain scope): this phase assumes landing and commerce blocks and the two themes stay React-only. If kui-ejs gets a landing vertical, 10.3 and 10.4 gain `[both]` mirrors.
- Palette count and names (10.1) and whether `configureTheme()` stays as the override layer on KUInative (proposed: yes, on top of the preset).
- Native chat and messaging components: three reference sites ship them, KUInative has none and its scope excludes the app layer. Proposed: out.

## Definition of done

- Every new component exists with identical props / locals and DOM shape in each repo its section names, and has a showcase entry (at least two variants) in the named demo group of each of those repos; `npm run registry:snapshot` is committed (and `npm run showcase:sync` in KUInative).
- No tokens are added except through the shared preset source (10.1); no raw hex in any new file.
- `npm run test:visual` passes in kui-react and kui-ejs with new baselines for every new component and every palette preset; axe reports no new violations.
- Every one-sided item has a line in `parity.exceptions.json`. After 10.0, the registries of the three repos differ only by recorded exceptions.
- The showcase shell lists every component that exists on disk (no file without a menu entry).
