# Changelog

All notable changes to this project will be documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project uses 0-based versioning (`0.x.y`) while pre-1.0.

## [Unreleased]

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
