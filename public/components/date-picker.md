# DatePicker

- **id:** `date-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DatePicker/index.tsx`
- **status:** stable
- **since:** 2025-02

Popover-based date picker with a locale-aware calendar grid (TR / EN), quick month / year jump from the header, min / max / disabledDates support, and full keyboard navigation (Arrow / PageUp/Down / Shift+Page / Home / End / Enter / Esc). Pixel-identical EJS sibling at modules/ui/DatePicker/DatePicker.ejs.

## Variants

### Default

```tsx
const [date, setDate] = useState<Date | null>(null);
<DatePicker id="date" label="Appointment date" hint="Select a future date." value={date} onChange={setDate} />
```

### With value

```tsx
<DatePicker id="start" label="Start date" value={new Date('2026-06-15')} onChange={setDate} />
```

### Error / Disabled

```tsx
<DatePicker id="due" label="Due date" error="Please select a date." required />
<DatePicker id="locked" label="Locked date" value={date} disabled />
```

### Locale: Türkçe + custom messages

```tsx
<DatePicker
  locale="tr"
  value={date}
  onChange={setDate}
  messages={{ today: 'Bugün seç', clear: 'Temizle' }}
/>
```

## Full source

```tsx
'use client';
import { DatePicker } from '@/modules/ui/DatePicker';

// Single-date popover — defaults to Turkish locale (Monday-first, GG.AA.YYYY).
const [date, setDate] = useState<Date | null>(null);
<DatePicker
  id="appointment"
  label="Appointment date"
  value={date}
  onChange={setDate}
  hint="Select a future date."
/>

// English locale, min/max constraints + disabledDates predicate.
<DatePicker
  locale="en"
  value={date}
  onChange={setDate}
  min={new Date('2026-06-01')}
  max={new Date('2026-06-30')}
  disabledDates={(d) => d.getDay() === 0 /* no Sundays */}
/>

// Override individual messages.
<DatePicker
  locale="tr"
  value={date}
  onChange={setDate}
  messages={{ today: 'Bugün seç', clear: 'Temizle' }}
/>
```
