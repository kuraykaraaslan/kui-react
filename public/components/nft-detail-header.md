# NftDetailHeader

- **id:** `nft-detail-header`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/asset/NftDetailHeader.tsx`
- **status:** stable
- **since:** 2026-05

Asset page header — collection link, name, token id, owner, share / like actions.

## Variants

### Full header

```tsx
<NftDetailHeader asset={asset} collectionName="Glyph Genesis" collectionSlug="glyph-genesis" />
```

## Full source

```tsx
'use client';
import type { NftAsset } from '../types';

export function NftDetailHeader({ asset, collectionName, collectionSlug }) {
  // crumb, h1, owner, rarity, chain
}
```
