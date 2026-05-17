# OrderTrackingTimeline

- **id:** `food-order-tracking-timeline`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/order/OrderTrackingTimeline.tsx`
- **status:** stable
- **since:** 2026-05

Vertical timeline of order milestones (placed → preparing → on the way → delivered) with timestamps.

## Variants

### In progress

```tsx
<OrderTrackingTimeline steps={[{ key: 'PLACED', ... }, { key: 'ON_THE_WAY', isCurrent: true }, { key: 'DELIVERED' }]} />
```

### Cancelled

```tsx
<OrderTrackingTimeline steps={[{ key: 'PLACED', ... }, { key: 'CANCELLED', occurredAt: date }]} />
```

## Full source

```tsx
import { OrderTrackingTimeline } from '@/modules/domains/food/order/OrderTrackingTimeline';
<OrderTrackingTimeline steps={[{ key: 'PLACED', label: 'Order placed', occurredAt: date }]} />
```
