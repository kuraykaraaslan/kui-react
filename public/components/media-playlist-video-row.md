# PlaylistVideoRow

- **id:** `media-playlist-video-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/media/playlist/PlaylistVideoRow.tsx`
- **status:** stable
- **since:** 2026-05

Numbered playlist row: position, thumbnail with duration, title, channel, now-playing state.

## Variants

### Now playing + idle

```tsx
<PlaylistVideoRow position={1} title="..." channelName="..." duration={3842} isPlaying />
```

### Draggable (reorderable)

```tsx
<PlaylistVideoRow position={1} title="..." channelName="..." draggable />
```

## Full source

```tsx
import { PlaylistVideoRow } from '@/modules/domains/media/playlist/PlaylistVideoRow';
<PlaylistVideoRow position={1} title="..." channelName="..." duration={3842} isPlaying />
```
