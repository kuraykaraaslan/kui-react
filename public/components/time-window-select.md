# TimeWindowSelect

- **id:** `time-window-select`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/TimeWindowSelect.tsx`
- **status:** stable
- **since:** 2026-10

A time window behind one button, the dashboard way: the button names the window and opens a panel with Realtime (last N sliding, or the current calendar period, optionally so far) and History (last N anchored when applied, a fixed range typed in the window's zone, or a past period). Aggregation, grouping interval with a bucket estimate, and time zone apply to both. Edits are a draft until Update. Same `TimeWindowValue` as TimeWindowPicker.

## Accessibility

- WCAG: AA
- ARIA patterns: dialog, tablist, radiogroup, status

The trigger has aria-haspopup="dialog" and aria-expanded; Realtime / History are tabs (arrow keys); every input has an accessible name from `messages`; the bucket estimate is a status; Escape and Cancel discard the draft.

## Design tokens consumed

- `--primary`
- `--primary-fg`
- `--border`
- `--surface-base`
- `--surface-sunken`
- `--surface-raised`
- `--text-secondary`
- `--border-focus`
- `--warning`

## Variants

### Default

```tsx
<TimeWindowSelect value={win} onChange={setWin} />
```

### History range in a chosen zone, no period options

```tsx
<TimeWindowSelect value={{ mode: 'absolute', from, to, timezone: 'Europe/Istanbul' }} onChange={setWin} calendarPeriods={[]} />
```

## Full source

```tsx
'use client';
import { TimeWindowSelect } from '@/modules/ui/TimeWindowSelect';
import type { TimeWindowValue } from '@/modules/ui/TimeWindowPicker';

const [win, setWin] = useState<TimeWindowValue | null>({ mode: 'relative', last: '24h' });
<TimeWindowSelect value={win} onChange={setWin} />
```
