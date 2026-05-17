# CreatorProfileCard

- **id:** `nft-creator-profile-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/creator/CreatorProfileCard.tsx`
- **status:** stable
- **since:** 2026-05

Creator block — avatar, handle, verified, wallet, follower count, social links.

## Variants

### Not following

```tsx
<CreatorProfileCard creator={creator} onFollowToggle={fn} />
```

### Following

```tsx
<CreatorProfileCard creator={creator} following onFollowToggle={fn} />
```

## Full source

```tsx
'use client';
import type { NftCreator } from '../types';

export function CreatorProfileCard({ creator, following, onFollowToggle }) {
  // banner, avatar, bio, wallet, stats, socials
}
```
