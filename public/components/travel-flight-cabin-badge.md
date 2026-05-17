# FlightCabinBadge

- **id:** `travel-flight-cabin-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/travel/flight/FlightCabinBadge.tsx`
- **status:** stable
- **since:** 2026-05

Colour-coded badge for flight cabin class (Economy through First).

## Variants

### All cabins

```tsx
{(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'] as const).map((c) => (
  <FlightCabinBadge key={c} cabin={c} />
))}
```

### Small size

```tsx
{(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'] as const).map((c) => (
  <FlightCabinBadge key={c} cabin={c} size="sm" />
))}
```

## Full source

```tsx
import { FlightCabinBadge } from '@/modules/domains/travel/flight/FlightCabinBadge';
<FlightCabinBadge cabin="BUSINESS" />
```
