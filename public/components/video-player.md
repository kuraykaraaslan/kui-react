# VideoPlayer

- **id:** `video-player`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/VideoPlayer.tsx`
- **status:** beta
- **since:** 2025-04

Custom HTML5 video player. Quality, subtitle, audio track, and playback rate selection; custom WebVTT subtitle overlay; auto-hiding controls; programmatic API. Keyboard shortcuts: Space/K=play, ←→=±10s, ↑↓=volume, M=mute, F=fullscreen.

## Variants

### Full featured (kalite + altyazı + dil)

```tsx
<VideoPlayer
  src="video.mp4"
  poster="poster.jpg"
  title="Video Title"
  qualities={[
    { label: '1080p HD', value: '1080' },
    { label: '720p',     value: '720'  },
    { label: 'Auto',     value: 'auto' },
  ]}
  subtitles={[
    { label: 'English', srclang: 'en', src: 'en.vtt' },
    { label: 'Türkçe',  srclang: 'tr', src: 'tr.vtt' },
  ]}
  audioTracks={[
    { label: 'English', language: 'en' },
    { label: 'Türkçe',  language: 'tr' },
  ]}
  onQualityChange={(v) => console.log(v)}
  onAudioTrackChange={(i) => console.log(i)}
/>
```

### Subtitle + Font Boyutu

```tsx
<VideoPlayer
  src="video.mp4"
  poster="poster.jpg"
  title="Elephants Dream"
  subtitles={[
    { label: 'English', srclang: 'en', src: 'en.vtt' },
    { label: 'Türkçe',  srclang: 'tr', src: 'tr.vtt' },
  ]}
/>
```

### Minimal (sadece oynatma hızı)

```tsx
<VideoPlayer src="video.mp4" poster="poster.jpg" />
```

## Full source

```tsx
'use client';
import { VideoPlayer } from '@/modules/ui/VideoPlayer';

<VideoPlayer
  src="video.mp4"
  poster="poster.jpg"
  title="My Video"
  qualities={[
    { label: '1080p HD', value: '1080' },
    { label: '720p',     value: '720'  },
    { label: 'Auto',     value: 'auto' },
  ]}
  defaultQuality="auto"
  subtitles={[
    { label: 'English', srclang: 'en', src: 'en.vtt' },
    { label: 'Türkçe',  srclang: 'tr', src: 'tr.vtt' },
  ]}
  audioTracks={[
    { label: 'English', language: 'en' },
    { label: 'Türkçe',  language: 'tr' },
  ]}
  onQualityChange={(v) => console.log('quality:', v)}
  onAudioTrackChange={(i) => console.log('audio track:', i)}
/>
```
