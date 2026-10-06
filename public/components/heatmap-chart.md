# HeatmapChart

- **id:** `heatmap-chart`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Chart/charts/HeatmapChart.tsx`
- **status:** beta
- **since:** 2026-10

Matrix of cells coloured on one token scale. A missing value (`null`) renders as an empty cell, never as 0, so gaps in the data stay visible. Hover shows the value; the scale can be fixed with `min` / `max`.

## Accessibility

- WCAG: AA
- ARIA patterns: img

role="img" with an aria-label; the hover tooltip repeats the cell value as text.

## Design tokens consumed

- `--primary`
- `--surface-sunken`
- `--border`
- `--text-secondary`

## Variants

### Missing data is empty, not zero

```tsx
<HeatmapChart cells={cells} height={220} valueLabel="Messages" />
```

### Fixed scale and value format

```tsx
<HeatmapChart cells={cells} min={0} max={100} valueLabel="Humidity" valueFormat={(v) => v + '%'} />
```

## Full source

```tsx
'use client';
import { HeatmapChart } from '@/modules/ui/Chart';

<HeatmapChart cells={[{ x: '08', y: 'Mon', value: 42 }, { x: '09', y: 'Mon', value: null }]} valueLabel="Messages" />
```
