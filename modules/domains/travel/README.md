# modules/domains/travel

Travel booking domain — flights, hotels, itineraries, bookings, and seat/room selection components.

## Subdirectories

```
booking/
flight/
hotel/
itinerary/
index.ts
types.ts
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `'use client';` at top of every component file.
2. `cn()` from `@/libs/utils/cn`.
3. Named exports only.
4. Shared Tailwind tokens from `app/globals.css`.
5. Icons via `<FontAwesomeIcon>`.
6. Money/Address/Location types reused from `@/modules/domains/common`.

See [/AGENTS.md](../../../AGENTS.md).
