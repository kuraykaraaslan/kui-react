# PostStatusBadge

- **id:** `social-post-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/social/post/PostStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Displays the publication status of a social post — published, draft, archived, or deleted.

## Variants

### All statuses

```tsx
{(['PUBLISHED', 'DRAFT', 'ARCHIVED', 'DELETED'] as const).map((s) => (
  <PostStatusBadge key={s} status={s} />
))}
```

### Small size

```tsx
<PostStatusBadge status="PUBLISHED" size="sm" />
<PostStatusBadge status="DRAFT" size="sm" />
```

## Full source

```tsx
import { PostStatusBadge } from '@/modules/domains/social/post/PostStatusBadge';
<PostStatusBadge status="PUBLISHED" />
```
