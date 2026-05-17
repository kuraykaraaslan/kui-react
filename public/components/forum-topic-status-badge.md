# TopicStatusBadge

- **id:** `forum-topic-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/forum/topic/TopicStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Displays forum topic status with semantic colour coding — open, locked, pinned, archived, or deleted.

## Variants

### All statuses

```tsx
{(['OPEN', 'LOCKED', 'PINNED', 'ARCHIVED', 'DELETED'] as const).map((s) => (
  <TopicStatusBadge key={s} status={s} />
))}
```

### Sizes

```tsx
<TopicStatusBadge status="OPEN" size="sm" />
<TopicStatusBadge status="OPEN" size="md" />
```

## Full source

```tsx
import { TopicStatusBadge } from '@/modules/domains/forum/topic/TopicStatusBadge';
<TopicStatusBadge status="OPEN" />
```
