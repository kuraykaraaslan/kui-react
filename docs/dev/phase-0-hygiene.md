# Phase 0: Hygiene

**Goal:** remove every cheap, zero-risk defect the audit found so later phases start from a clean baseline.
**Effort:** S (one working day for both repos).
**Depends on:** nothing.
**Repos:** both.

None of these tasks changes runtime behaviour for end users. All of them change what a contributor or an AI agent reads first, which is why they go first.

## 0.1 Stale references

- [ ] `[both]` Replace the header note in `AGENTS.md` line 2. `../00_Config_and_AI_Rules` no longer exists; the rules live in the `internal-ai-rules` repo and are addressed through `LOCAL_PATHS.json` keys. Write it as: "Load the rulesets referenced by `$KUIREACT_ROOT` / `$KUIEJS_ROOT` in `internal-ai-rules/LOCAL_PATHS.json` before any work begins."
- [ ] `[react]` Replace `/home/kuray/02_EJS_Components/...` with `$KUIEJS_ROOT/...` in `modules/app/README.md`, `modules/domains/README.md`, `modules/ui/README.md`, `app/theme/README.md`.
- [ ] `[react]` Fix the GitHub URL `kuraykaraaslan/next_js_components` in `libs/config/showcase.config.ts:23` and `.env.example:21`. The repo is `kuraykaraaslan/kui-react`.
- [ ] `[ejs]` Replace `../01_NextJS_Components/` in `README.md:3` and `/home/kuray/01_NextJS_Components`, `/home/kuray/02_EJS_Components`, `../../../00_Config_and_AI_Rules` in `modules/ui/README.md`, `modules/app/README.md`, `modules/domain/README.md`.
- [ ] `[both]` Add a one-line grep to the CI job in phase 1 so these strings can never come back:
  ```bash
  ! grep -rn '02_EJS_Components\|01_NextJS_Components\|00_Config_and_AI_Rules\|next_js_components' --include='*.md' --include='*.ts' --include='*.tsx' --include='.env.example' . --exclude-dir=node_modules --exclude-dir=.junk
  ```

## 0.2 package.json metadata

- [ ] `[react]` Add `license: "0BSD"` (matches `LICENSE`), `repository`, `homepage`, `bugs`, `keywords`, `engines: { node: ">=20" }`. Use `npm pkg set` so formatting stays consistent.
- [ ] `[react]` Move `@types/leaflet` from `dependencies` to `devDependencies`.
- [ ] `[ejs]` Add `engines: { node: ">=20" }` and a `.nvmrc`.
- [ ] `[ejs]` Move `puppeteer` and `@types/qrcode` to `devDependencies`. `puppeteer` in `dependencies` downloads Chromium on every production install, including the Vercel function build.
- [ ] `[ejs]` Pin `@types/express` to `^4` until the Express 5 migration in phase 5. Type definitions for a different major than the runtime hide real errors.
- [ ] `[ejs]` Remove `NEXT_PUBLIC_GOOGLE_TAG` from `.env.example`; use whatever key `src/config/showcase.config.ts` actually reads (add one if there is none).

## 0.3 Git and file hygiene

- [ ] `[ejs]` Fix `.gitignore`: the entry `public/css/app.css` points at a path that does not exist. The compiled output is `public/assets/css/app.css` and it is tracked in git together with `public/assets/css/main.css`. Steps: confirm `main.css` is unreferenced (`grep -rn 'main.css' views src`), delete it, `git rm --cached public/assets/css/app.css`, add the correct ignore line, and make sure the deploy build runs `npm run build:css` before start.
- [ ] `[react]` Remove the stray manual entry `"app/theme/common/layout.tsx"` from the `include` array in `tsconfig.json`. The `**/*.tsx` glob already covers it.
- [ ] `[react]` Move `.junk/` (83 MB of cloned reference repos) outside the project directory, for example to `~/reference-repos/`. It is git-ignored but still slows `find`, editor indexing and any agent that walks the tree. Update the two `docs/versus/*.md` files that reference `.junk/<name>`.
- [ ] `[react]` Add `'use client';` to the four files that violate the AGENTS.md rule: `modules/ui/FileInput.tsx`, `modules/app/EmptyErrorState.tsx`, `modules/app/FileUploadSection.tsx`, `modules/app/LoadingState.tsx`. Phase 1 adds a lint rule so this stays fixed.

