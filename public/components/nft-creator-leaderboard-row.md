# CreatorLeaderboardRow

- **id:** `nft-creator-leaderboard-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/creator/CreatorLeaderboardRow.tsx`
- **status:** stable
- **since:** 2026-05

Ranked row — rank chip, avatar, handle, volume, 24h change.

## Variants

### Top 3 leaderboard

```tsx
<CreatorLeaderboardRow rank={1} creator={creator} changePct={12.4} />
```

## Full source

```tsx
'use client';
import type { NftCreator } from '../types';

export function CreatorLeaderboardRow({ rank, creator, changePct }) {
  // rank chip + avatar + handle + volume + delta
}
```
