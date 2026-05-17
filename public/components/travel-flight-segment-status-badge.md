# FlightSegmentStatusBadge

- **id:** `travel-flight-segment-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/travel/flight/FlightSegmentStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Real-time flight segment status badge (Scheduled, Delayed, Departed, etc.).

## Variants

### All statuses

```tsx
{(['SCHEDULED', 'DELAYED', 'CANCELLED', 'DEPARTED', 'ARRIVED'] as const).map((s) => (
  <FlightSegmentStatusBadge key={s} status={s} />
))}
```

### Small size

```tsx
{(['SCHEDULED', 'DELAYED', 'ARRIVED'] as const).map((s) => (
  <FlightSegmentStatusBadge key={s} status={s} size="sm" />
))}
```

## Full source

```tsx
import { FlightSegmentStatusBadge } from '@/modules/domains/travel/flight/FlightSegmentStatusBadge';
<FlightSegmentStatusBadge status="SCHEDULED" />
```
