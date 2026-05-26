# ImageGallery — Geliştirme Planı (Dünya Standardı)

> Refactor planı: [04-ImageGallery-split.md](./04-ImageGallery-split.md). Bu doküman **bölünme sonrası** uygulanacak özellik yol haritasıdır. Her milestone NextJS ([modules/app/ImageGallery/](../modules/app/ImageGallery/)) **ve** EJS ([02_EJS_Components/modules/app/ImageGallery.ejs](../../02_EJS_Components/modules/app/ImageGallery.ejs)) tarafında **eş zamanlı** uygulanmalı — [feedback_pixel_perfect_parity.md](../.claude/projects/-home-kuray-01-NextJS-Components/memory/feedback_pixel_perfect_parity.md), [feedback_ejs_nextjs_parity.md](../.claude/projects/-home-kuray-01-NextJS-Components/memory/feedback_ejs_nextjs_parity.md).

## Kuzey Yıldızı
PhotoSwipe + Lightgallery + Google Photos + Unsplash arası — masonry/justified layout, pinch-zoom lightbox, mobil swipe + gesture, ARIA-compliant, virtualization’lı, sıfır 3rd-party dependency.

## Karşılaştırma referansları
- **PhotoSwipe v5** — referans lightbox UX, pinch zoom, swipe close.
- **Lightgallery** — share + download + auto-slideshow.
- **Google Photos** — justified row layout, hover preview, smart selection.
- **Unsplash** — masonry, blur-up placeholder (BlurHash).
- **Adobe Bridge / Lightroom** — Multi-select + bulk operations, EXIF, sorting.

## Özellik milestone’ları

### M1 — Layout + perf temelleri
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| Masonry layout | CSS columns (cheap) veya JS-positioned (kontrollü) | aynı | Yeni prop: `layout: 'grid' | 'masonry' | 'justified'`. |
| Justified layout | Flickr-style — her satırın yüksekliği sabit, genişlik resimden | `flickr-justified-gallery` mantığı, vanilla JS | `targetRowHeight: 240`. |
| Lazy loading | `loading="lazy"` + IntersectionObserver fallback | aynı | Hepsi viewport-aware. |
| BlurHash / LQIP placeholder | `image.blurhash?: string` → canvas blur fade | aynı (canvas decoder) | Veya `image.lqip?: string` (base64 küçük thumb). |
| Virtualization | Çok büyük galeride (>200) `react-window`’a benzer manual windowing | aynı | Sadece görünür rows render edilir. |
| AVIF / WebP fallback | `<picture><source type=...>` | aynı | `image.srcset?` veya `image.formats?: { avif, webp, jpeg }`. |

**API delta:**
```ts
type ImageGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  // Yeni
  width?: number;
  height?: number;
  blurhash?: string;
  lqip?: string;
  formats?: { avif?: string; webp?: string; jpeg?: string };
  thumbnail?: string;
  srcset?: string;
  href?: string;
  meta?: { taken?: string; camera?: string; location?: string };
};

type ImageGalleryProps = {
  // mevcut + yeni
  layout?: 'grid' | 'masonry' | 'justified';
  targetRowHeight?: number;
  virtualize?: boolean | { overscan?: number };
};
```

### M2 — Lightbox dünya standardı
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| Pinch-zoom + pan | Touch event’leri + transform matrix | aynı | iOS Safari double-tap fix. |
| Çift tık zoom (desktop) | mevcut zoom toggle’i tutuyor — animasyonu polish et | aynı | `transition: transform 220ms ease-out`. |
| Swipe to dismiss (mobil) | vertical drag → progressive fade → release > 100 px = close | aynı | Açma da reverse animasyon. |
| Slide animasyonu | Cross-fade veya horizontal slide (kullanıcı seçimi) | aynı | `transitionMode: 'fade' | 'slide'`. |
| Slideshow / autoplay | Toggle + interval (3–10 sn) + progress bar | aynı | Play/pause butonu. |
| Fullscreen API | Fullscreen butonu — `requestFullscreen()` | aynı | Mevcut UI’dan ayrı: lightbox + fullscreen kombinasyonu. |
| Klavye genişletme | Mevcut ←/→ ESC + Home/End, F (fullscreen), Space (slideshow), +/- zoom | aynı | |
| Share | Web Share API + fallback (copy link) | aynı | Btn. |
| Download | `<a download>` link + butonu | aynı | |
| EXIF panel | `i` tuşu → meta gösterimi | aynı | `image.meta` prop’tan. |

### M3 — Yönetim + bulk ops
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| Multi-select | Checkbox hover overlay, Shift-click range, Ctrl/Cmd toggle | aynı | `selectable: boolean`, `selectedSrcs`, `onSelectionChange`. |
| Bulk delete | Sayfa-üstü toolbar — "3 selected, Delete / Move / Tag". | aynı | `onBulkAction?: (action: string, indices: number[]) => void`. |
| Sort | Toolbar dropdown — date/name/custom. | aynı | `onSortChange`. |
| Filter / tag | Toolbar chips, `tags?: string[]` per image. | aynı | `tags?: string[]`. |
| Drag-to-upload | Empty state veya köşeye drop zone — `onAddFiles`. | aynı | Mobile’da kamera butonu. |
| Reorder undo | Reorder sonrası Snackbar/Toast "Undo" 4 sn. | aynı | |
| Context menu genişletme | Send to / Set as cover / Duplicate / View metadata | aynı | Mevcut menü genişletilir. |

