# Gantt

- **id:** `gantt`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/Gantt/index.tsx`
- **status:** beta
- **since:** 2026-05

MS Project / GanttPRO / dhtmlxGantt-style project timeline. M1 ships the scale switcher (day / week / month / quarter / year), a vertical Today line, WBS tree with expand/collapse on the left panel, sticky timeline header with synchronised horizontal + vertical scroll, and absolutely-positioned task bars with a %-progress fill (bg-primary over bg-primary-subtle). Public props for `dependencies`, `baselines`, `criticalPath`, `workingDays`, `holidays`, `onTaskUpdate`, `onDependencyCreate/Delete`, `exportFormats`, `messages`, and `reducedMotion` are accepted but not yet visually wired — they become live in M2 (drag-to-schedule + dependency drawing), M3 (CPM critical-path highlight + hover tooltip), M4 (milestones + baselines + group rollup), M5 (resource leveling + export PNG/PDF/CSV + working-day calendar), and M6 (full keyboard nav + screen-reader announcements + locale). Pixel-identical EJS sibling at modules/app/Gantt/Gantt.ejs.

## Depends on

- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: grid, row, columnheader, gridcell, tablist, tab
- Keyboard:
  - `Tab` — Move focus across scale tabs and collapse buttons
  - `Space / Enter` — Activate scale tab or expand/collapse a WBS group

Root carries role="grid" with aria-rowcount + aria-colcount; the timeline header row is role="row" with aria-rowindex="1" and each cell is role="columnheader" with aria-colindex. Task bars are role="gridcell" labelled with the task name, dates, and % complete. Scale switcher is a role="tablist"/role="tab" pair so screen readers announce the active scale.

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

## Full source

```tsx
import { Gantt, type Task } from '@/modules/app/Gantt';

const tasks: Task[] = [
  { id: 'g1', name: 'Design phase',     isGroup: true, start: new Date('2026-05-01'), end: new Date('2026-05-15'), progress: 70 },
  { id: 't1', name: 'Wireframes',       parentId: 'g1', start: new Date('2026-05-01'), end: new Date('2026-05-08'), progress: 100 },
  { id: 't2', name: 'Visual design',    parentId: 'g1', start: new Date('2026-05-08'), end: new Date('2026-05-15'), progress: 80 },
  { id: 'm1', name: 'Launch',           start: new Date('2026-06-01'), end: new Date('2026-06-01'), isMilestone: true },
];

<Gantt
  tasks={tasks}
  scale="week"
  ariaLabel="Q2 release plan"
  // M2 (stubs accepted, not yet visualised):
  // dependencies={[{ id: 'd1', from: 't1', to: 't2', type: 'FS' }]}
  // M3:
  // criticalPath
  // M4:
  // baselines={[{ taskId: 't1', start: ..., end: ... }]}
  // M5:
  // workingDays={[1,2,3,4,5]} holidays={[new Date('2026-05-05')]}
  // exportFormats={['png','csv']}
  // M2 callbacks:
  // onTaskUpdate={async (t) => fetch('/api/tasks/' + t.id, { method: 'PATCH', body: JSON.stringify(t) })}
/>
```
