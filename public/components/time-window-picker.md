# TimeWindowPicker

- **id:** `time-window-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/TimeWindowPicker.tsx`
- **status:** stable
- **since:** 2026-10

Relative presets ("1h", "7d"), an absolute UTC range and the interval / aggregation that go with a window. Controlled: the value is a structural `TimeWindowValue`, nothing here knows about dashboards. Every label is overridable through `messages`.

## Accessibility

- WCAG: AA
- ARIA patterns: radiogroup, group

Presets form a radiogroup; the date inputs and the selects carry accessible names from `messages`.

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

### Presets only, custom labels

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
