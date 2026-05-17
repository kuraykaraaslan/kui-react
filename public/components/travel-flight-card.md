# FlightCard

- **id:** `travel-flight-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/travel/flight/FlightCard.tsx`
- **status:** stable
- **since:** 2026-05

Flight summary card with route, airline, cabin class, status, and price.

## Variants

### Economy — scheduled

```tsx
<FlightCard flight={flight} href="/theme/travel/flights/tk-123" />
```

### Business — delayed

```tsx
<FlightCard flight={flight} />
```

## Full source

```tsx
import { FlightCard } from '@/modules/domains/travel/flight/FlightCard';
<FlightCard flight={flight} href="/theme/travel/flights/tk-123" />
```
