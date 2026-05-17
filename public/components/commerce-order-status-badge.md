# OrderStatusBadge

- **id:** `commerce-order-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/commerce/order/OrderStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Tracks an order through its full lifecycle from Pending to Delivered or Refunded.

## Variants

### All statuses

```tsx
{(['PENDING', 'CONFIRMED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'] as const).map((s) => (
  <OrderStatusBadge key={s} status={s} />
))}
```

### Small size

```tsx
{(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((s) => (
  <OrderStatusBadge key={s} status={s} size="sm" />
))}
```

## Full source

```tsx
import { OrderStatusBadge } from '@/modules/domains/commerce/order/OrderStatusBadge';
<OrderStatusBadge status="SHIPPED" />
```
