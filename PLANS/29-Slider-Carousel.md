# Slider (Carousel) — Geliştirme Planı (EJS Pariteli)

> NextJS: [Slider.tsx](../modules/ui/Slider.tsx) 133. EJS: 149.  
> Mevcut: `slides`, `autoPlay`, `autoPlayInterval`, `showDots`, `showArrows`, `loop`.

## Kuzey Yıldızı
Embla Carousel + Swiper + Keen Slider seviyesi: touch swipe, momentum, snap points, lazy slide, vertical/horizontal, multi-slide-per-view, accessible (WAI-ARIA carousel pattern).

---

## Hedef yapı
```
modules/ui/Slider/
├── index.tsx              ← named export Slider
├── types.ts               ← Slide, SliderRef, Orientation
├── parts/
│   ├── Track.tsx          ← transform-based scroller
│   ├── Slide.tsx          ← wrapper + lazy mount
│   ├── Arrows.tsx
│   ├── Dots.tsx
│   ├── Thumbnails.tsx
│   └── Progress.tsx       ← linear veya circular autoplay countdown
└── hooks/
    ├── useDrag.ts         ← pointer + momentum
    ├── useAutoPlay.ts     ← interval + pause on hover/focus/blur
    ├── useKeyboard.ts     ← arrow / Home / End
    ├── useSnap.ts         ← scroll-snap CSS + JS fallback
    └── useLoop.ts         ← virtual infinite loop (clone slides)
```

### EJS paralel
- Slider.ejs root + partials (_track/_arrows/_dots/_thumbs).
- scripts: drag.js, autoplay.js, keyboard.js, snap.js, loop.js.

---

## Milestone'lar

### M1 — Touch swipe + momentum
- Pointer events (touch + mouse + pen).
- Momentum: hızlı flick → daha çok slide.
- `dragThreshold` (varsayılan 50 px).
- Velocity-based snap.
- Edge resistance (loop yoksa).

### M2 — Layout variantları
- `slidesPerView: number | 'auto'`.
- `slidesToScroll: number`.
- Responsive breakpoints (`breakpoints: { 640: {...}, 1024: {...} }`).
- Vertical orientation.
- Aspect ratio lock.

### M3 — Loop + autoplay polish
- Virtual infinite loop (clone + reposition).
- Autoplay pause-on-hover, pause-on-focus-within, pause-on-visibility-change.
- Autoplay direction: forward/backward.
- Progress bar (linear / circular).
- Cross-fade transition opsiyonu (slide yerine fade).

### M4 — Premium
- Thumbnail nav (mini-track).
- Sync iki Slider (main + thumbs).
- Parallax content per slide.
- Lazy slide (sadece komşu N slide mount).
- Coverflow / cards / cube effect (3D transform).

### M5 — A11y + i18n
- WAI-ARIA Carousel pattern.
- Klavye: arrow keys, Home, End, Space (pause/play).
- `aria-live="polite"` slide changes.
- `messages: { prev, next, slideOf, pause, play }`.
- Reduced motion: instant snap, autoplay default off.

---

## Public API
```ts
type SliderProps = {
  slides: React.ReactNode[] | { id: string; content: React.ReactNode }[];
  orientation?: 'horizontal' | 'vertical';
  slidesPerView?: number | 'auto';
  slidesToScroll?: number;
  breakpoints?: Record<number, Partial<SliderProps>>;
  loop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  autoPlayDirection?: 'forward' | 'backward';
  pauseOnHover?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  showThumbnails?: boolean | { aspect?: number };
  showProgress?: boolean | 'linear' | 'circular';
  effect?: 'slide' | 'fade' | 'coverflow' | 'cards' | 'cube';
  dragThreshold?: number;
  lazy?: boolean;
  messages?: Partial<SliderMessages>;
  onSlideChange?: (index: number) => void;
};
```

## Perf
- Core ≤ 8 kB.
- 3D effects lazy +3 kB.
- 60 fps drag.

## DoD
- [ ] NextJS + EJS paralel.
- [ ] axe-core 0 violations.
- [ ] Showcase: basic / loop / autoplay / multi-view / vertical / fade / thumbnails / sync variants.
