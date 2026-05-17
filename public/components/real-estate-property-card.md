# PropertyCard

- **id:** `real-estate-property-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/real-estate/property/PropertyCard.tsx`
- **status:** stable
- **since:** 2026-05

Summarises a property listing with image, price, type badges, specs, and location.

## Variants

### For sale with image

```tsx
<PropertyCard property={property} href="/properties/slug" />
```

### Rental — no image (gradient placeholder)

```tsx
<PropertyCard property={{ ...property, imageUrl: null }} />
```

### Short-term villa

```tsx
<PropertyCard property={villa} href="/properties/slug" />
```

## Full source

```tsx
import { PropertyCard } from '@/modules/domains/real-estate/property/PropertyCard';
<PropertyCard property={property} href="/properties/slug" />
```
