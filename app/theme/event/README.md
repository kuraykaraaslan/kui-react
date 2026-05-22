# app/theme/event

Event ticketing theme demo — events, artists, venues, organizers, tickets, orders, search, and shared-ticket pages. Wires `modules/domains/event/`.

## Files

```
artists/
event.data.ts
events/
layout.tsx
orders/
organizers/
page.tsx
search/
shared-ticket/
tickets/
venues/
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `event.data.ts` — passed in as props.
3. Dynamic event/venue/artist routes use `generateStaticParams`.
4. Compose `@/modules/domains/event/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
5. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
6. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
