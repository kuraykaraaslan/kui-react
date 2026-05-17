# ChannelStatsCard

- **id:** `media-channel-stats-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/media/channel/ChannelStatsCard.tsx`
- **status:** stable
- **since:** 2026-05

Creator dashboard tile: 4 KPI metrics with deltas (subscribers, views, watch time, videos).

## Variants

### All four KPIs

```tsx
<ChannelStatsCard channelName="CodeWithAlex" stats={[...]} />
```

### Negative deltas

```tsx
<ChannelStatsCard channelName="WanderFar" period="Last 7 days" stats={[{ metric: 'subscribers', value: 728000, deltaPct: -0.6 }, { metric: 'views', value: 184000, deltaPct: -8.2 }]} />
```

## Full source

```tsx
import { ChannelStatsCard } from '@/modules/domains/media/channel/ChannelStatsCard';
<ChannelStatsCard channelName="..." stats={[{ metric: 'views', value: 1_242_000, deltaPct: 12.8 }]} />
```
