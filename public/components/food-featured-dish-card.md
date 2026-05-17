# FeaturedDishCard

- **id:** `food-featured-dish-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/menu/FeaturedDishCard.tsx`
- **status:** stable
- **since:** 2026-05

Featured/promoted dish tile: large image, restaurant attribution, rating, prep time, optional badges.

## Variants

### Chef pick

```tsx
<FeaturedDishCard name="Margherita Pizza" restaurantName="Bella Napoli" price={14.5} currency="USD" badge="Chef pick" />
```

### Hot, no badge

```tsx
<FeaturedDishCard name="Spicy Tonkotsu Ramen" restaurantName="Sakura Bento" price={15.5} currency="USD" hot />
```

## Full source

```tsx
import { FeaturedDishCard } from '@/modules/domains/food/menu/FeaturedDishCard';
<FeaturedDishCard name="..." restaurantName="..." price={14.5} currency="USD" rating={4.8} badge="Chef pick" />
```
