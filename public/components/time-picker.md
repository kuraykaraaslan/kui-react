# TimePicker

- **id:** `time-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DateRangePicker.tsx`
- **status:** stable
- **since:** 2026-09

Native `<input type="time">`-based time field with label/hint/error slots, matching the Input/DatePicker pattern. M1 baseline — hour/minute only, no timezone or 12h/24h toggle yet (tracked for the DateTimePicker milestone).

## When NOT to use

For combined date + time selection, wait for the upcoming DateTimePicker (composes DatePicker + TimePicker) rather than pairing these two manually.

## Variants

### Default

```tsx
const [time, setTime] = useState('09:00');
<TimePicker id="meeting" label="Meeting time" value={time} onChange={setTime} hint="24-hour format" />
```

### Required / error

```tsx
<TimePicker id="pickup" label="Pickup time" required error="Pickup time is required." value={time} onChange={setTime} />
```

## Full source

```tsx
'use client';
import { TimePicker } from '@/modules/ui/DateRangePicker';

const [time, setTime] = useState('09:00');
<TimePicker id="meeting" label="Meeting time" value={time} onChange={setTime} hint="24-hour format" />
```
