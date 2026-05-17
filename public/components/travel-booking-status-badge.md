# BookingStatusBadge

- **id:** `travel-booking-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/travel/booking/BookingStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Displays travel booking lifecycle status with semantic colour coding.

## Variants

### All statuses

```tsx
{(['DRAFT', 'PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'REFUNDED', 'COMPLETED'] as const).map((s) => (
  <BookingStatusBadge key={s} status={s} />
))}
```

### Sizes

```tsx
<BookingStatusBadge status="PAID" size="sm" />
<BookingStatusBadge status="PAID" size="md" />
```

## Full source

```tsx
import { BookingStatusBadge } from '@/modules/domains/travel/booking/BookingStatusBadge';
<BookingStatusBadge status="PAID" />
```
