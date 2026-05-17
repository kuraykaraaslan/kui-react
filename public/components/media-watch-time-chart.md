# WatchTimeChart

- **id:** `media-watch-time-chart`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/media/chart/WatchTimeChart.tsx`
- **status:** stable
- **since:** 2026-05

Smooth area chart showing daily watch hours over a period. Used in Creator Studio.

## Variants

### 8-day window

```tsx
<WatchTimeChart data={[{ date: 'Apr 20', hours: 4120 }, ...]} />
```

### Custom title

```tsx
<WatchTimeChart title="Subscriber growth" subtitle="..." data={[...]} />
```

## Full source

```tsx
import { WatchTimeChart } from '@/modules/domains/media/chart/WatchTimeChart';
<WatchTimeChart data={[{ date: 'Apr 20', hours: 4120 }]} />
```
