# Changelog

All notable changes to this project will be documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- `package.json` gained `license`, `repository`, `homepage`, `bugs`, `engines`, `keywords`. The
  package has been resolvable from `package.json` alone since 1.0.0 but shipped without this
  metadata until now.
- `@types/leaflet` moved from `dependencies` to `devDependencies` — it was only ever needed to
  build this repo's own `MapView`/`VenueLeafletMap` components, not by consumers of the
  published package.

### Fixed

- Four components (`FileInput`, `EmptyErrorState`, `FileUploadSection`, `LoadingState`) were
  missing the `'use client'` directive required by every file in `modules/ui`/`modules/app`.

### Docs

- `AGENTS.md`: filled in the domain-vertical table (`nft`, `reviews` were shipped but
  undocumented), the theme table (`nft`, `promozone`), and the ui atoms/molecules tables (17
  components that existed but had no row).
- `ROADMAP.md`: six rows (#11, #13, #14, #16, #17, #20) were marked "not implemented" for
  features that had already shipped (`useA11yCheck`, `announce()`, `useBreakpoint`,
  `modules/ui/index.ts`, `lazy.tsx`, `isBrowser`); coverage and the summary table are
  recomputed.
- Fixed stale absolute-path references (`/home/kuray/00_Config_and_AI_Rules`,
  `/home/kuray/02_EJS_Components`, a dead GitHub URL) across `AGENTS.md` and module READMEs.
- Added `docs/adr/` with the first four architecture decision records, and
  `docs/dev/` with a phased improvement plan (see `docs/dev/README.md`).
- Added standard repo hygiene files: `SECURITY.md`, `CODE_OF_CONDUCT.md`, `.github/CODEOWNERS`,
  issue templates, a PR template.

## [1.0.1] — 2026-06-11

### Added

- README theme-demo screenshot gallery, for the npm registry page.

## [1.0.0] — 2026-06-07

### Added

- **Library build.** `tsup` builds `index.ts`, `modules/ui/index.ts`, `modules/app/index.ts`,
  and `modules/domains/common/index.ts` to ESM + CJS with type declarations, published as
  `@kuraykaraaslan/kui-react`. `npm run build:lib`; `prepare` runs it on install.

- **`LanguageSwitcher` and `I18nTypes` no longer guess a country from a language code.** The
  old heuristic was `lang.toUpperCase()`, which is correct only where a language code happens
  to coincide with the country code of a place that speaks it — a mostly-European accident.
  Elsewhere it either produced a non-country (`ja`→`JA`, `ko`→`KO`, `zh`→`ZH`; the emoji is two
  meaningless letters and `flagcdn.com/w40/ja.png` is a 404) or, worse, a real but wrong
  country: `ky` (Kyrgyz) → `KY`, the **Cayman Islands**, when Kyrgyzstan is `KG`. That second
  class is silent — nothing throws, nothing 404s, and the wrong flag looks deliberate.
  `langToRegion()` is now an explicit map and returns `null` for languages it does not know, so
  an unmapped language renders with **no** flag rather than somebody else's.
- **`getOgLocale` no longer emits a wrong territory.** It returns the bare language (`ky`)
  instead of a fabricated pair (`ky_KY`) when the region is unknown.
- **`getLangFlagUrl` is now `string | null`** instead of returning a URL that either 404s or
  loads the wrong country's flag. **Breaking** for any caller that assumed a string.
- **`LanguageSwitcher` no longer keeps its own second copy of the mapping.** It had a private
  five-entry `langToCountry` (`en, tr, de, fr, ar`) and fell through to the heuristic for
  everything else; it now reads the one map in `I18nTypes`. The `icon: … as any` cast went with
  it — `DropdownItem.icon` is `React.ReactNode`, so the cast was never needed and its comment
  ("DropdownMenu string bekliyor") was wrong.

## 2026-05-17 — 10 new theme pages + 27 new domain components

### Added — Theme routes

- **10 new routes across 5 themes:**
  - Media: `studio`, `playlists/[slug]`
  - Forum: `users/[username]`, `topics/new`
  - Food: `orders/[orderId]`, `cuisines/[slug]`
  - IoT: `devices/[slug]/metrics`, `alerts/[id]`
  - Fintech: `portfolio`, `cards`

### Added — Domain components (27 total, all with ≥2 showcase variants)

- **Media (5):** `ChannelStatsCard`, `VideoPerformanceRow`, `WatchTimeChart`, `PlaylistHeaderCard`, `PlaylistVideoRow`
- **Forum (5):** `ForumUserCard`, `ReputationBar`, `BadgeShelf`, `UserActivityRow`, `PostComposer`
- **Food (6):** `OrderTrackingTimeline`, `CourierCard`, `EtaCountdownCard`, `CuisineHeroBanner`, `CuisineTagChip`, `FeaturedDishCard`
- **IoT (5):** `MetricSparklineCard`, `TelemetryTimeSeriesChart`, `LogStreamRow`, `AlertDetailHeader`, `AlertEventTimeline`
- **Fintech (6):** `PortfolioHoldingRow`, `AssetAllocationCard`, `PerformanceSparkline`, `PaymentCardTile`, `CardLimitMeter`, `CardActionMenu`

### Added — AI-discoverability layer

- **Machine-readable component registry** at `modules/registry/registry.ts`, exposed via:
  - `GET /api/registry` — full registry JSON (every component, theme, design token, convention).
  - `GET /api/registry?index=1` — index-only variant without source code (~5x smaller).
  - `GET /llms-full.txt` — long-form markdown dump of the entire catalog.
- **`public/llms.txt`** — concise [llms.txt convention](https://llmstxt.org/) overview pointing AI agents at the registry and conventions.
- **AGENTS.md upgrade** — top-of-file "AI agent quick reference" section with the registry URLs and search recipe; fixed outdated domain/theme tables (now reflects all 16 verticals + 16 themes).
- **Extended `ShowcaseComponent` schema** with optional AI-facing fields (`whenToUse`, `whenNotToUse`, `composes`, `relatedTo`, `a11y`, `designTokens`, `dependencies`) — backward compatible.

### Added — Modularity (barrel exports)

- `index.ts` barrel exports for all 16 domain verticals: `import { ProductCard } from '@/modules/domains/commerce'`.
- Top-level domain barrel at `modules/domains/index.ts` with namespaced re-exports: `import { Commerce, Blog } from '@/modules/domains'`.
- `modules/app/index.ts` barrel covering all 25 app patterns.

### Added — Showcase coverage

- `BrandLogo` showcase entry in atoms.
- `AppBreadcrumbs`, `AppFooter`, `ThemeSwitcher` showcase entries in app patterns (new `app-extras.showcase.tsx` builder).

### Fixed — Convention hygiene

- `modules/ui/BrandLogo.tsx` now starts with `'use client';` per AGENTS.md rule.
- Removed unnecessary `'use client'` from `app/theme/ai/page.tsx` and `app/theme/social/page.tsx` (server-default; layout already owns client state). Travel page kept as client (uses `useState`).
- Resolved sidebar abbreviation collisions: `Sl`, `Cb`, `Sc`/`SC` are now globally unique. `Slider` re-categorised from `Molecule` to `Organism`.

### Removed

- Empty placeholder theme directories: `app/theme/builder/`, `app/theme/gis/`, `app/theme/festival/`.

## [0.1.0] — 2025-09 onwards

Initial public version. See `git log` for history prior to this changelog.
