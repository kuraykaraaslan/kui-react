# Phase 4: Shared tooling and parity

**Goal:** stop maintaining the same code twice. Five scripts, the registry types, the brand build, the design tokens and five editor-rule mirrors are copied between kui-react and kui-ejs and have drifted (see the audit's duplication table). After this phase each of those has exactly one source, and parity between the two repos is computed, not hand-written.
**Effort:** L.
**Depends on:** phase 1 (CI to verify generated files), phase 3 (publishing workflow to reuse for the new packages).
**Repos:** both, plus two new packages.

## 4.1 `@kuraykaraaslan/kui-tooling`

A new repo following `KUI_Package_Rules` naming (`kui-tooling`, key `KUITOOLING_ROOT` in `LOCAL_PATHS.json`). Plain TypeScript, no React. Published to npm; both showcase repos take it as a devDependency.

Contents, each with a `bin` subcommand `kui-tooling <cmd>`:

- [ ] `registry` types + `registry-v1.json` JSON Schema. Both repos delete their copies (`modules/registry/registry.types.ts`, `src/registry/registry.types.ts`, `public/schemas/registry-v1.json`) and import from the package. The schema file is copied into `public/schemas/` at build time.
- [ ] `snapshot`: writes `components.json`, `components.index.json`, `components/*.md`, `_index.json` from a `Registry` object. The *producer* of the object stays repo-specific (react needs phase 6 to become browser-free; ejs already imports its data with `tsx`). The writer is identical and moves here.
- [ ] `mcp`: the stdio MCP server. Takes a `--registry <path|url>` argument and a `--framework react|ejs` label. Both `.mcp.json` files become `{"command": "npx", "args": ["-y", "@kuraykaraaslan/kui-tooling", "mcp", "--registry", "public/registry/components.json"]}`.
- [ ] `brand`: the SVG-to-favicon/OG/manifest generator from `brand/build.mjs`, parameterised by a `brand.config.json` in each repo.
- [ ] `screenshots`: the Playwright-based theme screenshot runner from phase 2.
- [ ] `parity`: see 4.4.
- [ ] `rules-sync`: see 4.5.
- [ ] `stale-strings` and `debt-ratchet` from phase 1, so both repos share one implementation and one baseline format.

Migration order: types → snapshot writer → mcp → the rest. Delete the local copy in the same PR that switches to the package; never keep both.

## 4.2 `@kuraykaraaslan/kui-tokens`

Design tokens are written by hand in four places today. The token names match, the values are maintained independently, and `DESIGN_TOKENS` in `modules/registry/registry.ts` carries only the light values.

- [ ] Create `kui-tokens` with a single `tokens.json` in the W3C Design Tokens (DTCG) format: colour (light + dark), radius, shadow, spacing scale, typography, and the missing motion tokens (`duration.fast/base/slow`, `easing.standard/emphasized`) from ROADMAP #32.
- [ ] Build outputs from that file: `dist/tokens.css` (`:root` + `.dark`), `dist/tokens.tailwind.css` (the `@theme inline` block), `dist/tokens.json` (flat, for the registry `DESIGN_TOKENS`), `dist/tokens.ts` (typed constants for scripts and the props editor).
- [ ] Include the `prefers-reduced-motion` block (ROADMAP #33) in `tokens.css` so both repos get it for free.
- [ ] kui-react: `app/globals.css` and `styles/index.css` `@import` the package outputs; delete the hand-written blocks. `registry.ts` imports `dist/tokens.json`.
- [ ] kui-ejs: `public/assets/css/input.css` imports the same; the env-driven colour override (`buildShowcaseColorCss`) keeps working because it only writes CSS variables on top.
- [ ] Move `brand/` (mark, wordmark, OG card SVGs, `geometry.mjs`) into `kui-tokens/brand/`; both repos consume the built PNG/ICO/SVG via `kui-tooling brand`.
- [ ] Token audit becomes trivial: any hex in a component that is not in `tokens.json` is a violation (phase 1 scripts read the JSON instead of a regex allowlist).

## 4.3 Version alignment between the repos

The parity rule says components must render pixel-identical, but the two repos load different icon and font versions.

- [ ] `[ejs]` Font Awesome 7 to match kui-react. Options: switch the CDN link to a 7.x build, or self-host from `@fortawesome/fontawesome-free` with a sync script like kui-react's `scripts/sync-kui-viewer-assets.mjs` copying into `public/assets/vendor/`. Self-hosting is preferred because phase 5's CSP gets simpler.
- [ ] `[ejs]` Self-host Geist and Geist Mono (`@fontsource/geist`, `@fontsource/geist-mono`) instead of the Google Fonts CDN. kui-react already self-hosts through `next/font`.
- [ ] `[ejs]` Zod 4 to match kui-react, so domain schemas can be shared or at least copied verbatim.
- [ ] `[both]` Tailwind minor versions pinned to the same value in both `package.json` files; Dependabot groups from phase 1 keep them together.
- [ ] `[both]` Record the alignment rule in `docs/adr/0003-react-ejs-parity-contract.md`: "same icon set version, same font files, same token package version".

## 4.4 Generated parity matrix

The `Parity` tables in `modules/*/README.md` (both repos) are hand-written, point at directories that no longer exist, and cannot express "intentionally skipped".

- [ ] `kui-tooling parity --react <components.index.json> --ejs <components.index.json> --exceptions parity.exceptions.json --out docs/dev/parity.md` producing one table: `id · layer · react · ejs · status` where status is `both`, `react-only`, `ejs-only`, `skipped`.
- [ ] `parity.exceptions.json` in each repo, seeded from the audit: react-only by design `FormBuilder`, `Gantt`, `GoogleAnalytics`, `ConditionalShell`, `NotFoundPage`; ejs-only by design `invoice/*`, `modem/*`, `ups/*`; naming aliases `EmptyErrorState ↔ ErrorState/NoAccessState/NotFoundState`, `Calendar/MiniCalendar`. Every entry has a `reason`.
- [ ] CI (nightly) regenerates `docs/dev/parity.md` in both repos and opens a PR when it changes; unexplained `react-only` or `ejs-only` rows fail the job.
- [ ] Delete the hand-written parity tables from all six module READMEs and link to the generated file.
- [ ] Real gaps to close or classify after the first run: `BulkActionTable` and `Timeline` (react-only ui), `CodeEditor` and `DiffViewer` (ejs-only ui), and the 13 domain verticals that only exist in kui-react.

## 4.5 Generated editor-rule mirrors and AGENTS.md tables

- [ ] `kui-tooling rules-sync`: reads `AGENTS.md`, extracts the sections marked with `<!-- rules:begin -->` … `<!-- rules:end -->`, and writes `.cursorrules`, `.windsurfrules`, `.clinerules`, `.cursor/rules/<repo>.mdc`, `.github/copilot-instructions.md` with a "generated, do not edit" header.
- [ ] CI drift job: run `rules-sync` and `git diff --exit-code` on the five files.
- [ ] AGENTS.md component tables: either generate them from `components.index.json` with a `docs-sync` subcommand (marker-delimited blocks, same mechanism) or remove them and keep the registry pointer only. Recommendation: generate the layer-level tables (ui, app) and drop the per-domain sample lists, which go stale fastest.
- [ ] Same for the module-layer counts in `README.md` (phase 0.4).

## 4.6 Unified MCP surface

- [ ] One MCP server serving both catalogs: `--registry react=<path> --registry ejs=<path>`; every tool gains an optional `framework` argument; `get_component` can return both implementations side by side, which is the single most useful thing for porting.
- [ ] Add MCP **resources** (`kui://react/components/button`, `kui://ejs/components/button`, `kui://tokens`) so clients that prefer resources over tools can browse.
- [ ] Add MCP **prompts**: "port this component to the other framework", "audit this file against KUI conventions", "pick components for a <vertical> page".
- [ ] Publish as `@kuraykaraaslan/kui-mcp` (thin bin over kui-tooling) so `npx @kuraykaraaslan/kui-mcp` works without cloning either repo. Document the Claude Desktop / Cursor / Zed config snippet in both READMEs.

## Definition of done

- `diff` between the two repos' `scripts/` folders finds no shared file; both depend on `@kuraykaraaslan/kui-tooling`.
- `grep -c '^\s*--primary' app/globals.css styles/index.css` returns 0 in kui-react; tokens come from `@kuraykaraaslan/kui-tokens`.
- `docs/dev/parity.md` exists in both repos, regenerated by CI, with zero unexplained rows.
- The five editor-rule files carry a generated header and CI fails if edited by hand.
- kui-ejs renders Font Awesome 7 and self-hosted Geist.
