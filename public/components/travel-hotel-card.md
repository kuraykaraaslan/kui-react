# HotelCard

- **id:** `travel-hotel-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/travel/hotel/HotelCard.tsx`
- **status:** stable
- **since:** 2026-05

Hotel summary card with image, star rating, guest score, location, and price per night.

## Variants

### With image

```tsx
<HotelCard hotel={hotel} href="/theme/travel/hotels/grand-pera-palace" />
```

### No image (gradient placeholder)

```tsx
<HotelCard hotel={{ ...hotel, imageUrl: null }} />
```

## Full source

```tsx
import { HotelCard } from '@/modules/domains/travel/hotel/HotelCard';
<HotelCard hotel={hotel} href="/theme/travel/hotels/grand-pera-palace" />
```
