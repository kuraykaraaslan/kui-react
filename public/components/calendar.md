# Calendar

- **id:** `calendar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/Calendar/index.tsx`
- **status:** beta
- **since:** 2026-05

Month / week / day calendar with view switcher, today/prev/next nav (Page Up/Down + T keyboard), per-event color and icon, all-day bars + timed pills, TR/EN locales, and full interactions — click event for an anchored popover (Edit/Delete), drag a timed event to move, drag the bottom edge to resize, drag an empty range to create. RRULE recurrence, resource/multi-calendar overlay, agenda + mini, and full a11y/i18n/perf polish land in M3-M6.

## Accessibility

- WCAG: AA
- ARIA patterns: Grid (month), Tablist (view switcher), Region (week/day)
- Keyboard:
  - `Page Up` — Previous period (month / week / day)
  - `Page Down` — Next period (month / week / day)
  - `T` — Jump to today
  - `Tab` — Focus the next interactive element (events, nav buttons)

Month view uses role="grid" with role="gridcell" per day. View switcher uses role="tablist". Today cell is marked aria-selected="true". Full WAI-ARIA polish + screen-reader text ("Tuesday March 5, 2 events") arrives in M6.

## Design tokens consumed

- `--primary`
- `--primary-fg`
- `--success`
- `--success-fg`
- `--warning`
- `--error`
- `--info`
- `--secondary`
- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--border`
- `--border-focus`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`

## Variants

### Month view — Türkçe

```tsx
<Calendar
  events={events}
  view="month"
  defaultDate={new Date(2026, 4, 13)}
  onViewChange={setView}
  locale="tr"
/>
```

### Week view — working hours shading

```tsx
<Calendar
  events={events}
  view="week"
  defaultDate={new Date(2026, 4, 13)}
  onViewChange={setView}
  locale="tr"
  workingHours={{ start: 9, end: 18, days: [1,2,3,4,5] }}
/>
```

### Day view — English

```tsx
<Calendar
  events={events}
  view="day"
  defaultDate={new Date(2026, 4, 13)}
  onViewChange={setView}
  locale="en"
  workingHours={{ start: 9, end: 18, days: [1,2,3,4,5] }}
/>
```

### Interactive — drag, resize, popover

```tsx
<Calendar
  events={events}
  view="week"
  defaultDate={new Date(2026, 4, 13)}
  slotMinutes={30}
  workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
  onEventCreate={({ start, end }) =>
    setEvents((prev) => [...prev, { id: `n${Date.now()}`, title: 'New event', start, end }])
  }
  onEventUpdate={(updated) =>
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  }
  onEventDelete={(id) =>
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }
/>
```

## Full source

```tsx
'use client';
import { Calendar } from '@/modules/app/Calendar';
import type { Event, View } from '@/modules/app/Calendar';
import { faVideo } from '@fortawesome/free-solid-svg-icons';

const events: Event[] = [
  {
    id: '1',
    title: 'Design sync',
    start: new Date(2026, 4, 13, 10, 0),
    end:   new Date(2026, 4, 13, 11, 0),
    color: 'primary',
    icon: faVideo,
  },
  {
    id: '2',
    title: 'Birthday — Grace',
    start: new Date(2026, 4, 14, 0, 0),
    end:   new Date(2026, 4, 14, 23, 59),
    allDay: true,
    color: 'warning',
  },
];

<Calendar
  events={events}
  view={view}                    // 'month' | 'week' | 'day' | 'agenda' | 'resource'
  defaultDate={new Date(2026, 4, 13)}
  onViewChange={setView}
  onEventClick={(e) => console.log(e)}
  onEventCreate={({ start, end }) => api.create({ start, end })}
  onEventUpdate={(event) => api.update(event)}
  onEventDelete={(id) => api.remove(id)}
  locale="tr"                    // 'tr' (default) | 'en'
  workingHours={{ start: 9, end: 18, days: [1,2,3,4,5] }}
  slotMinutes={30}
/>
```
