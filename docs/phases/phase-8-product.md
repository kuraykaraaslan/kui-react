# Phase 8: Product

**Goal:** turn the registry from documentation into distribution. The catalog already knows every component, its source, its dependencies and its tokens; the missing pieces are a CLI that installs from it, a props schema so agents can call components correctly, an MCP package people can run without cloning, and written scope decisions.
**Effort:** L.
**Depends on:** phase 4 (tooling package, unified MCP), phase 6 (locals contract, browser-free snapshot), phase 7 (props editor controls).
**Repos:** both, plus `kui-tooling`.

## 8.1 `kui` CLI

The shadcn model, but driven by the registry that already exists. `composes[]` gives dependency resolution for free.

- [ ] `npx @kuraykaraaslan/kui add button card --framework react --dir src/components`: fetches `components.json` (from the showcase URL, or `--registry <path>` for offline), resolves `composes[]` recursively, copies each `filePath` plus `libs/utils/cn.ts`, rewrites the `@/` alias to the target project's `tsconfig` paths, and prints the peer packages to install (Font Awesome, react-hook-form, …) from the registry `dependencies` field.
- [ ] `--framework ejs`: copies the `.ejs` partials, their `.locals.ts`, and the `public/assets/js/modules/<name>.js` files they declare in `scripts` (phase 5.2).
- [ ] `kui list [--layer ui] [--vertical commerce] [--status stable]`, `kui info <id>` (description, when to use, composes, usedBy, tokens).
- [ ] `kui diff <id>`: compares the local copy with the registry version using the per-component `version` from phase 3.7; `kui update <id>` applies it with a three-way merge hint.
- [ ] `kui tokens init`: writes `tokens.css` from `@kuraykaraaslan/kui-tokens` into the target project.
- [ ] Lives in `kui-tooling` as another subcommand, published separately as `@kuraykaraaslan/kui` for a short `npx` name.
- [ ] Docs page in both showcases: "Install with the CLI" next to the copy-paste and npm paths.

## 8.2 Registry props schema

Agents and the CLI currently see only source code. A typed props description lets an agent call a component without reading its implementation, and lets the props editor generate its controls.

- [ ] `[react]` Run `react-docgen-typescript` at snapshot time (browser-free after phase 6.2) over every `filePath`; emit `props[]` (`name`, `type`, `required`, `default`, `description` from JSDoc).
- [ ] `[ejs]` Convert each `.locals.ts` Zod schema with `zod-to-json-schema` into the same `props[]` shape.
- [ ] Extend `registry-v1.json` additively (`props`, `version`) and bump `REGISTRY_VERSION` to `1.1.0`; keep v1 readers working.
- [ ] MCP `get_component` returns `props`; `search_components` accepts `hasProp=<name>`.
- [ ] `public/components/<id>.md` gains a props table, which makes the per-component markdown self-sufficient for RAG.
- [ ] Add JSDoc to every exported prop type in `modules/ui` as the docgen source; the phase 1 ratchet tracks props without descriptions.

## 8.3 MCP as a product

- [ ] Publish `@kuraykaraaslan/kui-mcp` (phase 4.6) and add an "Use KUI with your AI editor" page to both showcases with copy-paste configs for Claude Desktop, Claude Code, Cursor, Cline, Windsurf, Zed.
- [ ] Hosted HTTP transport on the showcase domain (`/mcp`) reading the static snapshot, so remote agents can use it without npm at all. Rate-limit it (phase 5.4 for ejs; a Next route handler for react).
- [ ] MCP prompts shipped with the server: "build a `<vertical>` page from KUI components", "port `<id>` from React to EJS", "review this file against KUI conventions".
- [ ] `llms.txt` and `llms-full.txt`: add the CLI and MCP install lines at the top; keep `llms-full.txt` under a documented size by linking to per-component markdown instead of inlining every source.
- [ ] Track adoption with the ROADMAP #40 idea: count `kui add` and MCP `get_component` calls per component id (anonymous, opt-out via env). This is the only data that says which of the 316 components matter.

## 8.4 Scope decisions to record as ADRs

These decisions are implicit in commit history and cause repeated rework. Write each as a one-page ADR in `docs/adr/`.

- [ ] `0008-ejs-domain-scope.md`: does kui-ejs aim at parity with all 18 React verticals, or is it deliberately the "admin, device and documentation" library (`common`, `api-doc`, `invoice`, `modem`, `ups`)? The generated parity matrix (phase 4.4) makes the current 13-vertical gap visible; the ADR says whether it is a backlog or a boundary.
- [ ] `0009-standalone-package-policy.md`: what qualifies for extraction (the `KUI_Package_Rules` criteria), when it happens (after N releases without API change), and what the showcase does in the meantime (consume the package, like `kui-viewer`). Resolves the Calendar/Gantt situation from phase 6.6 for future modules (`RichTextEditor`, `KanbanBoard`, `DataTable` are the next candidates).
- [ ] `0010-versioning-across-the-family.md`: lockstep versions for `kui-react`, `kui-tokens`, `kui-tooling` or independent semver with a compatibility table in each README.
- [ ] `0011-icon-and-font-delivery.md`: npm packages and self-hosting only, no CDNs, in every KUI repo (phase 4.3 makes it true; the ADR keeps it true).
- [ ] `0012-showcase-is-the-documentation.md`: no separate docs site; guides live as showcase pages; per-component markdown is generated, never hand-written.

## 8.5 Guides inside the showcase

The showcase is already the documentation site; it lacks the pages a first-time user needs.

- [ ] "Install": npm package, CLI, copy-paste, with the Tailwind `@source` line and token import (phase 3.6).
- [ ] "Theming": tokens, `.dark`, `data-theme`, env colour overrides, `kui-tokens` build.
- [ ] "Forms": the react-hook-form + Zod pattern from phase 6.3 with a full example; the EJS `validateBody` + CSRF pattern.
- [ ] "Porting between React and EJS": the parity contract, the generated matrix, the MCP prompt.
- [ ] "Accessibility": what every component guarantees (focus ring, ARIA, keyboard map), how to run the axe job locally.
- [ ] "Contributing": scaffold command, test commands, snapshot rule, changeset flow.

## 8.6 Community surface

- [ ] Label the leftover phase 0 and phase 1 tasks `good first issue` and link them from CONTRIBUTING.
- [ ] `docs/versus/` gets a third comparison against shadcn/ui, since the CLI puts kui-react in that category; be explicit about what it does not do (no Radix, no headless layer).
- [ ] A release blog post or README changelog summary per minor version, generated from changesets.

## Definition of done

- `npx @kuraykaraaslan/kui add button` works in a fresh Next.js app and in a fresh Express + EJS app.
- The registry schema is at 1.1 with `props` for every component in both repos; the props editor in both showcases is generated from it.
- `npx @kuraykaraaslan/kui-mcp` starts without a checkout; the hosted `/mcp` endpoint answers `list_components`.
- ADRs 0008–0012 exist and the parity matrix has zero unexplained rows.
- Both showcases have the six guide pages.
