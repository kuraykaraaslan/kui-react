'use client';
import React, { useMemo, useState } from 'react';
import { VideoPlayer } from '@/modules/ui/VideoPlayer';
import type { ShowcaseComponent } from '../showcase.types';

const PLACEHOLDER_VIDEO = 'https://placeholdervideo.dev/1920x1080';

// ── inline subtitle blobs so no CORS issues ──────────────────────────────────

function makeVtt(content: string): string {
  const blob = new Blob([content], { type: 'text/vtt' });
  return URL.createObjectURL(blob);
}

const EN_VTT = `WEBVTT

00:00:01.000 --> 00:00:04.500
Welcome to the custom HTML5 video player.

00:00:05.000 --> 00:00:09.000
Press the gear icon to open settings.

00:00:09.500 --> 00:00:13.500
You can change quality, speed, language,
and subtitle font size.

00:00:14.000 --> 00:00:18.000
Keyboard shortcuts: Space=play, ←→=seek,
↑↓=volume, M=mute, F=fullscreen.
`;

const TR_VTT = `WEBVTT

00:00:01.000 --> 00:00:04.500
Özel HTML5 video oynatıcıya hoş geldiniz.

00:00:05.000 --> 00:00:09.000
Ayarlar menüsünü açmak için dişli simgesine basın.

00:00:09.500 --> 00:00:13.500
Kalite, hız, dil ve altyazı boyutunu
ayarlayabilirsiniz.

00:00:14.000 --> 00:00:18.000
Klavye kısayolları: Boşluk=oynat, ←→=ileri/geri,
↑↓=ses, M=sessiz, F=tam ekran.
`;

// ── demo components ───────────────────────────────────────────────────────────

function FullFeaturedDemo() {
  const subs = useMemo(
    () => [
      { label: 'English', srclang: 'en', src: makeVtt(EN_VTT) },
      { label: 'Türkçe', srclang: 'tr', src: makeVtt(TR_VTT) },
    ],
    [],
  );

  const [log, setLog] = useState('—');

  return (
    <div className="w-full max-w-2xl space-y-3">
      <VideoPlayer
        src={PLACEHOLDER_VIDEO}
        title="Placeholder Video — Full Features Demo"
        qualities={[
          { label: '1080p HD', value: '1080' },
          { label: '720p',     value: '720'  },
          { label: '480p',     value: '480'  },
          { label: '360p',     value: '360'  },
          { label: 'Auto',     value: 'auto' },
        ]}
        defaultQuality="auto"
        subtitles={subs}
        audioTracks={[
          { label: 'English',  language: 'en' },
          { label: 'Türkçe',   language: 'tr' },
          { label: 'Français', language: 'fr' },
        ]}
        onQualityChange={(v) => setLog(`Quality → ${v}`)}
        onAudioTrackChange={(i) => setLog(`Audio track → ${i}`)}
      />
      <p className="text-xs text-text-secondary">
        <span className="font-semibold text-text-primary">Son callback:</span> {log}
      </p>
    </div>
  );
}

function SubtitlesOnlyDemo() {
  const subs = useMemo(
    () => [
      { label: 'English', srclang: 'en', src: makeVtt(EN_VTT) },
      { label: 'Türkçe',  srclang: 'tr', src: makeVtt(TR_VTT) },
    ],
    [],
  );

  return (
    <div className="w-full max-w-xl">
      <VideoPlayer
        src={PLACEHOLDER_VIDEO}
        title="Placeholder Video — Subtitle Demo"
        subtitles={subs}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function buildMediaData(): ShowcaseComponent[] {
  return [
    {
      id: 'video-player',
      title: 'VideoPlayer',
      category: 'Molecule',
      abbr: 'Vp',
      description:
        'Custom HTML5 video player. Quality, subtitle, audio track, and playback rate selection; custom WebVTT subtitle overlay; auto-hiding controls; programmatic API. Keyboard shortcuts: Space/K=play, ←→=±10s, ↑↓=volume, M=mute, F=fullscreen.',
      filePath: 'modules/ui/VideoPlayer/index.tsx',
      sourceCode: `'use client';
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
/>`,
      variants: [
        {
          title: 'Full featured (kalite + altyazı + dil)',
          layout: 'stack' as const,
          preview: <FullFeaturedDemo />,
          code: `<VideoPlayer
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
/>`,
        },
        {
          title: 'Subtitle + Font Boyutu',
          layout: 'stack' as const,
          preview: <SubtitlesOnlyDemo />,
          code: `<VideoPlayer
  src="video.mp4"
  poster="poster.jpg"
  title="Elephants Dream"
  subtitles={[
    { label: 'English', srclang: 'en', src: 'en.vtt' },
    { label: 'Türkçe',  srclang: 'tr', src: 'tr.vtt' },
  ]}
/>`,
        },
        {
          title: 'Minimal (sadece oynatma hızı)',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-lg">
              <VideoPlayer
                src={PLACEHOLDER_VIDEO}
              />
            </div>
          ),
          code: `<VideoPlayer src="video.mp4" poster="poster.jpg" />`,
        },
      ],
    },
  ];
}
