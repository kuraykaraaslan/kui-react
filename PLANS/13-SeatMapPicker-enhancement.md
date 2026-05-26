# SeatMapPicker — Geliştirme Planı (Dünya Standardı)

> Refactor planı: [03-SeatMapPicker-split.md](./03-SeatMapPicker-split.md). Bu doküman **bölünme sonrası** uygulanacak özellik yol haritasıdır. Hedef: Ticketmaster + StubHub + Bilet.com + SeatGeek seviyesinde, mobil-first, erişilebilir bir koltuk seçim deneyimi.

> **EJS karşılığı yok** — `02_EJS_Components` Event modülü içermiyor. Sadece NextJS tarafı kapsamda.

## Kuzey Yıldızı
Mobil first, 5 000+ koltuklu stadyum performansını koruyan, pinch-zoom + drag rectangle bulk-select destekli, fiyat ve erişilebilirlik filtrelenebilen, deep-linkable koltuk seçici.

## Karşılaştırma referansları
- **Ticketmaster** — "Best available" algorithm, fiyat filtresi, view-from-seat fotoğrafı.
- **StubHub** — heatmap fiyatlandırma, hover’da seat tooltip.
- **SeatGeek** — Deal Score (best value) overlay.
- **Bilet.com / Biletinial** — yerli pazar: stadyum/tribün hiyerarşisi, Türkçe etiket.
- **SeatsIO** — endüstri standardı, embeddable charts; performans referansı.

## Özellik milestone’ları

### M1 — Pan + zoom + virtualization
| Özellik | Notlar |
|---|---|
| Venue map pan + zoom | Wheel zoom (Ctrl+wheel), pinch zoom (mobil), drag pan. Min 0.5×, max 4×. |
| Seat grid pan + zoom | Aynı kontrol; section detail görünümünde 5 000 koltuk için kritik. |
| Viewport culling | Sadece görünür koltukları render et (intersection-based; offscreen koltuklar `<g style="display:none">`). |
| Render perf | `<svg>` → büyük section’larda Canvas2D fallback. `useDeferredValue` ile pan throttle. |
| Mini-map | Sağ-alt 100×80, viewport rect overlay. |

### M2 — Akıllı seçim
| Özellik | Notlar |
|---|---|
| Best available | `bestAvailable(count, criteria)` — yan yana N koltuk; "center bias" parametresi. UI: "Quickly find 4 seats together" CTA. |
| Drag rectangle multi-select | Shift+drag → dikdörtgen içindekiler toggle. |
| Bulk shift-click | Aynı sıra üzerinde shift+click iki koltuk arası tüm seçim. |
| Auto-deselect on max | `maxSelectable` aşılınca en eski seçimi düşür veya block + toast. |
| Adjacency hint | Tek koltuk seçince yanındakileri ışıkla. |

### M3 — Fiyat + filtre + bilgi
| Özellik | Notlar |
|---|---|
| Fiyat filtresi | Slider min-max; eşik dışı koltuklar `opacity-30`. |
| Pricing tier toggle’ları | Her tier’ı aç/kapa (renk lejantı kontrol). |
| Heatmap mode | Fiyat → ısı renk; popülerlik (`soldRatio`) → ısı renk. Toggle. |
| Hover tooltip | Floating panel: Section, Row, Seat, Price, Restrictions (obstructed view, accessible). |
| View from seat | `seat.viewImageUrl?: string` — tooltip’te küçük thumbnail, click → büyüt. |
| Wheelchair / companion filtresi | Toggle, simgesi koltuk üzerinde ikon. |
| Best-value (Deal Score) | Opsiyonel `dealScore` field — yıldız ikonu. |

### M4 — Deep link + persist + senkron
| Özellik | Notlar |
|---|---|
| URL state | `?section=A&seats=A12,A13,A14` — replaceState ile çubuksuz, paylaşılabilir. |
| `onSelectionChange` event | Mevcut callback yeterli; yeni `onShareableUrl?: (url) => void`. |
| Reservation timer | Seçim → 10 dk geri sayım rozeti; dolunca otomatik temizle. |
| Realtime updates | `onSeatStatusUpdate?: (seatId, newStatus)` event listener prop — başkası aynı koltuğu alırsa anlık güncelle. |
| Optimistic select | API onayı beklenirken seçim "pending" durumunda (yarı saydam halka). |

