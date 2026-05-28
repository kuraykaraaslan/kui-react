# Gantt

- **id:** `gantt`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/Gantt/index.tsx`
- **status:** beta
- **since:** 2026-05

MS Project / GanttPRO / dhtmlxGantt-style project timeline. M1 ships the scale switcher (day / week / month / quarter / year), a vertical Today line, WBS tree with expand/collapse on the left panel, sticky timeline header with synchronised horizontal + vertical scroll, and absolutely-positioned task bars with a %-progress fill. M2 adds full interactivity: drag a bar to reschedule (snap to day), drag the left/right edges to resize, drag the white progress thumb to change %, and drag from the right-edge blue dot to another bar to draw an FS dependency. Dependencies render as orthogonal SVG arrows with a marker-end arrowhead; click an arrow then press Delete to remove it. M3 adds a Critical Path toggle in the toolbar — tasks on the longest dependency chain switch to var(--error) styling and their connecting arrows turn red, computed by a forward + backward longest-path pass on the dependency DAG. Hovering a bar after a short delay shows a tooltip with name, start/end, duration, owner, % complete, predecessors, and a Critical badge. M4 adds zero-duration milestones rendered as 14×14 diamonds, planned-vs-actual baseline ghost bars beneath the live bars, and weekend + holiday shading on the day + week scales. M5 adds a toolbar Export menu (PNG via SVG `<foreignObject>` round-trip, PDF via the browser print dialog, CSV via a pure-JS Blob download), drag snap that nudges drops forward to the next working day, and a resource-conflict detector that flags over-allocated owners in the WBS panel with a red triangle. M6 closes the loop with grid keyboard navigation (↑↓/Home/End/PageUp/PageDown between rows, +/− zoom, focused bar exposes a focus ring + `aria-activedescendant`), a `locale` prop that drives Intl-based month names and tooltip dates, `prefers-reduced-motion` honouring (plus a `reducedMotion` prop force-on), and automatic row virtualization above ~60 tasks. All mutations are optimistic and roll back automatically if `onTaskUpdate` / `onDependencyCreate` rejects. Internal state is owned by a per-instance Zustand store (`store.ts`).

## Depends on

- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: grid, row, columnheader, gridcell, tablist, tab
- Keyboard:
  - `Tab` — Move focus across scale tabs, collapse buttons, and dependency arrows
  - `Space / Enter` — Activate scale tab or expand/collapse a WBS group
  - `Delete` — Remove the currently selected dependency arrow
  - `Escape` — Cancel an in-flight drag or dependency draw

Root carries role="grid"; the timeline header row is role="row" with each cell role="columnheader". Task bars are role="gridcell" labelled with the task name, dates, and % complete. Resize handles and the progress thumb are <button> elements so they are reachable by assistive tech. Dependency arrows are role="button" with keyboard-activatable selection. Scale switcher is a role="tablist"/role="tab" pair.

## Design tokens consumed

- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`
- `--border`
- `--border-focus`
- `--primary`
- `--primary-subtle`
- `--primary-fg`
- `--warning`
- `--error`
- `--error-subtle`

## Variants

### Week scale (default)

```tsx
<Gantt tasks={tasks} scale="week" ariaLabel="Product launch plan" />
```

### Month scale

```tsx
<Gantt tasks={tasks} scale="month" ariaLabel="Long-range roadmap" />
```

### Collapsed group

```tsx
// Seed any task with `collapsed: true` to hide its children at first paint.
const tasks = base.map((t) => t.id === 'impl' ? { ...t, collapsed: true } : t);
<Gantt tasks={tasks} scale="week" />
```

### Dependencies (FS + SS)

```tsx
const dependencies = [
  { id: 'd-t1-t2', from: 't1', to: 't2', type: 'FS' }, // Finish-to-Start
  { id: 'd-t4-t5', from: 't4', to: 't5', type: 'SS' }, // Start-to-Start
];

<Gantt tasks={tasks} dependencies={dependencies} scale="week" />
```

### Critical path (CPM)

```tsx
// Critical-path highlight uses a forward + backward longest-path pass
// over the dependency DAG. Tasks with zero float switch to error styling
// and their connecting arrows turn red. The toolbar toggle lets users
// switch it on / off; passing the prop sets the initial value.
<Gantt
  tasks={tasks}
  dependencies={dependencies}
  scale="week"
  criticalPath
/>
```

### Milestones + baselines + weekends

