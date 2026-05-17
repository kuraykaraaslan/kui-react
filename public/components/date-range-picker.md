# DateRangePicker

- **id:** `date-range-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DateRangePicker.tsx`
- **status:** stable
- **since:** 2025-03

Date range picker with start/end fields and end ≥ start validation. Also ships a TimePicker.

## Variants

### Date range

```tsx
function Demo() {
  const [range, setRange] = useState({ start: null, end: null });
  return <DateRangePicker id="dr" label="Date range" value={range} onChange={setRange} />;
}
```

### Time picker

```tsx
function Demo() {
  const [t, setT] = useState('09:00');
  return <TimePicker id="tp" label="Meeting time" value={t} onChange={setT} />;
}
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

export function DateRangePicker({ id, label, value, onChange }) {
  // start/end date inputs, auto-clears end if start > end
}

export function TimePicker({ id, label, value, onChange, step = 60 }) {}
```
