# Phase 5: kui-ejs security and runtime

**Goal:** bring kui-ejs up to the security baseline that `internal-ai-rules/UI_Interface_Rules_EJS` already requires (CSP, CSRF, ModalModule without inline scripts), fix runtime defects, and make the deploy cheap and predictable.
**Effort:** M to L. The inline-script extraction is the long pole.
**Depends on:** phase 0 (dependency placement), phase 1 (CI to run the security tests from phase 2.2).
**Repos:** kui-ejs only, with two cross-references to phase 4.

All paths in this file are relative to `$KUIEJS_ROOT`.

## 5.1 Content Security Policy

`src/app.ts` runs Helmet with `contentSecurityPolicy: false` and a comment blaming CDN assets. CDNs are an allowlist entry, not a reason to disable CSP. The real blocker is the 86 partials with inline `<script>` and 96 inline `onclick=` handlers (5.2).

- [ ] Nonce middleware: `res.locals.cspNonce = crypto.randomBytes(16).toString('base64')` per request; layouts add `nonce="<%= cspNonce %>"` to every `<script>` and `<style>` they emit, including the anti-FOUC theme script in `views/partials/_head.ejs` and the `<style id="showcase-color-overrides">` block.
- [ ] Helmet directives: `default-src 'self'`; `script-src 'self' 'nonce-…' https://cdnjs.cloudflare.com` (drop the CDN entry once 4.3 self-hosts Font Awesome); `style-src 'self' 'nonce-…' https://fonts.googleapis.com` (drop once fonts are self-hosted); `font-src 'self' https://fonts.gstatic.com`; `img-src 'self' data: https:`; `connect-src 'self'`; `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`.
- [ ] Roll out with `Content-Security-Policy-Report-Only` first and a `/csp-report` endpoint that logs violations; switch to enforcing when a full smoke-test run (phase 2.2) reports zero violations.
- [ ] Leaflet and Chart.js are loaded from CDNs on the map and chart pages; either self-host them under `public/assets/vendor/` (preferred) or add their hosts to `script-src`.
- [ ] Phase 2.2 security test asserts the header on every route.

## 5.2 Inline script and handler extraction

This is what makes CSP possible without `'unsafe-inline'`, and it also removes the largest source of duplicated behaviour between partials.

