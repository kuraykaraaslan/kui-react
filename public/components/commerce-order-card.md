# OrderCard

- **id:** `commerce-order-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/commerce/order/OrderCard.tsx`
- **status:** stable
- **since:** 2026-05

Compact order row showing order number, status badge, item count, and total.

## Variants

### Delivered order with link

```tsx
<OrderCard order={order} href="/orders/id" />
```

### Pending order (no link)

```tsx
<OrderCard order={order} />
```

## Full source

```tsx
import { OrderCard } from '@/modules/domains/commerce/order/OrderCard';
<OrderCard order={order} href="/orders/id" />
```