### M5 — A11y + i18n + mobil cilası
| Özellik | Notlar |
|---|---|
| Klavye nav | Tab → ilk koltuk; arrow → grid içinde komşu; Enter/Space → toggle; Esc → section’dan çık. |
| Screen reader | "Row B Seat 14, available, $120, selected". |
| Renk körü güvenli paleti | Status renkleri + ikon shape (circle/square/triangle) ikincil sinyali. |
| Reduced motion | Hover ölçek değişimi kapalı. |
| i18n | `messages` prop — section, row, seat, available, selected, sold, reserved, accessible. |
| Mobil FAB | Section detail’de "Back to map" floating button. |
| Bottom sheet özet | Mobilde alt-yapışkan panel: 3/4 seçildi, $360 toplam, "Continue". |

### M6 — Premium: 3D + reklamlar + kalabalık planı
| Özellik | Notlar |
|---|---|
| 3D venue preview (opsiyonel) | `three.js` + low-poly model; "View in 3D" toggle. |
| Section thumbnail | Hover → mini render. |
| Stage/saha varyasyonları | Konser / spor / tiyatro preset’leri (orientation, label). |
| Crowd estimate | "85% sold" rozeti per-section. |
| Ad / sponsor zonları | Map shape `kind: 'ad' | 'sponsor'` — bilgi amaçlı. |

## Public API delta
```ts
type SeatMapPickerProps = {
  sections: SectionNode[];
  selectedSeatIds: string[];
  onSeatToggle: (seatId: string) => void;
  maxSelectable?: number;

  // M1
  zoom?: { min: number; max: number; initial: number };
  canvasFallback?: 'auto' | 'svg' | 'canvas';
  // M2
  onBestAvailable?: (criteria: BestAvailableCriteria) => void;
  selectionMode?: 'single' | 'multi' | 'rect';
  // M3
  priceFilter?: { min: number; max: number };
  heatmap?: 'price' | 'demand' | 'none';
  showViewFromSeat?: boolean;
  accessibilityFilter?: ('wheelchair' | 'companion')[];
  // M4
  syncUrl?: boolean;
  reservation?: { holdMinutes: number; onExpire?: () => void };
  onSeatStatusUpdate?: (seatId: string, status: SeatStatus) => void;
  // M5
  messages?: Partial<SeatMapPickerMessages>;
  reducedMotion?: boolean;
  // M6
  threeD?: { modelUrl: string };
};
```

## A11y kabul kriterleri (M5 sonu)
- [ ] axe-core 0 violations.
- [ ] Klavye-only ile 4 koltuk seçilebilmeli ve "Continue"’a ulaşılmalı.
- [ ] VoiceOver: koltuk row/seat/price/status anonsu.
- [ ] Hover tooltip içeriği focus geldiğinde de erişilebilir.

## Performans bütçesi
| Metrik | Hedef |
|---|---|
| Ana yol JS (gzip) | ≤ 30 kB |
| 5 000 koltuklu section ilk render | ≤ 800 ms |
| Pan/zoom FPS | ≥ 55 (desktop), ≥ 50 (mobil) |
| Selection toggle | ≤ 8 ms |
| Memory (5 000 koltuk) | ≤ 60 MB browser tab |

## Telemetri şeması
```ts
type SeatMapTelemetry =
  | { type: 'view-section'; id: string }
  | { type: 'seat-select'; id: string; price?: number }
  | { type: 'seat-deselect'; id: string }
  | { type: 'best-available'; count: number; foundAdjacent: boolean }
  | { type: 'filter'; kind: 'price' | 'accessibility' | 'tier'; value: unknown }
  | { type: 'reservation-expire' }
  | { type: 'view-from-seat'; id: string }
  | { type: 'continue-clicked'; count: number; total: number };
```

## EJS paritesi
Şu an için **kapsam dışı**. EJS Event modülü eklenirse: venue map markup’ı server-render olabilir; pan/zoom/select state’i `<script>` IIFE’ye taşınır (DOM data attribute’ları). Best-available algoritması paylaşılabilir saf JS modülü olarak `public/assets/js/seat-map/best-available.js` altında her iki repo tarafından kullanılabilir.

## Definition of Done (milestone başına)
- [ ] Showcase Event Seat Map variant’ları yeni özelliği gösteriyor.
- [ ] `/theme/event/events/[slug]/checkout/page.tsx` manuel senaryo yeşil.
- [ ] `npm run registry:snapshot` + `npm run build` temiz.
- [ ] A11y + perf + i18n + telemetri kabul kriterleri yeşil.
- [ ] CHANGELOG.md — `## [SeatMapPicker Mx]`.
