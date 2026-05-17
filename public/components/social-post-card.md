# PostCard

- **id:** `social-post-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/social/post/PostCard.tsx`
- **status:** stable
- **since:** 2026-05

Social media post card with author info, text content, optional media grid, and like / comment / share / bookmark actions.

## Variants

### Text post (liked)

```tsx
<PostCard post={{
  postId: 'post-01',
  content: 'Just shipped a new open-source design system…',
  privacy: 'PUBLIC',
  likeCount: 248, commentCount: 34, shareCount: 71,
  isLiked: true, isBookmarked: false,
  author: { name: 'Lena Fischer', username: 'lena_design', isVerified: true, ... },
}} />
```

### Image post (friends only)

```tsx
<PostCard post={{
  postId: 'post-02',
  content: 'Morning vibes from the home office ☕',
  privacy: 'FRIENDS',
  mediaUrls: ['https://picsum.photos/seed/office1/600/400', ...],
  likeCount: 92, commentCount: 8, shareCount: 3,
  isBookmarked: true,
  author: { name: 'Marco Rossi', username: 'marco_dev', ... },
}} />
```

## Full source

```tsx
import { PostCard } from '@/modules/domains/social/post/PostCard';
<PostCard post={post} />
```
