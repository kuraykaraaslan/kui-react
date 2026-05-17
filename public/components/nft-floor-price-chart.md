# FloorPriceChart

- **id:** `nft-floor-price-chart`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/collection/FloorPriceChart.tsx`
- **status:** stable
- **since:** 2026-05

Time-series chart of collection floor price over a configurable window.

## Variants

### 14-day window

```tsx
<FloorPriceChart points={floorHistory} height={200} />
```

## Full source

```tsx
'use client';

export function FloorPriceChart({ points, height = 220 }) {
  // SVG line + area chart with auto grid
}
```
