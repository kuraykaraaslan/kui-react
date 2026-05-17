# OrderStatusBadge

- **id:** `food-order-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/order/OrderStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Tracks a food order through its full lifecycle with semantic colours.

## Variants

### All statuses

```tsx
{(['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED', 'REFUNDED'] as const).map((s) => (
  <OrderStatusBadge key={s} status={s} />
))}
```

### Key states

```tsx
<OrderStatusBadge status="PREPARING" size="sm" />
<OrderStatusBadge status="DELIVERED" size="sm" />
<OrderStatusBadge status="CANCELLED" size="sm" />
```

## Full source

```tsx
import { OrderStatusBadge } from '@/modules/domains/food/order/OrderStatusBadge';
<OrderStatusBadge status="PREPARING" />
```
