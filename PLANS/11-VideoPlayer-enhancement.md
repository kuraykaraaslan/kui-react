# VideoPlayer — Geliştirme Planı (Dünya Standardı)

> Refactor planı: [01-VideoPlayer-split.md](./01-VideoPlayer-split.md). Bu doküman **bölünme sonrası** uygulanacak özellik yol haritasıdır. Her milestone NextJS ([modules/ui/VideoPlayer/](../modules/ui/VideoPlayer/)) **ve** EJS ([02_EJS_Components/modules/ui/VideoPlayer.ejs](../../02_EJS_Components/modules/ui/VideoPlayer.ejs)) tarafında **eş zamanlı** uygulanmalı — [feedback_pixel_perfect_parity.md](../.claude/projects/-home-kuray-01-NextJS-Components/memory/feedback_pixel_perfect_parity.md), [feedback_ejs_nextjs_parity.md](../.claude/projects/-home-kuray-01-NextJS-Components/memory/feedback_ejs_nextjs_parity.md).

## Kuzey Yıldızı
YouTube + Vimeo + Plyr + Video.js seviyesinde, framework-agnostik, sıfır eksternal `<script>`-zorunluluğu, SSR-güvenli, AA-erişilebilir, mobil-first bir HTML5 video oynatıcı.

## Karşılaştırma referansları
- **YouTube** — hover scrubber sprite, chapter, theatre mode, qualityCap, stats-for-nerds.
- **Vimeo** — chapters menu, brand color theming, password protection UI.
- **Plyr** — minimal Premium UI, declarative attribute API, kıyaslama için hedef.
- **Video.js** — pluggable architecture, HLS/DASH tech, Live UI.
- **Apple TV / Netflix** — skip-intro, next-episode, audio descriptions, dolby badge.

## Özellik milestone’ları

### M1 — Adaptive streaming + PiP + storyboard
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| HLS desteği | `hls.js` (dynamic import, sadece browser destek yoksa) | `hls.js` (CDN veya `public/assets/js/`) | Safari native HLS; Chrome/FF için `hls.js`. `videoRef.current.canPlayType('application/vnd.apple.mpegurl')` ile branşla. |
| DASH desteği (opsiyonel) | `dashjs` dynamic import | aynı | `type === 'application/dash+xml'` algılaması. |
| Picture-in-Picture | `videoRef.current.requestPictureInPicture()` | DOM api | Safari `webkitSetPresentationMode`. Toggle butonu `ControlRow` içinde. |
| Storyboard / sprite scrubber | `seekHover` üzerinde `<img>` background-position | aynı | Yeni prop: `storyboard: { url, columns, rows, frameWidth, frameHeight, interval }`. Hover x → frame indeksi. |
| Buffered segments visualization | mevcut tek buffered yerine `TimeRanges` iter | aynı | `ProgressBar.tsx`’te birden çok gri parça. |
| Loading skeleton + retry | Error state + 3 deneme + manuel retry butonu | aynı | `error` state event listener (`video.error`). |

**API delta:**
```ts
type VideoPlayerProps = {
  // ...mevcut
  storyboard?: { url: string; columns: number; rows: number; frameWidth: number; frameHeight: number; interval: number };
  pictureInPicture?: boolean;
  drm?: { type: 'widevine' | 'playready' | 'fairplay'; licenseUrl: string };
  onError?: (err: MediaError | Error) => void;
  onPictureInPictureChange?: (active: boolean) => void;
};
```

### M2 — Chapters, markers, skip-intro
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| Chapters | Progress bar üzerinde tick’ler + hover label + menü | aynı | Yeni prop: `chapters: { time: number; title: string; thumbnail?: string }[]`. |
| Markers (genel) | renkli noktalar (highlight, ad, content warning) | aynı | `markers: { time, color, label, kind }[]`. |
| Skip intro / outro | aralık tanımı + sağ-alt floating button | aynı | `skipRanges: { from, to, label }[]`. 3 sn fade-in. |
| Next-episode card | son 20 sn’de otomatik | aynı | `nextEpisode: { thumbnail, title, durationLeft, onPlay }`. |

