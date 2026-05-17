# VideoPerformanceRow

- **id:** `media-video-performance-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/media/video/VideoPerformanceRow.tsx`
- **status:** stable
- **since:** 2026-05

Dashboard row for a single video: thumbnail, title + status, views, watch time, CTR delta.

## Variants

### Trending up

```tsx
<VideoPerformanceRow title="..." views={128400} watchTimeHours={12420} ctrPct={8.4} deltaPct={12.3} />
```

### Trending down

```tsx
<VideoPerformanceRow title="..." views={84200} ctrPct={6.1} deltaPct={-3.4} />
```

## Full source

```tsx
import { VideoPerformanceRow } from '@/modules/domains/media/video/VideoPerformanceRow';
<VideoPerformanceRow title="..." status="PUBLISHED" views={128400} watchTimeHours={12420} ctrPct={8.4} deltaPct={12.3} />
```
