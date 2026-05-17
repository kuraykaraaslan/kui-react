# ListingTypeBadge

- **id:** `real-estate-listing-type-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/real-estate/listing/ListingTypeBadge.tsx`
- **status:** stable
- **since:** 2026-05

Badge indicating listing intent: For Sale, For Rent, or Short-term.

## Variants

### All listing types

```tsx
{(['SALE', 'RENT', 'SHORT_TERM'] as const).map((t) => (
  <ListingTypeBadge key={t} type={t} />
))}
```

### Small size

```tsx
<ListingTypeBadge type="SALE" size="sm" />
<ListingTypeBadge type="RENT" size="sm" />
```

## Full source

```tsx
import { ListingTypeBadge } from '@/modules/domains/real-estate/listing/ListingTypeBadge';
<ListingTypeBadge type="SALE" />
```
