# DateRangePicker

- **id:** `date-range-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DatePicker/index.tsx`
- **status:** stable
- **since:** 2025-03

Two-month popover for picking a start → end date range. Shares the same Calendar core as DatePicker; locale-aware, fully keyboard navigable, with min/max/disabledDates. Pixel-identical EJS sibling at modules/ui/DatePicker/DateRangePicker.ejs.

## Variants

### Date range

```tsx
function Demo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <DateRangePicker id="dr" label="Date range" value={range} onChange={setRange} />;
}
```

### With value (EN locale)

```tsx
<DateRangePicker id="dr" label="Booking window"
  value={{ start: new Date('2026-06-01'), end: new Date('2026-06-15') }}
  onChange={setRange} locale="en" />
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
import { DateRangePicker } from '@/modules/ui/DateRangePicker';
import type { DateRange } from '@/modules/ui/DatePicker';

const [range, setRange] = useState<DateRange>({ start: null, end: null });
<DateRangePicker
  id="dr"
  label="Date range"
  value={range}
  onChange={setRange}
  locale="en"
/>
```
