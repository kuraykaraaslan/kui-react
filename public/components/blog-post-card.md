# PostCard

- **id:** `blog-post-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/post/PostCard.tsx`
- **status:** stable
- **since:** 2025-03

Listing card consuming PostWithData. Composed of cover image, category badge, title, description, and a PostMeta row. href renders an <a>, onClick a <button>, neither a plain <div>.

## Variants

### Default

```tsx
<PostCard post={post} href={`/blog/${post.slug}`} />
```

### With status badge

```tsx
<PostCard post={post} showStatus />
<PostCard post={draftPost} showStatus />
```

## Full source

```tsx
'use client';
import { PostCard } from '@/modules/domains/blog/post/PostCard';

// As a link
<PostCard post={post} href={`/blog/${post.slug}`} />

// With status badge (admin panel)
<PostCard post={post} showStatus href={`/blog/${post.slug}`} />
```
