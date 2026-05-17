# BidHistoryRow

- **id:** `nft-bid-history-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/auction/BidHistoryRow.tsx`
- **status:** stable
- **since:** 2026-05

Bid row — bidder avatar + handle, amount, time, winning indicator.

## Variants

### With winning highlight

```tsx
<BidHistoryRow bid={bid} winning />
```

## Full source

```tsx
'use client';
import type { NftBid } from '../types';

export function BidHistoryRow({ bid, winning }) {
  // avatar + handle + amount + tx link
}
```
