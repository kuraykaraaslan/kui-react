# CommentThread

- **id:** `comment-thread`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/CommentThread.tsx`
- **status:** stable
- **since:** 2026-05

Generic threaded comments with replies, like counts, delete-own actions, and a composer. Domain-agnostic — pass comments + handlers.

## Depends on

- `avatar`
- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: aria-label="Comments", aria-pressed (like), aria-expanded (reply)

## Design tokens consumed

- `--surface-overlay`
- `--surface-base`
- `--border`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`
- `--primary`

## Variants

### With replies

```tsx
<CommentThread comments={comments} currentUserId="me" onReply={addComment} onLike={toggle} onDelete={remove} />
```

### Empty state

```tsx
<CommentThread comments={[]} onReply={addComment} />
```

## Full source

```tsx
'use client';
import { CommentThread, type CommentThreadItem } from '@/modules/app/CommentThread';

<CommentThread
  comments={comments}
  currentUserId="me"
  onReply={(parentId, body) => addComment(parentId, body)}
  onLike={(id, liked) => toggleLike(id, liked)}
  onDelete={(id) => removeComment(id)}
/>
```
