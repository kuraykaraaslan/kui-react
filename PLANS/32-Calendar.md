# Calendar / Scheduler — Yeni Bileşen Planı (EJS Pariteli)

> Mevcut **yok** — her iki repoda yeni bileşen.

## Kuzey Yıldızı
FullCalendar + Google Calendar + Outlook + Cron seviyesi: month/week/day/agenda view, drag-to-create, drag-to-move, recurring events (RRULE), resource view, accessible.

---

## Hedef yapı
```
modules/app/Calendar/
├── index.tsx              ← named exports: Calendar, CalendarProvider
├── types.ts               ← Event, EventRecurrence, View, Resource
├── views/
│   ├── MonthView.tsx
│   ├── WeekView.tsx
│   ├── DayView.tsx
│   ├── AgendaView.tsx
│   └── ResourceView.tsx
├── parts/
│   ├── EventCard.tsx      ← drag handle, resize handle, label
│   ├── EventPopover.tsx   ← hover/click details
│   ├── TimeGrid.tsx       ← week/day time slots
│   ├── HeaderBar.tsx      ← today / prev / next / view switcher
│   └── MiniCalendar.tsx   ← sidebar
├── hooks/
│   ├── useDragCreate.ts   ← drag empty area → new event
│   ├── useDragMove.ts     ← move event between cells
│   ├── useResize.ts       ← resize event by edge
│   ├── useRecurrence.ts   ← RRULE expansion (rrule.js)
│   └── useKeyboardNav.ts  ← arrow / Page / J/K
└── locale/                ← lazy locale (TR/EN/AR/...)
```

### EJS paralel
- Calendar.ejs root + partials (_month/_week/_day/_agenda/_event-card/_event-popover/_header).
- Scripts: drag-create.js, drag-move.js, resize.js, rrule.js, keyboard.js.

---

## Milestone'lar

### M1 — Month / week / day görünümleri
- View switcher + URL state.
- Today / prev / next nav (klavye + butonlar).
- Event render: title, time, color, icon.
- All-day vs timed events.

### M2 — Drag & drop
- Drag empty cell → yeni event (start/end live preview).
- Drag event → cell taşı.
- Edge drag → resize.
- Snap to interval (5/15/30/60 dk).

### M3 — Recurring events (RRULE)
- `rrule.js` lazy import.
- "Repeat" UI: daily/weekly/monthly/yearly + custom (BYDAY, BYMONTHDAY).
- "End by date / after N occurrences / never".
- Override per-occurrence (single düzenle vs tüm seriyi düzenle).

### M4 — Resource / multi-calendar
- `resources: Resource[]` — kolon başına resource (oda, kişi).
- Multi-calendar overlay (her takvim farklı renk).
- Calendar toggle (sidebar).
- Conflict detection (overlap warning).

### M5 — Agenda + mini + search
- Agenda list view (scrollable timeline).
- Mini calendar (sidebar, click → main view jump).
- Event search (title + description, ile başlar).
- Filters (calendar, attendees, tags).

### M6 — A11y + i18n + perf
- WAI-ARIA Grid + listbox events.
- Klavye nav: arrow, Page Up/Down, Home/End, Enter → event details.
- Screen reader: "Tuesday March 5, 2 events".
- `messages` prop (TR/EN/AR).
- Timezone support.
- Virtualization: 10 000 event @ agenda view.

---

## Public API
```ts
type CalendarProps = {
  events: Event[];
  view?: 'month' | 'week' | 'day' | 'agenda' | 'resource';
  defaultDate?: Date;
  onViewChange?: (v: View) => void;
  onEventCreate?: (start: Date, end: Date) => Promise<Event>;
  onEventUpdate?: (e: Event) => Promise<void>;
  onEventDelete?: (id: string) => Promise<void>;
  resources?: Resource[];
  calendars?: { id: string; name: string; color: string }[];
  recurrence?: boolean;
  timezone?: string;
  workingHours?: { start: number; end: number; days: number[] };
  slotMinutes?: 5 | 15 | 30 | 60;
  locale?: string;
  messages?: Partial<CalendarMessages>;
  reducedMotion?: boolean;
  onTelemetry?: (e: CalendarTelemetry) => void;
};
```

## Perf
- Core ≤ 25 kB.
- rrule.js lazy +20 kB.
- 60 fps drag / resize.

## DoD
- [ ] NextJS + EJS yeni dosyalar oluşturuldu.
- [ ] axe-core 0 violations.
- [ ] Showcase: tüm view'lar + recurring + resource variant'ları.
- [ ] Registry snapshot temiz.
