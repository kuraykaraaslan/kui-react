# PlaylistHeaderCard

- **id:** `media-playlist-header-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/media/playlist/PlaylistHeaderCard.tsx`
- **status:** stable
- **since:** 2026-05

Playlist hero: cover image, visibility badge, total duration, owner channel, play / shuffle.

## Variants

### Public playlist

```tsx
<PlaylistHeaderCard title="..." videoCount={3} totalDurationSeconds={12012} channel={{ name, handle, verified: true }} />
```

### Unlisted, no cover

```tsx
<PlaylistHeaderCard title="..." visibility="UNLISTED" videoCount={3} totalDurationSeconds={6370} channel={{ name, handle }} />
```

## Full source

```tsx
import { PlaylistHeaderCard } from '@/modules/domains/media/playlist/PlaylistHeaderCard';
<PlaylistHeaderCard title="..." videoCount={3} totalDurationSeconds={12000} channel={{ name, handle }} />
```
