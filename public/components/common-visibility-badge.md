# VisibilityBadge

- **id:** `common-visibility-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/status/VisibilityBadge.tsx`
- **status:** stable
- **since:** 2025-03

Badge for PUBLIC / PRIVATE / UNLISTED visibility states with eye/lock icons. PUBLIC is green, PRIVATE is red, UNLISTED is neutral.

## Variants

### All states

```tsx
<VisibilityBadge visibility="PUBLIC" />
<VisibilityBadge visibility="PRIVATE" />
<VisibilityBadge visibility="UNLISTED" />
```

### Sizes

```tsx
<VisibilityBadge visibility="PUBLIC" size="sm" />
<VisibilityBadge visibility="PUBLIC" size="md" />
<VisibilityBadge visibility="PUBLIC" size="lg" />
```

## Full source

```tsx
'use client';
import { VisibilityBadge } from '@/modules/domains/common/status/VisibilityBadge';

<VisibilityBadge visibility="PUBLIC" />
<VisibilityBadge visibility="PRIVATE" size="sm" />
```
