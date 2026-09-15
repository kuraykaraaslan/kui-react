# 0002: The registry is the canonical component catalog

## Status

Accepted (already implemented; this record documents an existing decision).

## Context

Three things need to agree on "what components exist": the sidebar navigation, AI agents reading the repo, and humans reading `AGENTS.md`. Hand-written lists in multiple places (a markdown table, a sidebar config, a JSON file) inevitably drift — the 2026-09-15 audit found `AGENTS.md`'s component tables missing 17 shipped components and 2 domain verticals.

## Decision

`modules/showcase/data/showcase.menu.ts` (the sidebar navigation list) plus the per-section showcase data (`modules/showcase/data/sections/*.showcase.tsx`) are the single source of truth for what components exist. `modules/registry/registry.ts` derives `GET /api/registry`, `public/registry/components.json`, `public/components/<id>.md`, and `public/llms.txt` / `llms-full.txt` from that source — never the other way around.

Any prose documentation that lists components (README tables, `AGENTS.md` tables) is a convenience snapshot, not a source of truth, and can go stale. Prefer linking to `/api/registry?index=1` over maintaining a parallel list; where a table stays for readability, phase 4 of `docs/dev/` generates it from the registry instead of hand-editing it.

The registry snapshot (`public/registry/**`, `public/components/**`) is committed to git, not generated only at deploy time, so it works offline and so a stale snapshot shows up as a diff in code review. CI enforces freshness (`docs/dev/phase-1-ci-and-gates.md`, section 1.2).

## Consequences

- Adding a component without a `showcase.menu.ts` entry means it does not exist for any AI agent or the CLI (phase 8) that reads the registry — this is why AGENTS.md's "Adding a component" section makes the menu entry a required step, not optional.
- Hand-written component tables in `AGENTS.md` are deprecated in spirit; phase 4 replaces them with generated content or removes them in favor of the registry pointer.
- The snapshot builder currently requires a browser (Puppeteer + a Next dev server) because showcase data lives behind `'use client'`. Phase 6.2 removes that requirement by splitting metadata from preview JSX, which is necessary for the snapshot to run in CI and on Vercel without special-casing.