### M3 — Klavye, gestures, kalıcı tercihler
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| Klavye haritası genişletme | Space, ←/→ (5s), ↑/↓ (vol), J/L (10s), K (toggle), M, F, C, 0–9 (% seek), Shift+? (overlay) | aynı | `useKeyboardShortcuts`’a layer ekle. |
| Klavye yardım overlay | Shift+? açar | aynı | Modal partial. |
| Touch gestures | Double-tap (sol/sağ 10s), iki parmak vertical swipe (volume), pinch (fullscreen) | aynı (vanilla touch event) | Sol/sağ ripple animasyonu (YouTube-style). |
| Tercihleri kalıcı yap | `localStorage` key `vp:prefs:<id>` | aynı | `persistPrefs: boolean` prop. Speed, volume, captions, quality, fontSize. |
| Resume position | `localStorage` `vp:position:<src>` | aynı | `resumePlayback: boolean` prop; "Continue from 2:34" toast. |

### M4 — A11y AAA + i18n + ekran okuyucu
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| Tüm kontroller `aria-label` + role | mevcut + eksiklikleri tara | aynı | Audit: button’larda `aria-pressed`/`aria-expanded` doğru. |
| Live region announcements | `LiveRegion` (zaten ui/ atomu var) | yeni `<div aria-live="polite">` | "Playing", "Paused at 2:34", "Quality set to 1080p" gibi. |
| Caption ayarları | mevcut size + background opacity + font family + edge style | aynı | YouTube’un caption styling paneli. |
| Audio Descriptions track | extra `<track kind="descriptions">` desteği | aynı | Settings menüde toggle. |
| Klavye yakalama içeri (`focus trap`) fullscreen + settings | `@/modules/app/AccessibilityKit` ile | aynı (basit focus loop) | |
| i18n | tüm string’ler `t()` üzerinden — `messages: { play, pause, mute, unmute, settings, ... }` prop | aynı (EJS locals) | TR/EN/AR/... |

### M5 — Performans + telemetri
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| Lazy SDK loading | `hls.js`, `dashjs`, Cast SDK sadece kullanıldığında | aynı | Bundle-size: ana yol < 20kB gzipped. |
| `requestVideoFrameCallback` ile subtitle render | düşük güçlü cihazlarda fps tasarrufu | aynı | Fallback `timeupdate`. |
| Quality auto + bandwidth detect | hls.js ABR + manuel override | aynı | "Auto (1080p)" gösterimi. |
| Telemetri event’leri | `onTelemetry?: (e: TelemetryEvent) => void` | window event dispatch | `play`, `pause`, `seek`, `qualityChange`, `bufferStart`, `bufferEnd`, `error`, `complete`, `quartile-25/50/75`, `fullscreen-enter/exit`, `pip-enter/exit`. |
| Web Vitals dostu | autoplay’i `preload="metadata"` + IntersectionObserver | aynı | Player ekranda görünene kadar ağ yükü minimum. |

### M6 — Premium özellikler
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| AirPlay (Safari) | `disableRemotePlayback` + `WebKitPlaybackTargetAvailabilityEvent` | aynı | Cast yanına ikon. |
| 360° / VR | three.js + equirectangular shader (opsiyonel paket) | aynı (CDN three.js) | Yeni prop `projection: '360' | 'vr' | undefined`. |
| Theatre mode | container CSS class toggle | aynı | Aspect kilidi: `wide` modunda parent stretch. |
| Loop range | A-B loop (klavye `[` ve `]`) | aynı | Kalıcı değil, oturum bazlı. |
| Ad markers + ad break UI | timeline’a `markers[kind=ad]` + "Ad 1/3" overlay | aynı | Ad SDK entegrasyonu OUT-OF-SCOPE; sadece UI. |

