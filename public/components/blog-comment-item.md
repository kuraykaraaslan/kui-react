# CommentItem

- **id:** `blog-comment-item`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/comment/CommentItem.tsx`
- **status:** stable
- **since:** 2025-03

Single comment with initials-fallback avatar, name, date, content, and a Reply button. At depth < 1, clicking Reply opens an inline CommentForm; nested replies are indented with a left border.

## Variants

### Single comment

```tsx
<CommentItem comment={comment} />
```

### With replies

```tsx
<CommentItem comment={comment} replies={replies} onSubmitReply={handleReply} />
```

## Full source

```tsx
'use client';
import { CommentItem } from '@/modules/domains/blog/comment/CommentItem';

// Without replies
<CommentItem comment={comment} />

// With replies
<CommentItem
  comment={comment}
  replies={replies}
  onSubmitReply={handleReply}
/>
```
