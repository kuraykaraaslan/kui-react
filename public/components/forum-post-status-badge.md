# PostStatusBadge

- **id:** `forum-post-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/forum/post/PostStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Indicates the moderation state of a forum post: published, pending review, hidden, deleted, or spam.

## Variants

### All statuses

```tsx
{(['PUBLISHED', 'PENDING_REVIEW', 'HIDDEN', 'DELETED', 'SPAM'] as const).map((s) => (
  <PostStatusBadge key={s} status={s} />
))}
```

### Sizes

```tsx
<PostStatusBadge status="PUBLISHED" size="sm" />
<PostStatusBadge status="PUBLISHED" size="md" />
```

## Full source

```tsx
import { PostStatusBadge } from '@/modules/domains/forum/post/PostStatusBadge';
<PostStatusBadge status="PUBLISHED" />
```
