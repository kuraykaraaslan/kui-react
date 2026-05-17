# NftCard

- **id:** `nft-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/asset/NftCard.tsx`
- **status:** stable
- **since:** 2026-05

Image-forward NFT tile — thumbnail, name, price, like + view counters, status pill.

## Variants

### Listed

```tsx
<NftCard asset={asset} href="/theme/nft/assets/abc" />
```

### Live auction

```tsx
<NftCard asset={auctionAsset} />
```

## Full source

```tsx
'use client';
import type { NftAsset } from '../types';

export function NftCard({ asset, href, onLike }) {
  // image, rarity, chain icon, price, likes/views
}
```
