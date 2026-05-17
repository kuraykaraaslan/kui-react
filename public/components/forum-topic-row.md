# TopicRow

- **id:** `forum-topic-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/forum/topic/TopicRow.tsx`
- **status:** stable
- **since:** 2026-05

Horizontal list row for a forum topic showing title, status badges, pin/lock indicators, author, and reply/view counts.

## Variants

### Open topic

```tsx
<TopicRow topic={topic} href="/forum/topics/slug" />
```

### Pinned and locked variants

```tsx
<TopicRow topic={{ ...topic, status: 'PINNED', isPinned: true }} href="#" />
<TopicRow topic={{ ...topic, status: 'LOCKED', isLocked: true }} href="#" />
```

## Full source

```tsx
import { TopicRow } from '@/modules/domains/forum/topic/TopicRow';
<TopicRow topic={topic} href="/forum/topics/slug" />
```
