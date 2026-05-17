# SeatMapPicker

- **id:** `seat-map-picker`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/SeatMapPicker.tsx`
- **status:** beta
- **since:** 2025-04

Görsel koltuk seçim haritası: section/subsection sekme desteği, sıra-koltuk grid, renk kodlu durum, erişilebilirlik göstergesi.

## Variants

### Section + subsection + koltuk seçimi

```tsx
const sections = buildSectionTree(allSections, seatInfos, pricings);

<SeatMapPicker
  sections={sections}
  selectedSeatIds={selected}
  onSeatToggle={(id) => toggleSeat(id)}
  maxSelectable={4}
  showStage
/>
```

### SVG Salon Haritası — tıkla → koltuk seç

```tsx
import type { SectionMapShape } from '@/modules/domains/event/SeatMapPicker';

const mapShapes: SectionMapShape[] = [
  { sectionId: 'parket',     points: '170,93 510,93 558,290 122,290',                labelX: 340, labelY: 185 },
  { sectionId: 'sol-yan',   points: '32,93 170,93 122,290 18,248',                  labelX: 95,  labelY: 185 },
  { sectionId: 'sag-yan',   points: '510,93 648,93 662,248 558,290',                labelX: 585, labelY: 185 },
  { sectionId: 'ust-balkon', points: '18,248 122,290 558,290 662,248 674,438 6,438', labelX: 340, labelY: 360 },
];

<SeatMapPicker
  sections={sections}
  selectedSeatIds={selected}
  onSeatToggle={(id) => toggleSeat(id)}
  maxSelectable={6}
  mapShapes={mapShapes}
  mapViewBox="0 0 680 460"
  stagePoints="225,18 455,18 455,88 225,88"
  stageLabel="SAHNE"
  stageLabelX={340}
  stageLabelY={53}
/>
```

## Full source

```tsx
import { SeatMapPicker, buildSectionTree } from '@/modules/domains/event/SeatMapPicker';

// Flat veriden ağaç oluştur
const sections = buildSectionTree(allSections, seatInfos, pricings);

<SeatMapPicker
  sections={sections}
  selectedSeatIds={selected}
  onSeatToggle={(id) => toggleSeat(id)}
  maxSelectable={4}
  showStage
/>
```
