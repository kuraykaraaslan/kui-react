# ActivityFeedRow

- **id:** `nft-activity-feed-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/activity/ActivityFeedRow.tsx`
- **status:** stable
- **since:** 2026-05

Single activity event — kind icon, asset thumb, parties, price, chain, time.

## Variants

### Sale event

```tsx
<ActivityFeedRow event={event} />
```

### Mixed feed

```tsx
<ActivityFeedRow event={event} />
```

## Full source

```tsx
'use client';
import type { NftActivity } from '../types';

export function ActivityFeedRow({ event }) {
  // kind pill + asset image + parties + price + chain + time
}
```
