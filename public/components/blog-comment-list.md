# CommentList

- **id:** `blog-comment-list`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/comment/CommentList.tsx`
- **status:** stable
- **since:** 2025-03

Filters to PUBLISHED comments, groups them 2 levels deep by parentId, and appends a new-comment form. Shows an encouraging empty state when there are no comments.

## Variants

### With comments

```tsx
<CommentList comments={comments} postId={post.postId} onSubmitComment={handleSubmit} />
```

### Empty state

```tsx
<CommentList comments={[]} postId={post.postId} onSubmitComment={handleSubmit} />
```

## Full source

```tsx
'use client';
import { CommentList } from '@/modules/domains/blog/comment/CommentList';

<CommentList
  comments={comments}
  postId={post.postId}
  onSubmitComment={handleSubmit}
/>
```
