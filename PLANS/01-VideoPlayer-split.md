# VideoPlayer — Refactor Planı

## Hedef
`modules/ui/VideoPlayer.tsx` (1041 satır) tek-dosya bileşeni mantıksal alt parçalara böl. Ana `<VideoPlayer />` API yüzeyi (props, named export) aynı kalsın; sadece içerideki helper / hook / UI parçaları ayrı dosyalara taşınsın. EJS karşılığı [02_EJS_Components/modules/ui/VideoPlayer.ejs](../../02_EJS_Components/modules/ui/VideoPlayer.ejs) (886 satır) — pixel-perfect parite zorunlu, NextJS bölünmesini bitirdikten sonra EJS tarafında da aynı bölüntü uygulanmalı.

## Mevcut iskelet (modules/ui/VideoPlayer.tsx)
| Bölge | Satır | İçerik |
|---|---|---|
| helpers | 23–32 | `formatTime()` |
| types | 34–93 | `QualityOption`, `SubtitleTrack`, `AudioTrackOption`, `VideoSource`, `SubtitleFontSize`, `SettingsView`, Cast SDK arayüzleri |
| constants | 95–112 | `SPEEDS`, `SUBTITLE_SIZES`, `SUBTITLE_SIZE_LABELS` |
| props | 113–146 | `VideoPlayerProps` |
| main component | 149–935 | `VideoPlayer()` (refs, 11+ `useState`, 6 `useEffect`, ~20 callback, ~300 satır JSX) |
| sub-components | 937–1041 | `CtrlBtn`, `SettingsRow`, `SettingsSubMenu`, `SettingsOption` |

## Hedef yapı
```
modules/ui/VideoPlayer/
├── index.tsx                 ← named export `VideoPlayer` (eski public yüzey), <80 satır
├── types.ts                  ← public + internal tipler (≈90 satır)
├── constants.ts              ← SPEEDS, SUBTITLE_SIZES, SUBTITLE_SIZE_LABELS (≈25 satır)
├── format.ts                 ← formatTime() ve gerekirse `clamp`/`pct` yardımcıları
├── parts/
│   ├── CtrlBtn.tsx           ← satır 939–964
│   ├── SettingsRow.tsx       ← satır 966–988
│   ├── SettingsSubMenu.tsx   ← satır 990–1012
│   ├── SettingsOption.tsx    ← satır 1014–1041
│   ├── SettingsPanel.tsx     ← bugün satır 728–820 arası inline JSX (main, quality, speed, subtitles, subtitle-size, language görünümleri)
│   ├── ProgressBar.tsx       ← satır 821–853 (seek + hover preview)
│   └── ControlRow.tsx        ← satır 854–935 (alt kontrol şeridi)
└── hooks/
    ├── useVideoEvents.ts     ← satır 240–278 (timeupdate / waiting / canplay / play / pause / ended / volumechange / loadedmetadata)
    ├── useControlsVisibility.ts ← satır 208–236 (showControls + scheduleHide + resetHideTimer)
    ├── useFullscreen.ts      ← `isFullscreen` state + `fullscreenchange` listener (satır 437–449 yakın)
    ├── useKeyboardShortcuts.ts ← satır 571–592
    ├── useSubtitleCues.ts    ← satır 282–308
    └── useGoogleCast.ts      ← satır 310–435 (Cast SDK init + state sync + toggle)
```

> `index.tsx` yalnızca composition: refs, state slot’ları, hook çağrıları, üç bölümden oluşan render (video katmanı → overlay’ler → controls). 80–120 satırı aşmamalı.

