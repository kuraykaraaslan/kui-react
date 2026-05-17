# CourierCard

- **id:** `food-courier-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/order/CourierCard.tsx`
- **status:** stable
- **since:** 2026-05

Delivery courier summary: avatar with online dot, vehicle, rating, and call / message actions.

## Variants

### Scooter, online

```tsx
<CourierCard courier={{ name, vehicle: 'scooter', rating: 4.9, online: true }} onCall={...} />
```

### Bike, no actions

```tsx
<CourierCard courier={{ name, vehicle: 'bike', rating: 4.78, online: false }} />
```

## Full source

```tsx
import { CourierCard } from '@/modules/domains/food/order/CourierCard';
<CourierCard courier={{ name, vehicle, rating, online }} onCall={...} onMessage={...} />
```
