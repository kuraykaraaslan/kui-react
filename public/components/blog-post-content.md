# PostContent

- **id:** `blog-post-content`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/post/PostContent.tsx`
- **status:** stable
- **since:** 2025-03

Renders HTML blog content with token-based typography styles. Separate styles are defined for h1–h3, p, a, ul/ol, blockquote, code, pre, img, hr, and table.

## Variants

### Rich content

```tsx
<PostContent content={htmlContent} />
```

### Simple paragraphs

```tsx
<PostContent content="<p>First paragraph.</p><p>Second paragraph.</p>" />
```

## Full source

```tsx
'use client';
import { PostContent } from '@/modules/domains/blog/post/PostContent';

<PostContent content={post.content} />
```
