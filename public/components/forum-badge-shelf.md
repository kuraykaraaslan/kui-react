# BadgeShelf

- **id:** `forum-badge-shelf`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/forum/user/BadgeShelf.tsx`
- **status:** stable
- **since:** 2026-05

Grid of tiered forum badges (bronze / silver / gold) with optional earned counts.

## Variants

### Six earned badges

```tsx
<BadgeShelf badges={[{ badgeId, name, tier: 'gold', icon: 'verified' }]} />
```

### Empty state

```tsx
<BadgeShelf badges={[]} />
```

## Full source

```tsx
import { BadgeShelf } from '@/modules/domains/forum/user/BadgeShelf';
<BadgeShelf badges={[{ badgeId, name, tier, icon, count }]} />
```