## Public API delta özeti (kümülatif)
```ts
type VideoPlayerProps = {
  src: string | VideoSource[];
  poster?: string;
  startMuted?: boolean;
  autoHideControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  qualities?: QualityOption[];
  subtitles?: SubtitleTrack[];
  audioTracks?: AudioTrackOption[];

  // M1
  storyboard?: StoryboardConfig;
  pictureInPicture?: boolean;
  drm?: DrmConfig;
  // M2
  chapters?: Chapter[];
  markers?: Marker[];
  skipRanges?: SkipRange[];
  nextEpisode?: NextEpisodeCard;
  // M3
  persistPrefs?: boolean;
  resumePlayback?: boolean;
  // M4
  messages?: Partial<VideoPlayerMessages>;
  // M5
  preload?: 'none' | 'metadata' | 'auto';
  onTelemetry?: (e: VideoPlayerTelemetry) => void;
  // M6
  projection?: '360' | 'vr';
  theatreMode?: boolean;
  airplay?: boolean;

  // Tüm event’ler
  onError?: (err: MediaError | Error) => void;
  onQualityChange?: (q: QualityOption) => void;
  onSubtitleChange?: (track: SubtitleTrack | null) => void;
  onPictureInPictureChange?: (active: boolean) => void;
  onFullscreenChange?: (active: boolean) => void;
  onChapterChange?: (chapter: Chapter | null) => void;
};
```

## A11y kabul kriterleri (M4 sonu)
- [ ] axe-core 0 violations (`/showcase` üzerinde otomatik test).
- [ ] Klavye-only akış: focus visible, asla kaybolmuyor, tüm UI tab order’da.
- [ ] VoiceOver + NVDA testi geçti (manuel kontrol listesi `PLANS/checklists/a11y-video.md`).
- [ ] Reduced-motion respect: `prefers-reduced-motion` → seek ripple, transition kapalı.
- [ ] Color contrast: tüm kontroller WCAG AAA (>7:1) — özellikle progress hover label.

## Performans bütçesi
| Metrik | Hedef |
|---|---|
| Ana yol JS (gzip) | ≤ 20 kB |
| HLS.js eklendiğinde | + ≤ 60 kB lazy |
| First playable frame | ≤ 1.5 s (yerel 1080p) |
| Re-render / sn | ≤ 3 (mouse hareketi hariç) |
| FPS (1080p playback) | ≥ 58 (Mac M1) |

## Telemetri şeması
```ts
type VideoPlayerTelemetry =
  | { type: 'play'; t: number }
  | { type: 'pause'; t: number }
  | { type: 'seek'; from: number; to: number }
  | { type: 'quality-change'; from: string; to: string; reason: 'manual' | 'abr' }
  | { type: 'buffer-start'; t: number }
  | { type: 'buffer-end'; t: number; durationMs: number }
  | { type: 'error'; code: number; message: string }
  | { type: 'complete' }
  | { type: 'quartile'; quartile: 25 | 50 | 75 | 100 }
  | { type: 'fullscreen'; active: boolean }
  | { type: 'pip'; active: boolean }
  | { type: 'cast'; active: boolean; device?: string };
```

## EJS paritesi
- Her milestone’da NextJS pull request’i ile **aynı sprint** EJS değişikliği eşli açılmalı.
- Public API: EJS `data-*` attribute’ları + `window.vp(id).method()` API’si NextJS `props`/`refs` API’si ile bire bir.
- Token ve ikon paritesi: `var(--*)` tokens + FontAwesome (NextJS `@fortawesome/react-fontawesome`, EJS `<i class="fa-solid fa-...">`).
- Pixel kontrolü: `02_EJS_Components/scripts/` altında her milestone sonu Playwright screenshot diff (`/showcase/components/video-player` ile EJS `/components/video-player` karşılaştırması).

## Definition of Done (milestone başına)
- [ ] NextJS + EJS implementation merge edildi.
- [ ] Showcase variant’ı yeni özelliği gösteriyor (en az 1 variant).
- [ ] `public/components/video-player.md` güncellendi (özellik tablosu + props referansı).
- [ ] `npm run registry:snapshot` çalıştırıldı, JSON snapshot’lar commit’li.
- [ ] A11y + telemetri + i18n kabul kriterleri yeşil.
- [ ] CHANGELOG.md (her iki repo) — `## [VideoPlayer Mx]` başlığı altında özellik notları.
