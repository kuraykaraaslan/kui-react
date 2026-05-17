# ReactionTypeBadge

- **id:** `forum-reaction-type-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/forum/reaction/ReactionTypeBadge.tsx`
- **status:** stable
- **since:** 2026-05

Pill badge with icon and optional count for each forum reaction type: like, dislike, thanks, laugh, and confused.

## Variants

### All reaction types with counts

```tsx
<ReactionTypeBadge type="LIKE"     count={88} />
<ReactionTypeBadge type="THANKS"   count={34} />
<ReactionTypeBadge type="LAUGH"    count={12} />
<ReactionTypeBadge type="CONFUSED" count={5} />
<ReactionTypeBadge type="DISLIKE"  count={2} />
```

### Sizes

```tsx
<ReactionTypeBadge type="LIKE" count={42} size="sm" />
<ReactionTypeBadge type="LIKE" count={42} size="md" />
```

## Full source

```tsx
import { ReactionTypeBadge } from '@/modules/domains/forum/reaction/ReactionTypeBadge';
<ReactionTypeBadge type="LIKE" count={42} />
```
