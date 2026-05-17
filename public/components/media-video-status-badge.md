# VideoStatusBadge

- **id:** `media-video-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/media/video/VideoStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Displays video lifecycle status with semantic colour coding.

## Variants

### All statuses

```tsx
{(['DRAFT', 'PROCESSING', 'PUBLISHED', 'PRIVATE', 'UNLISTED', 'BLOCKED', 'DELETED'] as const).map((s) => (
  <VideoStatusBadge key={s} status={s} />
))}
```

### Sizes

```tsx
<VideoStatusBadge status="PUBLISHED" size="sm" />
<VideoStatusBadge status="PUBLISHED" size="md" />
```

## Full source

```tsx
import { VideoStatusBadge } from '@/modules/domains/media/video/VideoStatusBadge';
<VideoStatusBadge status="PUBLISHED" />
```
