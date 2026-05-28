'use client';
import { useState } from 'react';
import { Calendar, MiniCalendar } from '@/modules/app/Calendar';
import type { CalendarSource, Event, Resource, View } from '@/modules/app/Calendar';
import {
  faVideo,
  faMugHot,
  faCake,
  faPlaneDeparture,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import type { ShowcaseComponent } from '../showcase.types';

/** Anchor demos to a stable date so the grid layout is deterministic. */
const DEMO_ANCHOR = new Date(2026, 4, 13); // 13 May 2026 (Wed)

function makeEvents(): Event[] {
  const y = 2026, m = 4; // May (0-indexed)
  return [
    {
      id: 'e1',
      title: 'Design sync',
      start: new Date(y, m, 11, 10, 0),
      end: new Date(y, m, 11, 11, 0),
      color: 'primary',
      icon: faVideo,
    },
    {
      id: 'e2',
      title: 'Coffee with Ada',
      start: new Date(y, m, 12, 9, 0),
      end: new Date(y, m, 12, 9, 30),
      color: 'success',
      icon: faMugHot,
    },
    {
      id: 'e3',
      title: 'Roadmap review',
      start: new Date(y, m, 13, 13, 30),
      end: new Date(y, m, 13, 15, 0),
      color: 'info',
    },
    {
      id: 'e4',
      title: 'Birthday — Grace',
      start: new Date(y, m, 14, 0, 0),
      end: new Date(y, m, 14, 23, 59),
      allDay: true,
      color: 'warning',
      icon: faCake,
    },
    {
      id: 'e5',
      title: 'Flight to LHR',
      start: new Date(y, m, 15, 18, 0),
      end: new Date(y, m, 15, 21, 30),
      color: 'secondary',
      icon: faPlaneDeparture,
    },
    {
      id: 'e6',
      title: 'Workshop',
      start: new Date(y, m, 13, 16, 0),
      end: new Date(y, m, 13, 17, 30),
      color: 'error',
      icon: faGraduationCap,
    },
    {
      id: 'e7',
      title: 'Standup',
      start: new Date(y, m, 13, 9, 30),
      end: new Date(y, m, 13, 10, 0),
      color: 'primary',
    },
  ];
}

function CalendarMonthDemo() {
  const [view, setView] = useState<View>('month');
  const events = makeEvents();
  return (
    <div className="w-full">
      <Calendar
        events={events}
        view={view}
        defaultDate={DEMO_ANCHOR}
        onViewChange={setView}
        locale="tr"
      />
    </div>
  );
}

function CalendarWeekDemo() {
  const [view, setView] = useState<View>('week');
  const events = makeEvents();
  return (
    <div className="w-full">
      <Calendar
        events={events}
        view={view}
        defaultDate={DEMO_ANCHOR}
        onViewChange={setView}
        locale="tr"
        workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
      />
    </div>
  );
}

function CalendarDayDemo() {
  const [view, setView] = useState<View>('day');
  const events = makeEvents();
  return (
    <div className="w-full">
      <Calendar
        events={events}
        view={view}
        defaultDate={DEMO_ANCHOR}
        onViewChange={setView}
        locale="en"
        workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
      />
    </div>
  );
}

function CalendarRecurringDemo() {
  const [view, setView] = useState<View>('week');
  // One-off events + one recurring weekly standup expanded by the RRULE engine.
  const events: Event[] = [
    {
      id: 'rec-standup',
      title: 'Daily standup',
      start: new Date(2026, 4, 11, 9, 30),
      end: new Date(2026, 4, 11, 9, 45),
      color: 'primary',
      rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=20',
      // Skip the Wednesday — team off-site.
      exceptions: [new Date(2026, 4, 13)],
    },
    {
      id: 'one-off',
      title: 'Roadmap review',
      start: new Date(2026, 4, 13, 14, 0),
      end: new Date(2026, 4, 13, 15, 0),
      color: 'info',
      icon: faVideo,
    },
    {
      id: 'rec-coffee',
      title: 'Coffee with Ada',
      start: new Date(2026, 4, 12, 8, 30),
      end: new Date(2026, 4, 12, 9, 0),
      color: 'success',
      icon: faMugHot,
      rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TU;COUNT=5',
    },
  ];
  return (
    <div className="w-full">
      <Calendar
        events={events}
        view={view}
        defaultDate={DEMO_ANCHOR}
        onViewChange={setView}
        locale="en"
        slotMinutes={15}
        workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
      />
    </div>
  );
}

function CalendarInteractiveDemo() {
  const [view, setView] = useState<View>('week');
  const [events, setEvents] = useState<Event[]>(() => makeEvents());
  const [log, setLog] = useState<string[]>([]);
  const append = (msg: string) =>
    setLog((prev) => [`${new Date().toLocaleTimeString()}  ${msg}`, ...prev].slice(0, 6));

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-3 items-start">
      <Calendar
        events={events}
        view={view}
        defaultDate={DEMO_ANCHOR}
        onViewChange={setView}
        locale="en"
        slotMinutes={30}
        workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
        onEventCreate={({ start, end }) => {
          const ev: Event = {
            id: `n${Date.now()}`,
            title: 'New event',
            start,
            end,
            color: 'info',
          };
          setEvents((prev) => [...prev, ev]);
          append(`create  ${ev.title}  ${start.toLocaleTimeString()} – ${end.toLocaleTimeString()}`);
        }}
        onEventUpdate={(updated) => {
          setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
          append(`update  ${updated.title}  → ${updated.start.toLocaleTimeString()}`);
        }}
        onEventDelete={(id) => {
          setEvents((prev) => prev.filter((e) => e.id !== id));
          append(`delete  ${id}`);
        }}
      />
      <aside className="rounded-md border border-border bg-surface-raised p-3 text-xs flex flex-col gap-1.5">
        <h4 className="font-semibold text-text-primary">Event log</h4>
        <p className="text-text-secondary">
          Click an event for the popover. Drag to move, grab the bottom edge to resize, drag an
          empty slot to create.
        </p>
        <div className="border-t border-border my-1" />
        {log.length === 0 ? (
          <span className="text-text-disabled italic">no events yet…</span>
        ) : (
          log.map((line, i) => (
            <code key={i} className="text-[11px] font-mono text-text-secondary truncate">
              {line}
            </code>
          ))
        )}
      </aside>
    </div>
  );
}

