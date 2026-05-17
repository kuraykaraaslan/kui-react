# PostStatusBadge

- **id:** `blog-post-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/post/PostStatusBadge.tsx`
- **status:** stable
- **since:** 2025-03

Color-coded dot-badge for blog post status. PUBLISHED (green), DRAFT (amber), SCHEDULED (blue), ARCHIVED (neutral). Extends common/PublishStatusBadge by adding the SCHEDULED value.

## Variants

### All statuses

```tsx
<PostStatusBadge status="PUBLISHED" />
<PostStatusBadge status="DRAFT" />
<PostStatusBadge status="SCHEDULED" />
<PostStatusBadge status="ARCHIVED" />
```

### Sizes

```tsx
<PostStatusBadge status="PUBLISHED" size="sm" />
<PostStatusBadge status="PUBLISHED" size="md" />
<PostStatusBadge status="PUBLISHED" size="lg" />
```

## Full source

```tsx
'use client';
import { PostStatusBadge } from '@/modules/domains/blog/post/PostStatusBadge';

<PostStatusBadge status="PUBLISHED" />
<PostStatusBadge status="DRAFT" size="sm" />
<PostStatusBadge status="SCHEDULED" size="lg" />
<PostStatusBadge status="ARCHIVED" />
```