## 0.4 Documentation drift

- [ ] `[react]` `AGENTS.md`: add `nft` and `reviews` to the domain verticals table, `nft` and `promozone` to the existing-themes table, and the 18 missing components to the atoms/molecules table (list in the audit file). Alternative that avoids recurring drift: delete the component tables and keep only the sentence "the registry is the canonical list", since AGENTS.md already says so. Phase 4 decides which; do the quick fix now either way.
- [ ] `[react]` `ROADMAP.md`: update the coverage column for rows #11, #13, #14, #16, #17 and #20; all six are marked missing but exist. Recompute the summary table. Pick one language for the coverage column (it currently mixes Turkish and English).
- [ ] `[react]` `README.md` module-layer block says 47 ui components, 25 app patterns, 16 verticals, 16 themes. The registry says 316 components and 18 themes. Replace hardcoded counts with a sentence that points at `/api/registry?index=1`, or generate the block (phase 4).
- [ ] `[react]` `CHANGELOG.md` stops at `[0.1.0]` while `package.json` is `1.0.1`. Add `[1.0.0]` and `[1.0.1]` sections from `git log` (the tsup library build commit `08ddf39` and the version bump `9f868a3`). Phase 3 introduces tooling so this does not recur.
- [ ] `[ejs]` `README.md` screenshot gallery shows four themes; add `ups`. Check `public/assets/img/screenshot-ups.png` exists or regenerate with `npm run screenshots`.
- [ ] `[ejs]` `AGENTS.md` project-structure block still describes `views/themes/`, `public/css/`, `public/js/`; the real paths are `views/theme/`, `public/assets/css/`, `public/assets/js/`. Align it with `README.md`, which is correct.
- [ ] `[both]` Record the parity exceptions in writing: kui-ejs intentionally dropped `Gantt` and `FormBuilder`; kui-react has no `invoice`, `modem`, `ups`. Today this exists only in commit messages. Add a short "Parity exceptions" section to both `AGENTS.md` files; phase 4 turns it into a machine-readable file.

## 0.5 Repository hygiene files

- [ ] `[both]` `SECURITY.md` with a disclosure contact and supported-versions table.
- [ ] `[both]` `.github/CODEOWNERS` (single owner today, but it makes review requests automatic once a second contributor appears).
- [ ] `[both]` `.github/ISSUE_TEMPLATE/bug_report.md`, `feature_request.md`, `component_request.md` (asks for layer, vertical, parity expectation).
- [ ] `[both]` `.github/PULL_REQUEST_TEMPLATE.md` with the checklist from `CONTRIBUTING.md` plus "ran `npm run registry:snapshot` and committed the output".
- [ ] `[both]` `CODE_OF_CONDUCT.md` (Contributor Covenant is fine).
- [ ] `[react]` `CONTRIBUTING.md` still says "Make sure your changes do not break existing pages" with no command. Once phase 2 lands, list the exact commands (`npm test`, `npm run test:e2e`, `npm run registry:snapshot`).

## 0.6 Architecture decision records

Create `docs/adr/` in kui-react and write the first four records. Keep them short (context, decision, consequences). These decisions are already made in code; writing them down stops them from being re-litigated.

- [ ] `0001-four-layer-module-architecture.md` (ui → app → domains → showcase, why registry is a separate layer)
- [ ] `0002-registry-is-the-canonical-catalog.md` (why `showcase.menu.ts` + showcase data drive everything, snapshot commit policy)
- [ ] `0003-react-ejs-parity-contract.md` (what "pixel-perfect parity" means, the exception list, who mirrors what)
- [ ] `0004-token-only-styling-and-font-awesome-only-icons.md`

## Definition of done

- The stale-string grep in 0.1 returns nothing in either repo.
- `npm pkg get license repository engines` prints non-empty values in kui-react; `npm pkg get engines` in kui-ejs.
- `git ls-files public/assets/css` in kui-ejs lists only `input.css`.
- The `'use client'` loop from the audit prints no files.
- `ROADMAP.md` summary counts match the table rows.
- `docs/adr/` has four files.
