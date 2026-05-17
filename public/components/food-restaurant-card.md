# RestaurantCard

- **id:** `food-restaurant-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/restaurant/RestaurantCard.tsx`
- **status:** stable
- **since:** 2026-05

Hoverable restaurant summary card with gradient image placeholder, cuisine tags, star rating, and delivery estimate.

## Variants

### Active with link

```tsx
<RestaurantCard restaurant={restaurant} href="/restaurants/slug" />
```

### Closed restaurant

```tsx
<RestaurantCard restaurant={{ ...restaurant, status: 'CLOSED' }} />
```

## Full source

```tsx
import { RestaurantCard } from '@/modules/domains/food/restaurant/RestaurantCard';
<RestaurantCard restaurant={restaurant} href="/theme/food/restaurants/bella-napoli" />
```
