# BlockchainBadge

- **id:** `nft-blockchain-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/wallet/BlockchainBadge.tsx`
- **status:** stable
- **since:** 2026-05

Chain pill — Ethereum, Polygon, Solana, Base, Arbitrum.

## Variants

### All chains

```tsx
<BlockchainBadge chain="ETHEREUM" />
<BlockchainBadge chain="POLYGON" />
```

### Icon-only

```tsx
<BlockchainBadge chain="ETHEREUM" iconOnly />
```

## Full source

```tsx
'use client';
import type { Blockchain } from '../types';

export function BlockchainBadge({ chain, size = 'md', iconOnly = false }) {
  // chain-coloured pill with FA icon
}
```
