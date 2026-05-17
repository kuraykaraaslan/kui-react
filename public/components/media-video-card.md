# VideoCard

- **id:** `media-video-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/media/video/VideoCard.tsx`
- **status:** stable
- **since:** 2026-05

Thumbnail card for a video: 16:9 image, duration overlay, title, channel, and view count.

## Variants

### Published with thumbnail

```tsx
<VideoCard video={video} href="/videos/slug" />
```

### Draft, no thumbnail

```tsx
<VideoCard video={{ ...video, status: 'DRAFT', thumbnailUrl: undefined }} />
```

## Full source

```tsx
import { VideoCard } from '@/modules/domains/media/video/VideoCard';
<VideoCard video={video} href="/theme/media/videos/slug" />
```
