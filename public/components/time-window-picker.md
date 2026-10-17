# TimeWindowPicker

- **id:** `time-window-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/TimeWindowPicker.tsx`
- **status:** stable
- **since:** 2026-10

Relative presets ("1h", "7d"), an optional custom "last N minutes / hours / days", calendar periods ("today", "previous month", optionally "so far"), an absolute UTC range, and the interval / aggregation / time zone that go with a window. Controlled: the value is a structural `TimeWindowValue`, nothing here knows about dashboards. Every label, period names included, is overridable through `messages`.

## Accessibility

- WCAG: AA
- ARIA patterns: radiogroup, group

Presets, Last, Calendar and Custom form one radiogroup; the inputs, the period select, the so-far checkbox (disabled for a past period) and the selects carry accessible names from `messages`.

## Design tokens consumed

- `--primary`
- `--border`
- `--surface-base`
- `--surface-sunken`
- `--text-secondary`
- `--border-focus`

## Variants

### Default

```tsx
<TimeWindowPicker value={win} onChange={setWin} />
```

### Calendar periods, custom duration and time zone

```tsx
<TimeWindowPicker value={win} onChange={setWin} calendarPeriods={DEFAULT_CALENDAR_PERIODS} allowDuration showTimezone />
```

### Presets only

```tsx
<TimeWindowPicker value={win} onChange={setWin} presets={['1h', '24h', '7d']} allowAbsolute={false} showInterval={false} showAggregation={false} />
```

## Full source

```tsx
'use client';
import { TimeWindowPicker, type TimeWindowValue } from '@/modules/ui/TimeWindowPicker';

const [win, setWin] = useState<TimeWindowValue | null>({ mode: 'relative', last: '24h' });
<TimeWindowPicker value={win} onChange={setWin} />
```
