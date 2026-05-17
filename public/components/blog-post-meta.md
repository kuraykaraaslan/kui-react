# PostMeta

- **id:** `blog-post-meta`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/post/PostMeta.tsx`
- **status:** stable
- **since:** 2025-03

Inline row showing author avatar, name, publish date, estimated read time, and view count. Read time is calculated by stripping HTML tags and dividing word count by 200.

## Variants

### With avatar

```tsx
<PostMeta post={post} showAvatar />
```

### Without avatar

```tsx
<PostMeta post={post} showAvatar={false} />
```

## Full source

```tsx
'use client';
import { PostMeta } from '@/modules/domains/blog/post/PostMeta';

// With avatar
<PostMeta post={post} showAvatar />

// Text only
<PostMeta post={post} showAvatar={false} />
```
