# ChannelCard

- **id:** `media-channel-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/media/channel/ChannelCard.tsx`
- **status:** stable
- **since:** 2026-05

Channel profile card: avatar, name, verified badge, subscriber count, and subscribe button.

## Variants

### Verified channel

```tsx
<ChannelCard channel={channel} href="/channels" />
```

### Unverified channel

```tsx
<ChannelCard channel={{ ...channel, verified: false }} />
```

## Full source

```tsx
import { ChannelCard } from '@/modules/domains/media/channel/ChannelCard';
<ChannelCard channel={channel} href="/channels" />
```
