# CommentForm

- **id:** `blog-comment-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/comment/CommentForm.tsx`
- **status:** stable
- **since:** 2025-03

Name, email, and content comment form with inline validation. Providing parentId switches it to reply mode; onCancel shows a Cancel button.

## Variants

### New comment

```tsx
<CommentForm postId={post.postId} onSubmit={handleSubmit} />
```

### Reply mode

```tsx
<CommentForm postId={post.postId} parentId={comment.commentId} onSubmit={handleSubmit} onCancel={handleCancel} />
```

## Full source

```tsx
'use client';
import { CommentForm } from '@/modules/domains/blog/comment/CommentForm';

// New comment
<CommentForm postId={post.postId} onSubmit={handleSubmit} />

// Reply mode
<CommentForm
  postId={post.postId}
  parentId={comment.commentId}
  onSubmit={handleSubmit}
  onCancel={() => setReplying(false)}
/>
```
