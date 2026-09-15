# 0003: React ↔ EJS parity contract

## Status

Accepted, with known exceptions (see below). This record makes the existing informal rule explicit and machine-checkable.

## Context

kui-react and kui-ejs are two implementations of the same design system on different stacks. Several module READMEs assert "pixel-perfect parity" between a React component and its EJS partial, but:

- The parity tables point at stale absolute paths (fixed in `docs/dev/phase-0-hygiene.md`).
- There is no automated check that parity actually holds — icon set versions differ (Font Awesome 7 npm vs 6.7.2 CDN), font delivery differs (self-hosted vs Google Fonts CDN), and several components exist in only one repo with no record of whether that is deliberate.

## Decision

"Parity" means, for a given component id:

1. **Same rendered DOM shape and class names** for the same props/locals, modulo the templating syntax.
2. **Same prop/local names and defaults**, so a person or an AI agent porting a usage between repos does a mechanical rename, not a redesign.
3. **Same design token names and values** — enforced by both repos importing the same token source (`docs/dev/phase-4-shared-tooling-and-parity.md`, section 4.2) rather than maintaining four hand-written copies.
4. **Same third-party asset versions** (icon set, fonts) — enforced by version-alignment in phase 4.3, because a different Font Awesome major can change glyphs.

Parity is **not** required to mean identical internal code; EJS and React solve state and composition differently by construction.

Exceptions are explicit, not implicit. `parity.exceptions.json` (introduced in phase 4.4) records every component or vertical that is deliberately framework-only, with a reason:

- React-only by design: `FormBuilder`, `Gantt`, `GoogleAnalytics`, `ConditionalShell`, `NotFoundPage`, and 13 of 18 domain verticals (ai, blog, commerce, event, fintech, food, forum, iot, jobs, landing, media, nft, real-estate, reviews, social, travel — only `common` and `api-doc` are shared).
- EJS-only by design: `CodeEditor`, `DiffViewer`, and the `invoice`, `modem`, `ups` domain verticals (device/admin panel demos with no React counterpart).
- Reverted deliberately: kui-ejs shipped and then removed `Gantt` and `FormBuilder` ("moved out of scope" commits) — recorded here so it is not re-implemented by accident.

A generated parity matrix (phase 4.4) computes `both` / `react-only` / `ejs-only` / `skipped` from the two registries and the exceptions file; an unexplained `react-only` or `ejs-only` row is a CI failure, not a silent gap.

## Consequences

- Adding a component to one repo without either adding it to the other or recording an exception now fails CI once phase 4.4 lands.
- The hand-written parity tables in `modules/*/README.md` (both repos) are superseded by the generated matrix and should be deleted once it exists, per phase 4.4.
- Whether kui-ejs's domain scope should ever grow toward all 18 React verticals, or stay deliberately narrower, is an open product decision — tracked as ADR 0008 (`docs/dev/phase-8-product.md`).