## Adım adım
1. **Klasör + barrel.** `mv modules/ui/VideoPlayer.tsx modules/ui/VideoPlayer/index.tsx`. `modules/ui/VideoPlayer/index.ts` veya tsx barrel olmadan named export `index.tsx`’ten dışa verilsin (Next.js `@/modules/ui/VideoPlayer` çözümler).
2. **`types.ts`.** Public tipler (`QualityOption`, `SubtitleTrack`, `AudioTrackOption`, `VideoPlayerProps`) `export`; Cast SDK arayüzleri internal `type` (re-export etme). `index.tsx` ve hook’lar buradan import etsin.
3. **`constants.ts`.** Üç sabit (`SPEEDS`, `SUBTITLE_SIZES`, `SUBTITLE_SIZE_LABELS`). Sub-components ve SettingsPanel import eder.
4. **`format.ts`.** `formatTime()` — ek bağımlılığı yok.
5. **`parts/` sub-components.** Sırasıyla CtrlBtn / SettingsRow / SettingsSubMenu / SettingsOption: birebir taşı, importları düzelt; her dosya `'use client'` + named export.
6. **`parts/ProgressBar.tsx`.** Props: `{ duration, currentTime, buffered, seekHoverX, onSeek, onSeekMouseMove, onSeekLeave, progressRef }`. Yalnızca DOM + Tailwind; state yok.
7. **`parts/SettingsPanel.tsx`.** Props: `{ open, view, onClose, ... }` + seçili değerler + `apply*` callbackleri. İçinde `SettingsRow/SettingsSubMenu/SettingsOption` kullanılır. Outside-click effect (satır 439–449) burada **kalmaz**, parent’ta tutulur çünkü `settingsPanelRef` zaten dışarıda.
8. **`parts/ControlRow.tsx`.** Play/seekBy/volume/cast/fullscreen/settings butonlarını içeren alt çubuk. Tüm event handler’ları prop olarak alır; içeride state tutmaz.
9. **`hooks/useControlsVisibility.ts`.** `{ playing, paused, autoHide, isCasting }` → `{ showControls, scheduleHide, resetHideTimer }`. Timer ref hook içinde.
10. **`hooks/useVideoEvents.ts`.** `videoRef` + setter’ları (setCurrentTime/setDuration/setBuffered/setLoading/setPlaying/setVolume/setMuted) alır, listener’ları kurar ve cleanup’ı döner.
11. **`hooks/useSubtitleCues.ts`.** `videoRef`, `selectedSubtitle` → `cueText` state. Track `cuechange` listener cleanup’ı dahil.
12. **`hooks/useGoogleCast.ts`.** SDK loader (`__vp_cast` global), `CastContext` init, state sync, RemotePlayer cleanup, `toggleCast`. Döner: `{ castState, castDeviceName, toggleCast }`. Bu hook tek başına ≈140 satır olur — main dosyayı en çok küçülten parça.
13. **`hooks/useFullscreen.ts`.** Container ref + listener + `toggleFullscreen`.
14. **`hooks/useKeyboardShortcuts.ts`.** Container ref + `{ togglePlay, seekBy, toggleMute, handleVolumeChange, volume, toggleFullscreen }` callback’leri alır; cleanup döner.
15. **`index.tsx` toplam derleme.** Sıra: refs → state → hook çağrıları → render. Hiçbir hook gövdesi inline kalmamalı.
16. **Snapshot.** `npm run registry:snapshot` çalıştır; `public/registry/components.json`, `public/components/video-player.md`, `public/components/_index.json` güncellensin.
17. **Smoke testler.** `npm run dev` ile `/showcase` üzerinden VideoPlayer variant’larını manuel kontrol: play/pause, seek, fullscreen, ⌨ shortcut’lar, subtitle cue overlay, Cast button (SDK gelmediyse hidden), settings sub-menus.
18. **Tip kontrolü.** `npx tsc --noEmit`.

## Doğrulama kriterleri
- [ ] `git diff --stat` yalnızca `modules/ui/VideoPlayer/**`, registry snapshot dosyaları ve (varsa) import yolunda değişen tüketicileri içersin.
- [ ] `index.tsx` ≤ 150 satır.
- [ ] Hiçbir hook / parts dosyası 200 satırı geçmesin.
- [ ] Public API (`VideoPlayer`, `VideoPlayerProps`, `QualityOption`, `SubtitleTrack`, `AudioTrackOption`) eski tüketicilerden import edildiğinde aynı yoldan (`@/modules/ui/VideoPlayer`) çalışmaya devam etsin — barrel’ı kıracaksan tüketicileri (showcase + theme/media) güncelle.
- [ ] `npm run build` temiz; registry snapshot diff’i `components.json`’da yalnızca filePath/source güncellemesi olmalı.

## EJS pariteli plan ([02_EJS_Components/modules/ui/VideoPlayer.ejs](../../02_EJS_Components/modules/ui/VideoPlayer.ejs), 886 satır)
NextJS bölünmesi tamamlandıktan sonra **aynı sınırlarla** EJS tarafını da böl. Hedef dizini önerisi:
```
modules/ui/VideoPlayer/
├── VideoPlayer.ejs           ← markup + <% data block %>  (≤120 satır)
├── partials/
│   ├── _controls.ejs         ← alt kontrol şeridi (play, seek, volume, cast, fullscreen, settings butonu)
│   ├── _settings-panel.ejs   ← main + quality + speed + subtitles + subtitle-size + language görünümleri
│   └── _progress.ejs         ← seek + hover preview markup
├── scripts/
│   ├── controls-visibility.js
│   ├── video-events.js
│   ├── subtitle-cues.js
│   ├── cast.js               ← satır 599–699 (SDK loader + state sync)
│   ├── keyboard.js           ← satır 569–584
│   └── public-api.js         ← satır 701 sonrası `togglePlay`, `seekBy`, `toggleMute`, `setVolume` vb. global API
└── styles/VideoPlayer.css    ← (varsa) inline `<style>` dışarı
```
1. EJS partial’ları `include()` ile tek root `VideoPlayer.ejs`’den dahil et — `componentId` bağlamını tüm partial’lara forward et.
2. Inline `<script>` (satır 428–886) işlev gruplarına bölünüp her biri ayrı `.js` dosyası olarak `public/assets/js/video-player/`’a kopyalansın; markup’ta `<script src=...>` olarak yüklensin. Mevcut IIFE deseni korunsun.
3. Public API yüzeyi (`togglePlay`, `seekBy`, `toggleMute`, `setVolume`, `showVolume`, `vp:qualitychange` event) **aynı** kalsın — `02_EJS_Components/views/**` tüketicileri etkilenmesin.
4. `public/components/video-player.md` her iki repo için sync’li güncellensin (NextJS dosya yolları + EJS partial yolları aynı dokümanda).
5. Pixel-perfect parite ([feedback_pixel_perfect_parity.md](../../.claude/projects/-home-kuray-01-NextJS-Components/memory/feedback_pixel_perfect_parity.md)): aynı token’lar (`var(--primary)` vb.), aynı ikonlar, aynı klavye haritası, aynı subtitle font-size seçenekleri, aynı Cast davranışı.
