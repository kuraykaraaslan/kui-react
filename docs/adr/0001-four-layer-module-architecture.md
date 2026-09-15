# 0001: Four-layer module architecture

## Status

Accepted (already implemented; this record documents an existing decision).

## Context

Components in this codebase range from a single `<button>` to a full multi-page theme demo. Without an explicit layering rule, "where does this file go" becomes a judgment call per PR, and dependencies drift in both directions (a primitive importing business logic, a domain component duplicating a primitive).

## Decision

Split `modules/` into four layers, each building only on the ones above it:

1. `modules/ui/` — atoms and molecules. Stateless or locally-stateful, no business logic, no data fetching.
2. `modules/app/` — organisms and page shells. May own local state, orchestrates `ui/` components.
3. `modules/domains/<vertical>/` — industry-vertical components that compose `ui/` + `app/` for a specific business domain (commerce, fintech, blog, …).
4. `modules/registry/` — a machine-readable catalog derived from the layers above, for AI-agent discoverability.

`modules/showcase/` sits alongside these as documentation, not a fifth architectural layer. `app/theme/<vertical>/` (Next.js routes) / `views/theme/<vertical>/` (EJS views) are full-page demos wiring `domains/` components into a realistic product, one level above `domains/`.

`CONTRIBUTING.md` states the same order as the required build sequence: `ui → app → domains → showcase → themes`.

## Consequences

- A component's directory tells you its allowed dependencies without reading its imports.
- `modules/domains/<a>` importing from `modules/domains/<b>` (other than `common`) is a layering violation; phase 1 of `docs/dev/` adds a lint/madge check for this.
- The same layering is mirrored in kui-ejs (`modules/ui`, `modules/app`, `modules/domain`), which is what makes cross-repo parity checking (ADR 0003) meaningful — the same logical layer exists in both repos even though the file format differs.
