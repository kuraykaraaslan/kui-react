# EventOrderStatusBadge

- **id:** `event-order-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/EventOrderStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Sipariş durumu rozeti; PAID / REFUNDED / CANCELLED renk şeması, iki boyut seçeneği.

## Variants

### All statuses — sm

```tsx
<EventOrderStatusBadge status="PAID" />
<EventOrderStatusBadge status="REFUNDED" />
<EventOrderStatusBadge status="CANCELLED" />
```

### Size md (detail view)

```tsx
<EventOrderStatusBadge status="PAID"      size="md" />
<EventOrderStatusBadge status="REFUNDED"  size="md" />
<EventOrderStatusBadge status="CANCELLED" size="md" />
```

## Full source

```tsx
import { EventOrderStatusBadge } from '@/modules/domains/event/EventOrderStatusBadge';

<EventOrderStatusBadge status="PAID" />
<EventOrderStatusBadge status="REFUNDED" size="md" />
<EventOrderStatusBadge status="CANCELLED" />
```