const RESOURCE_ANCHOR = new Date(2026, 4, 13);
const RESOURCES: Resource[] = [
  { id: 'room-a', name: 'Studio A', color: 'primary' },
  { id: 'room-b', name: 'Studio B', color: 'success' },
  { id: 'room-c', name: 'Boardroom', color: 'warning' },
];

function CalendarResourceDemo() {
  const events: Event[] = [
    { id: 'r1', title: 'Sprint planning',
      start: new Date(2026, 4, 13, 9, 0), end: new Date(2026, 4, 13, 11, 0),
      resourceId: 'room-a', color: 'primary' },
    { id: 'r2', title: 'Design crit',
      start: new Date(2026, 4, 13, 10, 30), end: new Date(2026, 4, 13, 12, 0),
      resourceId: 'room-a', color: 'primary' }, // conflicts with r1 → ring-error
    { id: 'r3', title: 'Client demo',
      start: new Date(2026, 4, 13, 13, 0), end: new Date(2026, 4, 13, 14, 0),
      resourceId: 'room-b', color: 'success', icon: faVideo },
    { id: 'r4', title: 'Budget review',
      start: new Date(2026, 4, 13, 15, 0), end: new Date(2026, 4, 13, 16, 30),
      resourceId: 'room-c', color: 'warning' },
    { id: 'r5', title: 'Coffee chat',
      start: new Date(2026, 4, 13, 9, 30), end: new Date(2026, 4, 13, 10, 0),
      resourceId: 'room-b', icon: faMugHot, color: 'success' },
  ];
  return (
    <div className="w-full">
      <Calendar
        events={events}
        view="resource"
        defaultDate={RESOURCE_ANCHOR}
        resources={RESOURCES}
        locale="en"
        slotMinutes={15}
        workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
      />
    </div>
  );
}

const CALENDARS: CalendarSource[] = [
  { id: 'work',     name: 'Work',     color: 'primary' },
  { id: 'personal', name: 'Personal', color: 'success' },
  { id: 'family',   name: 'Family',   color: 'warning' },
];

