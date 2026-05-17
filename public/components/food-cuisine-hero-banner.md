# CuisineHeroBanner

- **id:** `food-cuisine-hero-banner`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/cuisine/CuisineHeroBanner.tsx`
- **status:** stable
- **since:** 2026-05

Hero banner for a cuisine landing page: icon, headline, description, key stats over a tinted image.

## Variants

### Italian

```tsx
<CuisineHeroBanner cuisine="Italian" icon="pizza" description="..." restaurantCount={12} averageRating={4.7} averageDeliveryMin={32} />
```

### No image, gradient fallback

```tsx
<CuisineHeroBanner cuisine="Japanese" icon="bowl" description="…" />
```

## Full source

```tsx
import { CuisineHeroBanner } from '@/modules/domains/food/cuisine/CuisineHeroBanner';
<CuisineHeroBanner cuisine="Italian" description="…" icon="pizza" restaurantCount={5} averageRating={4.7} averageDeliveryMin={32} />
```
