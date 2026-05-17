# CollectionCard

- **id:** `nft-collection-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/collection/CollectionCard.tsx`
- **status:** stable
- **since:** 2026-05

Collection tile — banner + avatar, floor, 24h volume, chain badge.

## Variants

### Verified collection

```tsx
<CollectionCard collection={collection} href="/theme/nft/collections/glyph-genesis" />
```

### Falling floor

```tsx
<CollectionCard collection={{ ...c, volumeChange24hPct: -8.4 }} />
```

## Full source

```tsx
'use client';
import type { NftCollection } from '../types';

export function CollectionCard({ collection, href }) {
  // banner, avatar, floor, 24h vol, verified
}
```
