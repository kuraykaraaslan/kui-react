# RestaurantStatusBadge

- **id:** `food-restaurant-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/restaurant/RestaurantStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Displays restaurant operational status with semantic colour coding.

## Variants

### All statuses

```tsx
{(['ACTIVE', 'INACTIVE', 'CLOSED'] as const).map((s) => (
  <RestaurantStatusBadge key={s} status={s} />
))}
```

### Sizes

```tsx
<RestaurantStatusBadge status="ACTIVE" size="sm" />
<RestaurantStatusBadge status="ACTIVE" size="md" />
```

## Full source

```tsx
import { RestaurantStatusBadge } from '@/modules/domains/food/restaurant/RestaurantStatusBadge';
<RestaurantStatusBadge status="ACTIVE" />
```
