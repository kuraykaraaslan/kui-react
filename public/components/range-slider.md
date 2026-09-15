# RangeSlider

- **id:** `range-slider`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/RangeSlider.tsx`
- **status:** stable
- **since:** 2026-09

Numeric range input built on native `<input type="range">`. Single-handle by default, or `range` for a dual-handle min/max selector. Distinct from the `Slider` carousel component.

## Variants

### Single value

```tsx
const [v, setV] = useState(40);
<RangeSlider label="Volume" value={v} onChange={setV} />
```

### Dual handle (range)

```tsx
const [range, setRange] = useState<[number, number]>([20, 70]);
<RangeSlider range label="Price range" value={range} onChange={setRange} min={0} max={100} />
```

## Full source

```tsx
'use client';
import { RangeSlider } from '@/modules/ui/RangeSlider';

const [v, setV] = useState(40);
<RangeSlider label="Volume" value={v} onChange={setV} />

const [range, setRange] = useState<[number, number]>([20, 70]);
<RangeSlider range label="Price range" value={range} onChange={setRange} min={0} max={100} />
```
