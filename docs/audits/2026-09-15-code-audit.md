# Audit baseline, 2026-09-15

Every number in the phase documents comes from this audit. Re-run the commands in the last section before updating a number.

## Health summary

| Signal | kui-react | kui-ejs |
|---|---|---|
| `tsc --noEmit` | passes | passes |
| CI workflows | none (`.github/` holds only `copilot-instructions.md`) | none (same) |
| Test files | 0 | 0 |
| Git tags | 0 | 0 |
| Commits on `main` | 200 | 125 |
| npm package | `@kuraykaraaslan/kui-react` returns 404 on the registry; `package.json` says `1.0.1` | `private: true`, `0.1.0` |
| `package.json` metadata | no `license`, `repository`, `homepage`, `keywords`, `engines` | no `engines` |

Sibling packages for reference: `kui-viewer` is published and has `ci.yml` (381 commits). `kui-player` has `ci.yml` and `release.yml`. `kui-calendar` and `kui-gantt` exist as standalone repos at `0.0.1` with 5 and 3 commits.

## kui-react numbers

| Metric | Value | Where |
|---|---|---|
| Lines of TS/TSX under `modules/`, `app/`, `libs/` | ~127,400 | |
| Registry components / themes | 316 / 18 | `public/registry/components.json` |
| `.tsx` files in `modules/ui` (top level) | 59 | |
| `.tsx` files in `modules/app` | 118 | |
| `.tsx` files in `modules/domains` | 270 across 18 verticals | |
| Showcase section files | 66 | `modules/showcase/data/sections/` |
| Showcase entries with hand-copied `sourceCode` template literals | 316 entries in 61 files | `grep -rln 'sourceCode: \`' modules/showcase/data/sections` |
| Menu entries with `status: 'beta'` | 21 | `modules/showcase/data/showcase.menu.ts` |
| Files in `modules/ui` + `modules/app` missing `'use client'` | 4 | `FileInput.tsx`, `EmptyErrorState.tsx`, `FileUploadSection.tsx`, `LoadingState.tsx` |
| `any` usages (`: any`, `as any`, `<any>`) | 30 | `modules/`, `libs/`, `app/` |
| `eslint-disable` comments | 47 | same |
| `TODO` / `FIXME` / `HACK` | 358 | same |
| Raw hex colour hits in `modules/` (excluding showcase) | 40 | most are legitimate: ColorPicker palette, MapView Leaflet popup, chart datasets |
| `modules/ui` files touching `window.` / `document.` directly | 13 | |
| `forwardRef` files | 10 | React 19 makes these unnecessary |
| `dangerouslySetInnerHTML` files | 4 | |
| Domain `*Form*.tsx` files using `useState` vs `react-hook-form` | 11 vs 2 | ROADMAP #10 |
| `useA11yCheck` call sites | 0 | hook exists in `libs/hooks/useA11yCheck.ts` |
| i18n library usage | 0 | `DirectionProvider` and `LanguageSwitcher` exist, strings are hardcoded |
| `prefers-reduced-motion` references | 16 | good |
| Largest component file | `modules/ui/Table/DataTable.tsx`, 791 lines | |
| Largest showcase file | `domain-common.showcase.tsx`, 1,960 lines | next: event 1,193 · api-doc 980 · landing 767 · nft 693 |
| `next.config.ts` | empty | |
| `error.tsx` / `not-found.tsx` / `loading.tsx` / `sitemap.ts` / `robots.ts` under `app/` | none | |
| `public/sitemap.xml` URLs | 1 | |
| Library build output (`dist/`) | 2.5 MB; `app.js` CJS 294 KB | tsup, `sourcemap: false`, global `"use client"` banner |
| Package `exports` | `.`, `./ui`, `./app`, `./common`, `./styles` | 17 domain verticals not exported |
| `.junk/` (ignored) | 83 MB of cloned reference repos | |
| Commits per month 2026 | Apr 57 · May 132 · Jun 4 · Jul 1 · Aug 1 · Sep 5 | |

Stale ROADMAP rows (marked ❌ but shipped): #11 axe (`@axe-core/react` + `useA11yCheck`), #13 announce (`libs/a11y/announce.ts`), #14 `useBreakpoint`, #16 `modules/ui/index.ts`, #17 `modules/ui/lazy.tsx`, #20 `libs/utils/isBrowser.ts`.

AGENTS.md drift: domain table lacks `nft`, `reviews`; theme table lacks `nft`, `promozone`; atoms/molecules table lacks 18 components (Accordion, BrandLogo, BulkActionTable, ColorPicker, Label, Popconfirm, Progress, RangeSlider, ScrollArea, Separator, ServerDataTable, StarRating, StatCard, Statistic, TabButton, Timeline, ViewToggle, lazy).

