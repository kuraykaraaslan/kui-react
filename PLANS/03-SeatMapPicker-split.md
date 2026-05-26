# SeatMapPicker — Refactor Planı

## Hedef
`modules/domains/event/SeatMapPicker.tsx` (906 satır) — venue map SVG, section navigation, seat grid, legend, builder fonksiyonu, hover state ve birden çok display helper’ı tek dosyada. Ayrı dosyalara çıkar; public `<SeatMapPicker />` + `buildSectionTree` API’si aynı kalsın.

> EJS karşılığı **yok** — `02_EJS_Components` Event modülü içermiyor. Parite şartı yok.

## Mevcut iskelet (modules/domains/event/SeatMapPicker.tsx)
| Bölge | Satır | İçerik |
|---|---|---|
| Public types | 14–50 | `SeatInfo`, `SectionNode`, `SectionMapShape` |
| Props | 52–78 | `SeatMapPickerProps` |
| Tree builder | 80–117 | `buildSectionTree()` |
| Tree helpers | 119–142 | `countAllSeats`, `countAvailSeats`, `collectSeatIds` |
| Style helpers | 144–191 | `getSectionStyle()` (status → tailwind classları) |
| Row grouping | 193–214 | `groupByRow()` |
| SeatButton | 216–283 | tek koltuk butonu (hover, status, pricing rengi) |
| SeatGrid | 285–341 | satır bazlı seat layout |
| SectionView | 343–428 | leaf vs non-leaf section render |
| Legend | 430–462 | renk lejantı |
| MapHeader | 463–476 | venue map başlığı |
| SectionDetailHeader | 477–528 | seçili section detay başlığı + breadcrumb |
| VenueMapView | 530–749 | büyük SVG venue render (mapShapes + stage + section labels + hover) |
| Main component | 751–906 | state, section navigation, selection logic, render orchestration |

## Hedef yapı
```
modules/domains/event/SeatMapPicker/
├── index.tsx                  ← named export SeatMapPicker (≤200 satır)
├── types.ts                   ← SeatInfo, SectionNode, SectionMapShape, SeatMapPickerProps + re-export { SeatStatus } from '../types'
├── tree.ts                    ← buildSectionTree + countAllSeats + countAvailSeats + collectSeatIds + groupByRow
├── style.ts                   ← getSectionStyle() (status → class haritası)
├── parts/
│   ├── SeatButton.tsx         ← satır 216–283
│   ├── SeatGrid.tsx           ← satır 285–341 (SeatButton’a bağlı)
│   ├── SectionView.tsx        ← satır 343–428 (SeatGrid + SectionDetailHeader’ı çağırır)
│   ├── Legend.tsx             ← satır 430–462
│   ├── MapHeader.tsx          ← satır 463–476
│   └── SectionDetailHeader.tsx ← satır 477–528
├── venue/
│   ├── VenueMapView.tsx       ← satır 530–749 (≈220 satır — kabul edilebilir)
│   ├── SectionShape.tsx       ← tek section’ın polygon/path render’ı (VenueMapView içinden ayıkla)
│   └── StageShape.tsx         ← stage polygon/path + label render’ı (VenueMapView içinden ayıkla)
└── hooks/
    └── useSectionNavigation.ts ← activeSectionIdx + activeSectionId + setActive(...) helper’ları
```

## Adım adım
1. **Klasör + barrel.** `mv modules/domains/event/SeatMapPicker.tsx modules/domains/event/SeatMapPicker/index.tsx`. `modules/domains/event/index.ts` barrel’ında yol değişmiyor, sadece dosyanın klasör halini al — Next.js resolution otomatik çözer.
2. **`types.ts`.** Mevcut `export type` satırları + `SeatStatus` re-export. `modules/domains/event/types.ts`’deki `VenueSection`, `VenueSeat`, `EventSectionPricing`, `SeatStatus` import edilip yeniden export edilmez — sadece local kompozit tipler.
3. **`tree.ts`.** `buildSectionTree` public; `countAllSeats`, `countAvailSeats`, `collectSeatIds`, `groupByRow` internal export (parts/ buradan tüketir).
4. **`style.ts`.** `getSectionStyle` — saf fonksiyon, side effect yok.
5. **`parts/SeatButton.tsx`.** `useState` (`hovered`) içinde. Props: `{ seat, status, pricing, selected, onToggle, disabled }`.
6. **`parts/SeatGrid.tsx`.** `useMemo(() => groupByRow(seats), [seats])`. Props: `{ seats, selectedIds, onSeatToggle, pricingMap }`.
7. **`parts/SectionView.tsx`.** Leaf ↔ non-leaf ayrımı; non-leaf için `useState(activeSubIdx)` burada kalır. Recursive olarak alt SectionView’ı kullanabilir.
8. **`parts/Legend.tsx`, `parts/MapHeader.tsx`, `parts/SectionDetailHeader.tsx`.** Saf presentational.
9. **`venue/VenueMapView.tsx`.** `hoveredId` state + SVG koordinasyonu. İçinden `SectionShape` ve `StageShape`’ı ayıklayarak inner-loop’u sadeleştir.
10. **`venue/SectionShape.tsx`.** Props: `{ shape, section, totalSeats, availSeats, hovered, onHover, onClick }`. Polygon mu path mi seçen tek dosya.
11. **`venue/StageShape.tsx`.** Props: `{ stagePoints?, stagePath?, label, labelX, labelY }`.
12. **`hooks/useSectionNavigation.ts`.** `{ activeSectionIdx, activeSectionId, setActiveBySection, setActiveByIdx, goUp }`. `sections` listesini parametre alır.
13. **`index.tsx`.** Public component: props destructure → `useMemo(selectedIds)` → `useSectionNavigation` → koşullu render: venue map view ↔ section detail. Selection logic (toggle, maxSelectable kontrolü) burada.
14. **Snapshot + smoke.**
    - `npm run registry:snapshot`
    - `/theme/event/events/[slug]/checkout/page.tsx` (358 satır) variant’ında: venue map → section seç → koltuk seç → birden çok seçim → max-selectable limiti → geri navigasyon.
    - Showcase Event Seat Map variant’ı.
15. **Tip kontrolü.** `npx tsc --noEmit`.

## Doğrulama kriterleri
- [ ] `index.tsx` ≤ 200 satır, `venue/VenueMapView.tsx` ≤ 240 satır.
- [ ] Hiçbir parts/ dosyası 130 satırı geçmesin.
- [ ] Public yüzey değişmez: `SeatMapPicker`, `buildSectionTree`, `SeatInfo`, `SectionNode`, `SectionMapShape`, `SeatStatus`. Tüketici `app/theme/event/events/[slug]/checkout/page.tsx` ve showcase entry’si değişmeden çalışsın.
- [ ] `npm run build` + registry snapshot temiz.
- [ ] Showcase Event Seat Map variant’larındaki venue örnekleri (stage shapes, sub-section örnekleri) render edilebilir kalmalı.

## EJS paritesi
Yok. İleride 02_EJS_Components’a Event domain eklenirse — venue SVG, section shapes ve seat grid mantığı sunucu-render edilebilir mi ayrıca değerlendirilmesi gerekir; hover/selection client-state’i `<script>` IIFE’ye taşınması gerekir.
