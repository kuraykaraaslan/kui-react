# app/theme/real-estate

Real estate theme demo — homepage, properties, agents, saved searches, about, and contact pages. Wires `modules/domains/real-estate/`.

## Files

```
about/
agents/
contact/
layout.tsx
page.tsx
properties/
real-estate.data.ts
saved/
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `real-estate.data.ts` — passed in as props.
3. Dynamic property/agent routes use `generateStaticParams`.
4. Maps via `@/modules/ui/MapView`.
5. Compose `@/modules/domains/real-estate/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
6. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
7. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
