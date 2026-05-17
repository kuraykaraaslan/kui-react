# RarityBadge

- **id:** `nft-rarity-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/asset/RarityBadge.tsx`
- **status:** stable
- **since:** 2026-05

Tier-coloured badge — Common, Uncommon, Rare, Epic, Legendary, Mythic.

## Variants

### All tiers

```tsx
<RarityBadge tier="COMMON" />
<RarityBadge tier="MYTHIC" />
```

### With rank

```tsx
<RarityBadge tier="LEGENDARY" rank={12} />
<RarityBadge tier="MYTHIC" rank={1} size="sm" />
```

## Full source

```tsx
'use client';
import { Badge } from '@/modules/ui/Badge';
import type { RarityTier } from '../types';

export function RarityBadge({ tier, rank, size = 'md' }) {
  // tier-coloured pill, optional #rank suffix
}
```