function CalendarMultiSourceDemo() {
  const [view, setView] = useState<View>('week');
  const events: Event[] = [
    { id: 'm1', title: 'Design sync',
      start: new Date(2026, 4, 11, 10, 0), end: new Date(2026, 4, 11, 11, 0),
      calendarId: 'work', icon: faVideo },
    { id: 'm2', title: 'Standup',
      start: new Date(2026, 4, 12, 9, 30), end: new Date(2026, 4, 12, 10, 0),
      calendarId: 'work' },
    { id: 'm3', title: 'Yoga',
      start: new Date(2026, 4, 12, 18, 30), end: new Date(2026, 4, 12, 19, 30),
      calendarId: 'personal' },
    { id: 'm4', title: 'Dinner — parents',
      start: new Date(2026, 4, 14, 19, 0), end: new Date(2026, 4, 14, 21, 0),
      calendarId: 'family', icon: faMugHot },
    { id: 'm5', title: 'Doctor',
      start: new Date(2026, 4, 13, 14, 0), end: new Date(2026, 4, 13, 15, 0),
      calendarId: 'personal' },
  ];
  return (
    <div className="w-full">
      <Calendar
        events={events}
        view={view}
        defaultDate={DEMO_ANCHOR}
        onViewChange={setView}
        calendars={CALENDARS}
        locale="en"
        slotMinutes={30}
        workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
      />
    </div>
  );
}

function CalendarAgendaDemo() {
  const [view, setView] = useState<View>('agenda');
  return (
    <div className="w-full">
      <Calendar
        events={makeEvents()}
        view={view}
        defaultDate={DEMO_ANCHOR}
        onViewChange={setView}
        locale="en"
      />
    </div>
  );
}

function CalendarMiniSidebarDemo() {
  const [date, setDate] = useState<Date>(DEMO_ANCHOR);
  const [view, setView] = useState<View>('week');
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[15rem_1fr] gap-3 items-start">
      <MiniCalendar value={date} onChange={(d) => { setDate(d); setView('day'); }} locale="en" />
      <Calendar
        events={makeEvents()}
        view={view}
        defaultDate={date}
        onViewChange={setView}
        onDateChange={setDate}
        locale="en"
        workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
      />
    </div>
  );
}

