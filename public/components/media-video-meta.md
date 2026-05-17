# VideoMeta

- **id:** `media-video-meta`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/media/video/VideoMeta.tsx`
- **status:** stable
- **since:** 2026-05

Inline metadata strip: view count, like count, duration, and relative publish date.

## Variants

### Full meta

```tsx
<VideoMeta video={{ viewCount: 128400, likeCount: 5320, publishedAt: date, duration: 3842 }} />
```

### Views and date only

```tsx
<VideoMeta video={{ viewCount: 2340000, publishedAt: date }} />
```

## Full source

```tsx
import { VideoMeta } from '@/modules/domains/media/video/VideoMeta';
<VideoMeta video={video} />
```