### M4 — A11y + i18n + responsive cilası
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| Roving tabindex | Grid: tek seferde 1 hücre focusable, arrow keys ile gezin. | aynı | A11y standardı. |
| ARIA grid pattern | `role="grid"`, `role="row"`, `role="gridcell"`. | aynı | |
| Lightbox focus trap | Açıkken focus içeri kilitlenir. | aynı | `@/modules/app/AccessibilityKit`. |
| Screen reader anonsu | "Image 3 of 24, Sunset over Antalya". | aynı | `aria-live`. |
| Reduced motion | `prefers-reduced-motion: reduce` → animasyon kapalı. | aynı | |
| i18n | `messages` prop — open, close, next, prev, zoom, share, download, delete, move, slideshow. | aynı (EJS locals) | |
| Responsive breakpoints | 2 / 3 / 4 col mevcut, ek 5/6 col XL. | aynı | |
| Touch target | Min 44×44 px context menu, toolbar butonu. | aynı | iOS HIG. |

### M5 — Bulut entegrasyonu + premium
| Özellik | NextJS | EJS | Notlar |
|---|---|---|---|
| Server-paginated mode | `mode: 'static' | 'paginated' | 'infinite'`, `onLoadMore?` | aynı | Endpoint contract — `{ items, nextCursor }`. |
| Progressive enhancement | Server-side initial 24 → client lazy load rest. | aynı | |
| 360°/Panorama / Video item | `image.type: 'image' | '360' | 'video'`. | aynı | Lightbox’ta uygun render. Video için VideoPlayer entegre. |
| Slide presets | "Polaroid", "Tile", "Filmstrip" — preset prop. | aynı | |
| Annotation overlay | `image.hotspots?: { x, y, label }[]` — hover/tap. | aynı | |

## Public API delta özeti (kümülatif)
```ts
type ImageGalleryProps = {
  images: ImageGalleryImage[];
  columns?: 2 | 3 | 4 | 5 | 6;
  aspect?: 'square' | 'video' | 'portrait' | 'auto';
  gap?: 'sm' | 'md' | 'lg';
  lightbox?: boolean;
  showCaptions?: boolean;

  // M1
  layout?: 'grid' | 'masonry' | 'justified';
  targetRowHeight?: number;
  virtualize?: boolean | { overscan?: number };
  // M2
  transitionMode?: 'fade' | 'slide';
  slideshow?: { intervalMs: number; autoStart?: boolean };
  enableShare?: boolean;
  enableDownload?: boolean;
  // M3
  reorderable?: boolean;
  selectable?: boolean;
  selectedSrcs?: string[];
  onSelectionChange?: (selected: string[]) => void;
  onReorder?: (images: ImageGalleryImage[]) => void;
  onRemove?: (index: number, image: ImageGalleryImage) => void;
  onBulkAction?: (action: string, indices: number[]) => void;
  onSortChange?: (mode: 'date' | 'name' | 'custom') => void;
  onAddFiles?: (files: File[]) => void;
  tags?: string[];
  // M4
  messages?: Partial<ImageGalleryMessages>;
  reducedMotion?: boolean;
  // M5
  mode?: 'static' | 'paginated' | 'infinite';
  onLoadMore?: () => Promise<ImageGalleryImage[]>;
};
```

## A11y kabul kriterleri (M4 sonu)
- [ ] axe-core 0 violations.
- [ ] Tab + arrow ile tüm grid gezilebilir, Enter ile lightbox açılır, ESC ile kapanır.
- [ ] VoiceOver: thumb açıklaması ve lightbox’ta "Image n of m" anonsu.
- [ ] Reduced motion honor edildi.
- [ ] Touch target ≥ 44×44 px.

## Performans bütçesi
| Metrik | Hedef |
|---|---|
| Ana yol JS (gzip) | ≤ 12 kB |
| BlurHash decoder | + ~ 3 kB lazy |
| 24 thumb ilk render | ≤ 400 ms (LCP-friendly) |
| 1 000 image (virtualized) | ilk paint ≤ 500 ms, scroll fps ≥ 58 |
| Lightbox açılış animasyonu | < 200 ms |

## Telemetri şeması
```ts
type ImageGalleryTelemetry =
  | { type: 'open-lightbox'; index: number }
  | { type: 'close-lightbox' }
  | { type: 'lightbox-nav'; from: number; to: number; via: 'keyboard' | 'swipe' | 'click' }
  | { type: 'lightbox-zoom'; level: number }
  | { type: 'slideshow-start' | 'slideshow-stop' }
  | { type: 'share'; index: number; channel?: string }
  | { type: 'download'; index: number }
  | { type: 'reorder'; from: number; to: number }
  | { type: 'remove'; index: number }
  | { type: 'select'; count: number }
  | { type: 'bulk-action'; action: string; count: number };
```

## EJS paritesi
- Her milestone’da NextJS ve EJS PR’ları **aynı sprint** içinde merge.
- Public yüzey: NextJS `props` ↔ EJS `data-*` attribute’ları + `window.imageGallery(id).method()`.
- BlurHash / LQIP / virtualization gibi client-only özellikler EJS tarafında `<script>` IIFE içinde aynı algoritma — paylaşılabilir saf JS modülleri `public/assets/js/image-gallery/` altında.
- Pixel kontrolü: her milestone sonu Playwright screenshot diff (NextJS showcase vs EJS showcase).
- Token + ikon: aynı `var(--*)` ve aynı Font Awesome ikonları (her iki repoda).

## Definition of Done (milestone başına)
- [ ] NextJS + EJS implementation merge edildi.
- [ ] Showcase variant’ı yeni özelliği gösteriyor (en az 1).
- [ ] `public/components/image-gallery.md` her iki repoda güncel.
- [ ] `npm run registry:snapshot` çalıştırıldı, snapshot commit’li.
- [ ] A11y + telemetri + i18n + perf kabul kriterleri yeşil.
- [ ] CHANGELOG.md (her iki repo) — `## [ImageGallery Mx]`.