```tsx
// Milestones (zero-duration tasks rendered as diamonds), planned-vs-actual
// baseline ghost bars, and weekend / holiday shading on the day + week scales.
const baselines: Baseline[] = [
  { taskId: 't2', start: new Date('2026-05-01'), end: new Date('2026-05-07') },
  { taskId: 't5', start: new Date('2026-05-10'), end: new Date('2026-05-20') },
];

<Gantt
  tasks={tasks}                // include some { isMilestone: true } entries
  dependencies={dependencies}
  baselines={baselines}
  workingDays={[1, 2, 3, 4, 5]} // Mon-Fri; Sat+Sun shaded
  holidays={[new Date('2026-05-05')]}
  scale="week"
/>
```

### Export + resource conflicts + working-day snap

```tsx
// M5 wires three things at once:
//  1. exportFormats opens the toolbar Export menu (PNG / PDF / CSV).
//  2. Tasks sharing an owner that overlap in time get a red ⚠ in the WBS
//     owner column (resource over-allocation).
//  3. workingDays makes drag snap forward to the next working day, so a
//     drop on a weekend lands on Monday.
const tasks: Task[] = [
  { id: 'r1', name: 'Frontend rebuild', start: ..., end: ..., owner: 'Eve M.' },
  { id: 'r2', name: 'Auth migration',   start: ..., end: ..., owner: 'Eve M.' }, // overlaps r1
  { id: 'r3', name: 'Reporting',        start: ..., end: ..., owner: 'Eve M.' }, // overlaps r2
];

<Gantt
  tasks={tasks}
  workingDays={[1, 2, 3, 4, 5]}
  exportFormats={['png', 'pdf', 'csv']}
  scale="week"
/>
```

### Keyboard nav + locale + reduced motion

```tsx
// M6 adds:
//  - Grid keyboard nav from the Gantt root: ↑↓ between rows, Home/End,
//    PageUp/PageDown (5 rows), and +/− to zoom in/out. Focused bar gets a
//    border-focus ring and is announced via aria-activedescendant.
//  - locale prop drives Intl.DateTimeFormat for month names in the header
//    and date formatting in the hover tooltip.
//  - reducedMotion={true} or the OS prefers-reduced-motion media query
//    suppresses every Tailwind transition/animation under the root.
//  - Row virtualization kicks in automatically above ~60 tasks — only the
//    visible ± buffer slice renders, so 1000+ rows stay smooth.
<Gantt
  tasks={tasks}
  dependencies={deps}
  locale="tr-TR"               // Turkish month names / tooltip dates
  reducedMotion                // optional — force motion off
  scale="week"
/>
```

### Interactive (drag + dependencies)

```tsx
const [tasks, setTasks] = useState<Task[]>(initial);
const [deps,  setDeps]  = useState<Dependency[]>([]);

<Gantt
  tasks={tasks}
  dependencies={deps}
  scale="week"
  onTaskUpdate={(t) => setTasks((prev) => prev.map((p) => (p.id === t.id ? t : p)))}
  onDependencyCreate={(d) => setDeps((prev) => [...prev, d])}
  onDependencyDelete={(id) => setDeps((prev) => prev.filter((d) => d.id !== id))}
/>
```

## Full source

```tsx
import { Gantt, type Dependency, type Task } from '@/modules/app/Gantt';
import { useState } from 'react';

export function MyPlan() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', name: 'Wireframes',   start: new Date('2026-05-01'), end: new Date('2026-05-08'), progress: 100 },
    { id: 't2', name: 'Visual design', start: new Date('2026-05-08'), end: new Date('2026-05-15'), progress: 60 },
    { id: 't3', name: 'Launch',       start: new Date('2026-06-01'), end: new Date('2026-06-01'), isMilestone: true },
  ]);
  const [deps, setDeps] = useState<Dependency[]>([
    { id: 'd1', from: 't1', to: 't2', type: 'FS' },
  ]);

  return (
    <Gantt
      tasks={tasks}
      dependencies={deps}
      scale="week"
      ariaLabel="Q2 release plan"
      onTaskUpdate={(t) => setTasks((prev) => prev.map((p) => (p.id === t.id ? t : p)))}
      onDependencyCreate={(d) => setDeps((prev) => [...prev, d])}
      onDependencyDelete={(id) => setDeps((prev) => prev.filter((d) => d.id !== id))}
    />
  );
}
```
