# OrderTotalsCard

- **id:** `common-order-totals-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/money/OrderTotalsCard.tsx`
- **status:** stable
- **since:** 2025-03

Order summary card showing subtotal, discount, tax, service fee, shipping, and an emphasized total. Zero-value lines are hidden automatically.

## Variants

### No extras

```tsx
<OrderTotalsCard currency="USD" totals={{ subtotal: 89.99, total: 89.99 }} />
```

### With discount, tax & shipping

```tsx
<OrderTotalsCard currency="USD" totals={{ subtotal: 149.99, discountTotal: 20, taxTotal: 11.99, shippingTotal: 9.99, total: 153.96 }} />
```

## Full source

```tsx
'use client';
import { OrderTotalsCard } from '@/modules/domains/common/money/OrderTotalsCard';

<OrderTotalsCard
  currency="USD"
  locale="en-US"
  totals={{ subtotal: 149.99, discountTotal: 20, taxTotal: 11.99, shippingTotal: 9.99, total: 153.96 }}
/>
```