- [ ] Inventory: `grep -rl '<script' modules` (86) and `grep -rho 'onclick=' modules views` (96). Put the counts in the phase 1 debt ratchet so they can only fall.
- [ ] Runtime: one delegated bootstrap `public/assets/js/kui.js` that scans `[data-kui]` and dispatches to per-module files `public/assets/js/modules/<name>.js` (`modal`, `drawer`, `dropdown`, `tabs`, `toast`, `command-palette`, `data-table`, `kanban`, `calendar`, …). Behaviour is declared with attributes: `data-kui="modal" data-kui-target="#dlg"`, never with inline JS.
- [ ] Partials declare what they need: `scripts: ['modal']` in locals (ROADMAP #17 "conditional script loading"). The layout collects the union across includes and emits one nonce'd `<script type="module">` per needed module. Implement the collector as `res.locals.kuiScripts = new Set()` that partials push into.
- [ ] Order of migration: `modules/ui` (Modal, Drawer, DropdownMenu, Toast, Tooltip, Popover, TabGroup first), then `modules/app`, then domains, then `views/theme/**`.
- [ ] Keep behaviour parity with the React components: the same keyboard map (Escape closes, arrow keys in menus, focus return to trigger). Reuse the focus-trap logic already in `public/assets/js/main.js` `ModalModule`.
- [ ] When the counts reach zero, remove `'unsafe-inline'` from the CSP and make the ratchet a hard zero.

## 5.3 CSRF

Zero CSRF references in the repo, while the internal rules (`UI_Interface_Rules_EJS/forms-and-csrf.md`) require a hidden token on every POST form and `validateBody` already protects real POST routes.

- [ ] Use `csrf-csrf` (double-submit cookie, maintained) rather than the deprecated `csurf`.
- [ ] `views/partials/_csrf.ejs` rendering `<input type="hidden" name="_csrf" value="<%= csrfToken %>">`; include it in every `<form method="post">` in `modules/**` and `views/**` (grep count becomes a phase 2.2 test).
- [ ] Apply the middleware to all non-GET routes; exempt `/csp-report` and `/api/*` GETs.
- [ ] Error page for a failed token check that re-renders the form with a flash message rather than a bare 403.

## 5.4 Sessions, flash, rate limiting

- [ ] Determine how `views/partials/_flash.ejs` receives messages today (there is no session middleware in `src/app.ts`). If it expects `req.session.flash`, add `express-session` with `cookie: { httpOnly, sameSite: 'lax', secure: NODE_ENV === 'production' }` and a signed cookie secret from env. If it is query-string based, document that and keep it stateless.
- [ ] `express-rate-limit` on every POST route and on `/api/*` (the registry endpoint returns multi-megabyte JSON; a limiter protects the Vercel function budget).
- [ ] Theme cookie: add `Secure` in production (`main.js` writes `SameSite=Lax` only).

## 5.5 Error handling

- [ ] `src/middleware/error.ts` renders the `404` view for 500 errors. Add `views/500.ejs` and render it with `title: '500 — Server Error'`; never surface `error.message` in production.
- [ ] Per-theme error pages (ROADMAP #38): `views/theme/<v>/error.ejs` using that theme's chrome; the handler picks by `req.path` prefix (`/theme/modem/*` → modem error page) and falls back to the global one.
- [ ] Express 5 (5.6) forwards rejected promises to the handler automatically; until then wrap async routes with a small `asyncHandler` or install `express-async-errors`.
- [ ] Log with a structured logger (`pino`) instead of `console.error`; include the request id.

## 5.6 Express 5 and Node 22

- [ ] Upgrade `express` to 5; `@types/express@5` is already installed (phase 0 temporarily pinned it back). Checklist: route syntax under path-to-regexp v8 (`*` becomes `/*splat`, optional params use `{}`), `req.query` is a getter, `res.redirect('back')` removed, `express-ejs-layouts` compatibility verified by the smoke tests.
- [ ] `engines.node: ">=22"`, `.nvmrc`, CI matrix `[20, 22]` for one release then `[22]`.
- [ ] Replace `nodemon` + `tsx` with `tsx watch` (one dependency less) if the CSS watcher is kept in `concurrently`.

## 5.7 Compression, caching and asset pipeline

- [ ] `compression()` before `express.static`.
- [ ] `express.static(..., { maxAge: '1y', immutable: true })` for hashed assets; short `maxAge` for unhashed. `etag` stays on.
- [ ] `assetVersion` currently hashes only `app.css`; `main.js` and `showcase.js` (606 unbundled lines) are served without any versioning and stale in browser caches after every deploy.
- [ ] Add an `esbuild` step: `public/assets/js/**/*.js` → `dist/public/assets/js/[name].[hash].js` plus `manifest.json`; `app.locals.assets` maps logical names to hashed paths; layouts use `<%= assets['kui.js'] %>`. Minify JS and CSS (`tailwindcss --minify` or `cssnano`) in `build`.
- [ ] `app.set('view cache', true)` explicitly in production (the Express default is on, but make it visible) and enable `ejs` `rmWhitespace` to cut HTML size.

## 5.8 Deploy: pre-render instead of one serverless function

`vercel.json` routes every request to a single function that bundles `modules/**/*`; the commit history shows four "fix(deploy)" attempts around `includeFiles`. The site is fully static data, so it does not need a server at request time.

- [ ] `scripts/prerender.mjs`: boot `app` in-process, request every route from the registry (`themes[].route`, their sub-pages from the theme routers, every showcase slug, `/`, `/llms-full.txt`, `/api/registry`, `/api/registry?index=1`), write each body to `out/<path>/index.html` (or the right extension), copy `public/` and the hashed `dist/public/assets/`.
- [ ] Vercel: `outputDirectory: out`, no functions. Keep `npm start` for local dynamic use and for anything that must stay dynamic later (a contact form would need one function; keep `api/index.ts` for that only).
- [ ] `robots.txt` and `sitemap.xml` are emitted by the same script (phase 7 covers the route-level implementation).
- [ ] Cold-start and `includeFiles` problems disappear; the smoke test from phase 2.2 becomes the pre-render's own error report.

## 5.9 Small runtime fixes

- [ ] `app.locals.catStyle` holds inline `style` strings in `src/app.ts`; replace with CSS classes in `input.css` (the token rule applies to TS too) and remove the inline styles from the sidebar partial. This also removes `style=` attributes that the CSP `style-src` would otherwise need to allow.
- [ ] `views/layouts/*.ejs` hardcode `lang="en"`; read `res.locals.lang` (phase 7 i18n) with `en` as default.
- [ ] `/health` should include the git SHA and build time from env so deploys are verifiable.

## Definition of done

- Every route returns a `Content-Security-Policy` header without `'unsafe-inline'`; the CSP report endpoint has been quiet for a full nightly run.
- `grep -rl '<script' modules | wc -l` and `grep -rho 'onclick=' modules views | wc -l` are both 0 and the ratchet enforces it.
- Every POST form contains the CSRF hidden input; the phase 2.2 security test passes.
- `express` 5, Node 22, `compression` on, hashed JS assets, `views/500.ejs` present.
- Production deploy is a static `out/` directory; `vercel.json` has no `functions` block, or only one for a documented dynamic route.
