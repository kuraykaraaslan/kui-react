# GaugeChart

- **id:** `gauge-chart`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Chart/charts/GaugeChart.tsx`
- **status:** beta
- **since:** 2026-10

Half-donut gauge (role="meter") with threshold bands, optional needle, three sizes and a stale state for readings that stopped updating. Part of the Chart library (`@/modules/ui/Chart`); the colour comes from semantic tokens through `bands[].tone`.

## Accessibility

- WCAG: AA
- ARIA patterns: meter

role="meter" with aria-valuemin / aria-valuemax / aria-valuenow and an aria-label from `label`.

## Design tokens consumed

- `--success`
- `--warning`
- `--error`
- `--info`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### Threshold bands

```tsx
<GaugeChart value={34} unit="%" label="CPU" bands={bands} />
<GaugeChart value={91} unit="%" label="Disk" bands={bands} />
```

### Needle

```tsx
<GaugeChart value={91} min={0} max={100} unit="%" label="Disk" needle bands={bands} />
```

### Stale reading

```tsx
<GaugeChart value={72} size="sm" label="Stale reading" stale />
```

### Sizes

```tsx
<GaugeChart value={55} unit="%" label="sm" size="sm" bands={bands} />
<GaugeChart value={55} unit="%" label="md" size="md" bands={bands} />
<GaugeChart value={55} unit="%" label="lg" size="lg" bands={bands} />
```

## Full source

```tsx
'use client';
import { GaugeChart } from '@/modules/ui/Chart';

<GaugeChart value={34} unit="%" label="CPU"
  bands={[{ to: 60, tone: 'success' }, { to: 85, tone: 'warning' }, { to: 100, tone: 'error' }]} />
```
