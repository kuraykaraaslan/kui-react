# PropertyTypeBadge

- **id:** `real-estate-property-type-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/real-estate/property/PropertyTypeBadge.tsx`
- **status:** stable
- **since:** 2026-05

Colour-coded badge for property type (Apartment, House, Villa, etc.).

## Variants

### All types

```tsx
{(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE'] as const).map((t) => (
  <PropertyTypeBadge key={t} type={t} />
))}
```

### Small size

```tsx
<PropertyTypeBadge type="APARTMENT" size="sm" />
```

## Full source

```tsx
import { PropertyTypeBadge } from '@/modules/domains/real-estate/property/PropertyTypeBadge';
<PropertyTypeBadge type="APARTMENT" />
```
