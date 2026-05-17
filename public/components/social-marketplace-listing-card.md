# MarketplaceListingCard

- **id:** `social-marketplace-listing-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/social/marketplace/MarketplaceListingCard.tsx`
- **status:** stable
- **since:** 2026-05

Compact listing card for the peer-to-peer marketplace: thumbnail, price, condition badge, location, and seller info.

## Variants

### Two listings side by side

```tsx
<div className="grid grid-cols-2 gap-3">
  <MarketplaceListingCard listing={listing1} />
  <MarketplaceListingCard listing={listing2} />
</div>
```

### Single card

```tsx
<MarketplaceListingCard listing={listing} href="/marketplace/listing-01" />
```

## Full source

```tsx
import { MarketplaceListingCard } from '@/modules/domains/social/marketplace/MarketplaceListingCard';
<MarketplaceListingCard listing={listing} />
```
