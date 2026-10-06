# TimeSeriesChart

- **id:** `time-series-chart`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Chart/charts/TimeSeriesChart.tsx`
- **status:** beta
- **since:** 2026-10

The continuous time axis behind `LineChart` / `AreaChart` with `xAxis="time"`: timestamps (ISO strings or epoch ms) in `x`, uneven sampling, series with different instants on one axis, and drag-to-zoom (double-click or "Reset zoom" to leave). Zoom is local to the chart and never reaches the caller.

## Accessibility

- WCAG: AA
- ARIA patterns: img

role="img" with an aria-label; the tooltip and crosshair follow the nearest sample.

## Design tokens consumed

- `--primary`
- `--secondary`
- `--border`
- `--text-secondary`
- `--surface-raised`

## Variants

### Line with drag-to-zoom

```tsx
<LineChart series={series} xAxis="time" height={240} yFormat={(v) => v + '°C'} />
```

### Area, series sampled at different instants

```tsx
<AreaChart series={[inlet, outlet]} xAxis="time" height={240} />
```

### Zoom disabled

```tsx
<LineChart series={series} xAxis="time" zoom={false} />
```

## Full source

```tsx
'use client';
import { LineChart, AreaChart } from '@/modules/ui/Chart';

<LineChart series={series} xAxis="time" yFormat={(v) => v + '°C'} />
<AreaChart series={series} xAxis="time" />
```