## kui-ejs numbers

| Metric | Value | Where |
|---|---|---|
| Lines of EJS/TS/JS/CSS | ~91,800 | |
| `.ejs` files | 371 | |
| Domain partials | api-doc 15 · common 49 · invoice 6 · modem 10 · ups 6 | `modules/domain/` |
| Theme pages | 82 (`common` alone 52) | `views/theme/` |
| `<%-` raw-output sites | 689 | hand-maintained allowlist `docs/raw-output-allowlist.md` is 415 lines; ROADMAP says 46 violations pending |
| Partials containing inline `<script>` | 86 | `modules/` |
| Inline `onclick=` handlers | 96 | `modules/`, `views/` |
| CSRF references | 0 | `src/`, `views/`, `modules/` |
| Helmet CSP | disabled (`contentSecurityPolicy: false`) | `src/app.ts` |
| `compression` / cache headers | none | `src/app.ts` |
| Error handler on 500 | renders the `404` view | `src/middleware/error.ts` |
| Compiled CSS tracked in git | `public/assets/css/app.css` and `main.css` | `.gitignore` lists the wrong path `public/css/app.css` |
| `puppeteer`, `@types/qrcode` | in `dependencies` | should be dev |
| `@types/express` | `^5` while `express` is `^4.21` | |
| `robots.txt` / sitemap | none | `public/` |
| Fonts / icons | Google Fonts CDN, Font Awesome 6.7.2 CDN | kui-react uses `next/font` and Font Awesome 7 from npm |
| Hand-written client JS | `main.js` + `showcase.js`, 606 lines, unbundled, not hash-versioned | `assetVersion` hashes CSS only |
| Props editor | exists, `views/showcase/partials/props-editor.ejs`, 305 lines | kui-react has none (ROADMAP #7) |
| `.env.example` | contains `NEXT_PUBLIC_GOOGLE_TAG` (Next.js artefact) | |
| README screenshot gallery | 4 themes shown, 5 exist (`ups` missing) | |

## Cross-repo duplication

Files that were copied between the repos and have since drifted (`diff | wc -l`):

| File | kui-react | kui-ejs | Diff lines |
|---|---|---|---|
| MCP server | `scripts/mcp-server.mjs` (264 lines) | `scripts/mcp-server.mjs` (225 lines) | 110 |
| Snapshot builder | `scripts/build-registry-snapshot.mjs` | same name | 286 |
| Registry types | `modules/registry/registry.types.ts` | `src/registry/registry.types.ts` | 59 |
| Brand build | `brand/build.mjs` | `brand/build.mjs` | 78 |
| Screenshot script | `scripts/take-screenshots.js` | same name | 28 |

Design tokens are defined by hand in four places: `app/globals.css`, `styles/index.css`, `DESIGN_TOKENS` in `modules/registry/registry.ts`, and `$KUIEJS_ROOT/public/assets/css/input.css`. The token *names* match; the values are maintained separately.

Editor rule mirrors (`.cursorrules`, `.windsurfrules`, `.clinerules`, `.cursor/rules/*.mdc`, `.github/copilot-instructions.md`) are hand-maintained in both repos.

## Parity (file-name level)

| Layer | Only in kui-react | Only in kui-ejs |
|---|---|---|
| ui | `BulkActionTable`, `Timeline` | `CodeEditor`, `DiffViewer` |
| app | `FormBuilder`, `Gantt`, `NotFoundPage`, `GoogleAnalytics`, `ConditionalShell` | `ErrorState`, `NoAccessState`, `NotFoundState` (kui-react bundles these in `EmptyErrorState.tsx`), `MiniCalendar` as a top-level file |
| domains | 13 verticals (ai, blog, commerce, event, fintech, food, forum, iot, jobs, landing, media, nft, real-estate, reviews, social, travel) | `invoice`, `modem`, `ups` |

kui-ejs deliberately reverted `Gantt` and `FormBuilder` ("moved out of scope" commits). That decision is not recorded anywhere except git history.

## Stale references

| File | Stale string |
|---|---|
| `AGENTS.md:2` (both repos) | `../00_Config_and_AI_Rules` (the rules now live in `internal-ai-rules`) |
| `modules/app/README.md`, `modules/domains/README.md`, `modules/ui/README.md`, `app/theme/README.md` | `/home/kuray/02_EJS_Components/...` |
| `libs/config/showcase.config.ts:23`, `.env.example:21` | `github.com/kuraykaraaslan/next_js_components` |
| `$KUIEJS_ROOT/README.md:3`, `modules/*/README.md` | `../01_NextJS_Components/`, `/home/kuray/01_NextJS_Components/`, `/home/kuray/02_EJS_Components/` |
| `tsconfig.json` include | a stray manual entry `"app/theme/common/layout.tsx"` after the globs |

## Commands to reproduce

Run from the repo root. `E=$KUIEJS_ROOT` for the EJS repo.

```bash
# health
npx tsc --noEmit -p tsconfig.json; echo "tsc exit $?"
ls .github/workflows 2>/dev/null || echo "no workflows"
find . -not -path './node_modules*' -not -path './.junk*' \( -name '*.test.*' -o -name '*.spec.*' \) | wc -l
git tag | wc -l
npm view @kuraykaraaslan/kui-react version
npm pkg get license repository engines keywords

# kui-react code signals
grep -rn ': any\b\|as any\b\|<any>' modules libs app --include='*.ts' --include='*.tsx' | wc -l
grep -rn 'eslint-disable' modules app libs --include='*.ts*' | wc -l
grep -rn 'TODO\|FIXME\|HACK' modules app libs --include='*.ts*' | wc -l
grep -rnE '#[0-9a-fA-F]{3,8}\b' modules --include='*.tsx' | grep -v showcase | grep -v '//' | wc -l
for f in $(find modules/ui modules/app -name '*.tsx'); do head -3 "$f" | grep -q "use client" || echo "$f"; done
grep -rln 'window\.\|document\.' modules/ui --include='*.tsx' | wc -l
grep -rl 'forwardRef' modules --include='*.tsx' | wc -l
grep -rl 'useForm' modules --include='*.tsx' | wc -l
grep -rl 'useState' modules/domains --include='*Form*.tsx' | wc -l
grep -rl 'useA11yCheck' modules app | wc -l
grep -rln 'sourceCode: `' modules/showcase/data/sections | wc -l
grep -rn 'sourceCode:' modules/showcase/data/sections/*.tsx | wc -l
find modules libs -name '*.tsx' -o -name '*.ts' | xargs wc -l | sort -rn | head -15
grep -oE "status: '[a-z]+'" modules/showcase/data/showcase.menu.ts | sort | uniq -c
node -e "const r=require('./public/registry/components.json');console.log(r.generatedAt,r.components.length,r.themes.length)"

# AGENTS.md drift
for d in $(ls modules/domains | grep -v -e index.ts -e README.md); do grep -q "\`$d/\`" AGENTS.md || echo "domain missing: $d"; done
for d in $(ls app/theme | grep -v README.md); do grep -q "/theme/$d/" AGENTS.md || echo "theme missing: $d"; done
for f in $(ls modules/ui/*.tsx | xargs -n1 basename | sed 's/\.tsx//'); do grep -q "\`$f.tsx\`" AGENTS.md || echo "ui missing: $f"; done

# stale paths (both repos)
grep -rn '02_EJS_Components\|01_NextJS_Components\|00_Config_and_AI_Rules\|next_js_components' README.md AGENTS.md modules/*/README.md app/theme/README.md .env.example libs/config/showcase.config.ts

# kui-ejs
cd "$E"
grep -rn 'csrf\|csurf' src views modules | wc -l
grep -rho '<%-' modules views | wc -l
grep -rl '<script' modules | wc -l
grep -rho 'onclick=' modules views | wc -l
grep -n 'contentSecurityPolicy\|compression\|maxAge' src/app.ts
git ls-files public/assets/css
npm pkg get dependencies.puppeteer dependencies.@types/qrcode devDependencies.@types/express dependencies.express

# duplication
cd "$KUIREACT_ROOT"
diff scripts/mcp-server.mjs "$E/scripts/mcp-server.mjs" | wc -l
diff scripts/build-registry-snapshot.mjs "$E/scripts/build-registry-snapshot.mjs" | wc -l
diff modules/registry/registry.types.ts "$E/src/registry/registry.types.ts" | wc -l
diff brand/build.mjs "$E/brand/build.mjs" | wc -l

# parity (file names)
comm -3 <(ls modules/ui | sed 's/\.tsx$//' | grep -v index | sort) <(ls "$E/modules/ui" | sed 's/\.ejs$//' | grep -v README | sort)
comm -3 <(ls modules/app | sed 's/\.tsx$//' | grep -v index | sort) <(ls "$E/modules/app" | sed 's/\.ejs$//' | grep -v README | sort)
```
