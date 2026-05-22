# app/theme/travel

Travel booking theme demo — flights, hotels, itinerary, bookings, and a flight booking flow. Wires `modules/domains/travel/`.

## Files

```
FlightBookingFlow.tsx
bookings/
flights/
hotels/
itinerary/
layout.tsx
page.tsx
travel.data.ts
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `travel.data.ts` — passed in as props.
3. Dynamic flight/hotel/booking routes use `generateStaticParams`.
4. `FlightBookingFlow.tsx` is the only theme-local component — kept here because it wires layout state that has no domain equivalent.
5. Compose `@/modules/domains/travel/` + `@/modules/ui/` + `@/modules/app/`; no other in-theme duplicates.
6. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
7. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
