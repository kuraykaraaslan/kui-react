# DeliveryStatusBadge

- **id:** `food-delivery-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/order/DeliveryStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Shows courier delivery progress from assignment through completion.

## Variants

### All statuses

```tsx
{(['PENDING', 'ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'FAILED'] as const).map((s) => (
  <DeliveryStatusBadge key={s} status={s} />
))}
```

### Sizes

```tsx
<DeliveryStatusBadge status="ON_THE_WAY" size="sm" />
<DeliveryStatusBadge status="ON_THE_WAY" size="md" />
```

## Full source

```tsx
import { DeliveryStatusBadge } from '@/modules/domains/food/order/DeliveryStatusBadge';
<DeliveryStatusBadge status="ON_THE_WAY" />
```