export function buildAppCalendarData(): ShowcaseComponent[] {
  return [
    {
      id: 'calendar',
      title: 'Calendar',
      category: 'App',
      abbr: 'Cl',
      description:
        'Month / week / day / agenda / resource calendar with view switcher, today/prev/next nav (Page Up/Down + T keyboard), per-event color and icon, all-day bars + timed pills, TR/EN locales, full interactions (anchored popover, drag-move, edge-resize, drag-create), in-house RRULE expansion (FREQ/INTERVAL/COUNT/UNTIL/BYDAY + exceptions), multi-calendar overlay with per-calendar visibility legend, ResourceView lanes with O(n²) conflict highlighting, agenda list (search + date grouping) and a composable MiniCalendar sidebar. Full a11y / i18n / perf polish + IANA timezone land in M6.',
      filePath: 'modules/app/Calendar/index.tsx',
      since: '2026-05',
      status: 'beta',
      sourceCode: `'use client';
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
/>`,
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['Grid (month)', 'Tablist (view switcher)', 'Region (week/day)'],
        keyboardInteractions: [
          { keys: 'Page Up', action: 'Previous period (month / week / day)' },
          { keys: 'Page Down', action: 'Next period (month / week / day)' },
          { keys: 'T', action: 'Jump to today' },
          { keys: 'Tab', action: 'Focus the next interactive element (events, nav buttons)' },
        ],
        notes:
          'Month view uses role="grid" with role="gridcell" per day. View switcher uses role="tablist". Today cell is marked aria-selected="true". Full WAI-ARIA polish + screen-reader text ("Tuesday March 5, 2 events") arrives in M6.',
      },
      designTokens: [
        '--primary', '--primary-fg',
        '--success', '--success-fg',
        '--warning', '--error', '--info', '--secondary',
        '--surface-base', '--surface-raised', '--surface-overlay',
        '--border', '--border-focus',
        '--text-primary', '--text-secondary', '--text-disabled',
      ],
      composes: [],
      variants: [
        {
          title: 'Month view — Türkçe',
          layout: 'stack',
          preview: <CalendarMonthDemo />,
          code: `<Calendar
  events={events}
  view="month"
  defaultDate={new Date(2026, 4, 13)}
  onViewChange={setView}
  locale="tr"
/>`,
        },
        {
          title: 'Week view — working hours shading',
          layout: 'stack',
          preview: <CalendarWeekDemo />,
          code: `<Calendar
  events={events}
  view="week"
  defaultDate={new Date(2026, 4, 13)}
  onViewChange={setView}
  locale="tr"
  workingHours={{ start: 9, end: 18, days: [1,2,3,4,5] }}
/>`,
        },
        {
          title: 'Day view — English',
          layout: 'stack',
          preview: <CalendarDayDemo />,
          code: `<Calendar
  events={events}
  view="day"
  defaultDate={new Date(2026, 4, 13)}
  onViewChange={setView}
  locale="en"
  workingHours={{ start: 9, end: 18, days: [1,2,3,4,5] }}
/>`,
        },
        {
          title: 'Recurring — RRULE expansion',
          layout: 'stack',
          preview: <CalendarRecurringDemo />,
          code: `// Lazy in-house RRULE expander — FREQ + INTERVAL + COUNT + UNTIL + BYDAY.
const events: Event[] = [
  {
    id: 'standup',
    title: 'Daily standup',
    start: new Date(2026, 4, 11, 9, 30),
    end:   new Date(2026, 4, 11, 9, 45),
    rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=20',
    exceptions: [new Date(2026, 4, 13)], // skip team off-site
  },
  {
    id: 'coffee',
    title: 'Coffee with Ada',
    start: new Date(2026, 4, 12, 8, 30),
    end:   new Date(2026, 4, 12, 9, 0),
    rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TU;COUNT=5',
  },
];

<Calendar
  events={events}
  view="week"
  defaultDate={new Date(2026, 4, 13)}
  slotMinutes={15}
  workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
/>`,
        },
        {
          title: 'Interactive — drag, resize, popover',
          layout: 'stack',
          preview: <CalendarInteractiveDemo />,
          code: `<Calendar
  events={events}
  view="week"
  defaultDate={new Date(2026, 4, 13)}
  slotMinutes={30}
  workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
  onEventCreate={({ start, end }) =>
    setEvents((prev) => [...prev, { id: \`n\${Date.now()}\`, title: 'New event', start, end }])
  }
  onEventUpdate={(updated) =>
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  }
  onEventDelete={(id) =>
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }
/>`,
        },
        {
          title: 'Resource view — rooms with conflict highlight',
          layout: 'stack',
          preview: <CalendarResourceDemo />,
          code: `const resources = [
  { id: 'room-a', name: 'Studio A',  color: 'primary' },
  { id: 'room-b', name: 'Studio B',  color: 'success' },
  { id: 'room-c', name: 'Boardroom', color: 'warning' },
];
const events = [
  { id: 'r1', title: 'Sprint planning',
    start: new Date(2026, 4, 13,  9, 0), end: new Date(2026, 4, 13, 11, 0),
    resourceId: 'room-a' },
  { id: 'r2', title: 'Design crit',  // overlaps r1 → ring-error
    start: new Date(2026, 4, 13, 10, 30), end: new Date(2026, 4, 13, 12, 0),
    resourceId: 'room-a' },
  // …
];

<Calendar
  events={events}
  view="resource"
  defaultDate={new Date(2026, 4, 13)}
  resources={resources}
  slotMinutes={15}
  workingHours={{ start: 9, end: 18, days: [1, 2, 3, 4, 5] }}
/>`,
        },
        {
          title: 'Multi-calendar overlay — toggle visibility',
          layout: 'stack',
          preview: <CalendarMultiSourceDemo />,
          code: `const calendars = [
  { id: 'work',     name: 'Work',     color: 'primary' },
  { id: 'personal', name: 'Personal', color: 'success' },
  { id: 'family',   name: 'Family',   color: 'warning' },
];
const events = [
  { id: 'm1', title: 'Design sync',     start: ..., end: ..., calendarId: 'work' },
  { id: 'm2', title: 'Yoga',            start: ..., end: ..., calendarId: 'personal' },
  { id: 'm3', title: 'Dinner — parents', start: ..., end: ..., calendarId: 'family' },
];

<Calendar
  events={events}
  view="week"
  calendars={calendars}
  onCalendarToggle={(id, visible) => console.log(id, visible)}
/>`,
        },
        {
          title: 'Agenda view — date-grouped + search',
          layout: 'stack',
          preview: <CalendarAgendaDemo />,
          code: `<Calendar
  events={events}
  view="agenda"
  defaultDate={new Date(2026, 4, 13)}
  onViewChange={setView}
  locale="en"
/>`,
        },
        {
          title: 'MiniCalendar sidebar — jumps the main view to picked date',
          layout: 'stack',
          preview: <CalendarMiniSidebarDemo />,
          code: `import { Calendar, MiniCalendar } from '@/modules/app/Calendar';

const [date, setDate] = useState(new Date(2026, 4, 13));
const [view, setView] = useState<View>('week');

<div className="grid grid-cols-[15rem_1fr] gap-3">
  <MiniCalendar
    value={date}
    onChange={(d) => { setDate(d); setView('day'); }}
    locale="en"
  />
  <Calendar
    events={events}
    view={view}
    defaultDate={date}
    onViewChange={setView}
    onDateChange={setDate}
  />
</div>`,
        },
      ],
    },
  ];
}
