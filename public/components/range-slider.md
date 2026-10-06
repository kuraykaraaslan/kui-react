# RangeSlider

- **id:** `range-slider`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/RangeSlider.tsx`
- **status:** stable
- **since:** 2026-09

Numeric range input built on native `<input type="range">`. Single-handle by default, or `range` for a dual-handle min/max selector. Distinct from the `Slider` carousel component.

## Used by

- `control-tile`

## Variants

### Single value

```tsx
const [v, setV] = useState(65);
<RangeSlider label="Volume" value={v} onChange={setV} min={0} max={100} />
```

### Dual-handle range

```tsx
const [range, setRange] = useState<[number, number]>([20, 80]);
<RangeSlider range label="Price range" value={range} onChange={setRange} min={0} max={100} />
```

### Commit on release (one write per gesture)

```tsx
<RangeSlider label="Fan speed" value={v} onChange={setV} onCommit={(n) => api.setFan(n)} min={0} max={100} step={5} />
```

### Pending (a write is in flight)

```tsx
<RangeSlider label="Fan speed" value={40} onChange={setV} min={0} max={100} step={5} pending />
```

## Full source

```tsx
'use client';
import { RangeSlider } from '@/modules/ui/RangeSlider';

const [v, setV] = useState(65);
<RangeSlider label="Volume" value={v} onChange={setV} />

const [range, setRange] = useState<[number, number]>([20, 80]);
<RangeSlider range label="Price range" value={range} onChange={setRange} min={0} max={100} />
```
