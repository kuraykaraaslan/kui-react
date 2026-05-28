'use client';
import { useState } from 'react';
import { Gantt, type Baseline, type Dependency, type Task, type TimeUnit } from '@/modules/app/Gantt';
import type { ShowcaseComponent } from '../showcase.types';

const today = new Date();
const day = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
};

const PROJECT_TASKS: Task[] = [
  { id: 'g1', name: 'Design phase',           isGroup: true, start: day(-14), end: day(7), progress: 70, owner: 'Ada L.' },
  { id: 't1', name: 'Wireframes',             parentId: 'g1', start: day(-14), end: day(-7),  progress: 100, owner: 'Ada L.' },
  { id: 't2', name: 'Visual design',          parentId: 'g1', start: day(-7),  end: day(2),   progress: 80,  owner: 'Jane D.' },
  { id: 't3', name: 'Design review',          parentId: 'g1', start: day(2),   end: day(7),   progress: 20,  owner: 'Team' },
  { id: 'g2', name: 'Implementation',         isGroup: true, start: day(0),  end: day(28), progress: 35,  owner: 'John S.' },
  { id: 't4', name: 'Frontend skeleton',      parentId: 'g2', start: day(0),   end: day(10),  progress: 50,  owner: 'John S.' },
  { id: 't5', name: 'API integration',        parentId: 'g2', start: day(7),   end: day(21),  progress: 25,  owner: 'Mira K.' },
  { id: 't6', name: 'End-to-end tests',       parentId: 'g2', start: day(18),  end: day(28),  progress: 0,   owner: 'QA' },
  { id: 'g3', name: 'Release',                isGroup: true, start: day(28), end: day(35), progress: 0,   owner: 'PM' },
  { id: 't7', name: 'Staging deploy',         parentId: 'g3', start: day(28),  end: day(31),  progress: 0,   owner: 'DevOps' },
  { id: 't8', name: 'Launch',                 parentId: 'g3', start: day(34),  end: day(35),  progress: 0,   owner: 'PM', isMilestone: true },
];

const SEED_DEPENDENCIES: Dependency[] = [
  { id: 'd-t1-t2', from: 't1', to: 't2', type: 'FS' },
  { id: 'd-t2-t3', from: 't2', to: 't3', type: 'FS' },
  { id: 'd-t4-t5', from: 't4', to: 't5', type: 'SS' },
  { id: 'd-t6-t7', from: 't6', to: 't7', type: 'FS' },
];

/** Each baseline records what we originally planned — drift renders as a ghost. */
const SEED_BASELINES: Baseline[] = [
  { taskId: 't2', start: day(-7),  end: day(-1)  }, // slipped 3 days
  { taskId: 't5', start: day(5),   end: day(15)  }, // started late, finished early
  { taskId: 't6', start: day(14),  end: day(24)  }, // slipped a few days
];

function BasicDemo({ scale }: { scale: TimeUnit }) {
  return (
    <div className="w-full">
      <Gantt tasks={PROJECT_TASKS} scale={scale} ariaLabel="Product launch plan" />
    </div>
  );
}

function CollapsedDemo() {
  const tasks: Task[] = PROJECT_TASKS.map((t) =>
    t.id === 'g2' ? { ...t, collapsed: true } : t,
  );
  return (
    <div className="w-full">
      <Gantt tasks={tasks} scale="week" ariaLabel="Plan with Implementation collapsed" />
    </div>
  );
}

function DependenciesDemo() {
  return (
    <div className="w-full">
      <Gantt
        tasks={PROJECT_TASKS}
        dependencies={SEED_DEPENDENCIES}
        scale="week"
        ariaLabel="Plan with finish-to-start dependencies"
      />
    </div>
  );
}

function CriticalPathDemo() {
  return (
    <div className="w-full">
      <Gantt
        tasks={PROJECT_TASKS}
        dependencies={SEED_DEPENDENCIES}
        scale="week"
        criticalPath
        ariaLabel="Plan with critical path highlighted"
      />
    </div>
  );
}

function M4Demo() {
  return (
    <div className="w-full">
      <Gantt
        tasks={PROJECT_TASKS}
        dependencies={SEED_DEPENDENCIES}
        baselines={SEED_BASELINES}
        workingDays={[1, 2, 3, 4, 5]}
        holidays={[day(-3)]}
        scale="week"
        ariaLabel="Plan with milestones, baselines, and weekend shading"
      />
    </div>
  );
}

const RESOURCE_TASKS: Task[] = [
  { id: 'r1', name: 'Frontend rebuild',    start: day(0),  end: day(14), progress: 40, owner: 'Eve M.' },
  { id: 'r2', name: 'Auth migration',      start: day(7),  end: day(21), progress: 20, owner: 'Eve M.' },
  { id: 'r3', name: 'Reporting dashboard', start: day(18), end: day(30), progress: 0,  owner: 'Eve M.' },
  { id: 'r4', name: 'Design system bump',  start: day(0),  end: day(28), progress: 50, owner: 'Ada L.' },
  { id: 'r5', name: 'Launch',              start: day(35), end: day(35), isMilestone: true, owner: 'PM' },
];

function M5Demo() {
  return (
    <div className="w-full space-y-2">
      <p className="text-xs text-text-secondary">
        Eve M. is double-booked across three tasks (red ⚠ in the owner column).
        Use <strong>Export</strong> in the toolbar to download a CSV of the plan
        or open the print dialog to save as PDF. Drag a bar onto a weekend with
        <code className="px-1 rounded bg-surface-overlay border border-border text-[10px]">workingDays</code>{' '}
        set and it snaps forward to Monday.
      </p>
      <Gantt
        tasks={RESOURCE_TASKS}
        scale="week"
        workingDays={[1, 2, 3, 4, 5]}
        exportFormats={['png', 'pdf', 'csv']}
        ariaLabel="Resource-conflict-aware plan with export"
      />
    </div>
  );
}

function M6Demo() {
  return (
    <div className="w-full space-y-2">
      <p className="text-xs text-text-secondary">
        Click the chart, then use{' '}
        <kbd className="px-1 rounded bg-surface-overlay border border-border text-[10px]">↑</kbd>{' '}
        <kbd className="px-1 rounded bg-surface-overlay border border-border text-[10px]">↓</kbd>{' '}
        to step between rows,{' '}
        <kbd className="px-1 rounded bg-surface-overlay border border-border text-[10px]">Home</kbd>{' '}
        /{' '}
        <kbd className="px-1 rounded bg-surface-overlay border border-border text-[10px]">End</kbd>{' '}
        to jump to first / last,{' '}
        <kbd className="px-1 rounded bg-surface-overlay border border-border text-[10px]">PgUp</kbd>{' '}
        /{' '}
        <kbd className="px-1 rounded bg-surface-overlay border border-border text-[10px]">PgDn</kbd>{' '}
        to page 5 rows, and{' '}
        <kbd className="px-1 rounded bg-surface-overlay border border-border text-[10px]">+</kbd>{' '}
        /{' '}
        <kbd className="px-1 rounded bg-surface-overlay border border-border text-[10px]">−</kbd>{' '}
        to zoom in / out. Headers and tooltip dates render in <strong>Turkish</strong> via
        the <code className="px-1 rounded bg-surface-overlay border border-border text-[10px]">locale</code> prop.
      </p>
      <Gantt
        tasks={PROJECT_TASKS}
        dependencies={SEED_DEPENDENCIES}
        scale="week"
        locale="tr-TR"
        ariaLabel="Plan demosu (Türkçe)"
      />
    </div>
  );
}

function InteractiveDemo() {
  const [tasks, setTasks] = useState<Task[]>(PROJECT_TASKS);
  const [deps, setDeps]   = useState<Dependency[]>(SEED_DEPENDENCIES);
  return (
    <div className="w-full space-y-2">
      <p className="text-xs text-text-secondary">
        Drag a bar to reschedule, drag its edges to resize, drag the white thumb to change progress,
        or drag from the blue dot on a bar&apos;s right edge to another bar to add a dependency.
        Click a dependency arrow and press <kbd className="px-1 rounded bg-surface-overlay border border-border text-[10px]">Delete</kbd> to remove it.
      </p>
      <Gantt
        tasks={tasks}
        dependencies={deps}
        scale="week"
        ariaLabel="Interactive plan"
        onTaskUpdate={(t) => setTasks((prev) => prev.map((p) => (p.id === t.id ? t : p)))}
        onDependencyCreate={(d) => setDeps((prev) => [...prev, d])}
        onDependencyDelete={(id) => setDeps((prev) => prev.filter((d) => d.id !== id))}
      />
    </div>
  );
}

export function buildAppGanttData(): ShowcaseComponent[] {
  return [
    {
      id: 'gantt',
      title: 'Gantt',
      category: 'App',
      abbr: 'Gt',
      description:
        'MS Project / GanttPRO / dhtmlxGantt-style project timeline. M1 ships the scale switcher (day / week / month / quarter / year), a vertical Today line, WBS tree with expand/collapse on the left panel, sticky timeline header with synchronised horizontal + vertical scroll, and absolutely-positioned task bars with a %-progress fill. M2 adds full interactivity: drag a bar to reschedule (snap to day), drag the left/right edges to resize, drag the white progress thumb to change %, and drag from the right-edge blue dot to another bar to draw an FS dependency. Dependencies render as orthogonal SVG arrows with a marker-end arrowhead; click an arrow then press Delete to remove it. M3 adds a Critical Path toggle in the toolbar — tasks on the longest dependency chain switch to var(--error) styling and their connecting arrows turn red, computed by a forward + backward longest-path pass on the dependency DAG. Hovering a bar after a short delay shows a tooltip with name, start/end, duration, owner, % complete, predecessors, and a Critical badge. M4 adds zero-duration milestones rendered as 14×14 diamonds, planned-vs-actual baseline ghost bars beneath the live bars, and weekend + holiday shading on the day + week scales. M5 adds a toolbar Export menu (PNG via SVG `<foreignObject>` round-trip, PDF via the browser print dialog, CSV via a pure-JS Blob download), drag snap that nudges drops forward to the next working day, and a resource-conflict detector that flags over-allocated owners in the WBS panel with a red triangle. M6 closes the loop with grid keyboard navigation (↑↓/Home/End/PageUp/PageDown between rows, +/− zoom, focused bar exposes a focus ring + `aria-activedescendant`), a `locale` prop that drives Intl-based month names and tooltip dates, `prefers-reduced-motion` honouring (plus a `reducedMotion` prop force-on), and automatic row virtualization above ~60 tasks. All mutations are optimistic and roll back automatically if `onTaskUpdate` / `onDependencyCreate` rejects. Internal state is owned by a per-instance Zustand store (`store.ts`).',
      filePath: 'modules/app/Gantt/index.tsx',
      sourceCode: `import { Gantt, type Dependency, type Task } from '@/modules/app/Gantt';
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
}`,
      since: '2026-05',
      status: 'beta',
      composes: ['button'],
      designTokens: [
        '--surface-base',
        '--surface-raised',
        '--surface-overlay',
        '--text-primary',
        '--text-secondary',
        '--border',
        '--border-focus',
        '--primary',
        '--primary-subtle',
        '--primary-fg',
        '--warning',
        '--error',
        '--error-subtle',
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['grid', 'row', 'columnheader', 'gridcell', 'tablist', 'tab'],
        keyboardInteractions: [
          { keys: 'Tab',           action: 'Move focus across scale tabs, collapse buttons, and dependency arrows' },
          { keys: 'Space / Enter', action: 'Activate scale tab or expand/collapse a WBS group' },
          { keys: 'Delete',        action: 'Remove the currently selected dependency arrow' },
          { keys: 'Escape',        action: 'Cancel an in-flight drag or dependency draw' },
          // TODO M6: Arrow / Home / End for grid navigation, +/- for zoom.
        ],
        notes:
          'Root carries role="grid"; the timeline header row is role="row" with each cell role="columnheader". Task bars are role="gridcell" labelled with the task name, dates, and % complete. Resize handles and the progress thumb are <button> elements so they are reachable by assistive tech. Dependency arrows are role="button" with keyboard-activatable selection. Scale switcher is a role="tablist"/role="tab" pair.',
      },
      variants: [
        {
          title: 'Week scale (default)',
          layout: 'stack' as const,
          preview: <BasicDemo scale="week" />,
          code: `<Gantt tasks={tasks} scale="week" ariaLabel="Product launch plan" />`,
        },
        {
          title: 'Month scale',
          layout: 'stack' as const,
          preview: <BasicDemo scale="month" />,
          code: `<Gantt tasks={tasks} scale="month" ariaLabel="Long-range roadmap" />`,
        },
        {
          title: 'Collapsed group',
          layout: 'stack' as const,
          preview: <CollapsedDemo />,
          code: `// Seed any task with \`collapsed: true\` to hide its children at first paint.
const tasks = base.map((t) => t.id === 'impl' ? { ...t, collapsed: true } : t);
<Gantt tasks={tasks} scale="week" />`,
        },
        {
          title: 'Dependencies (FS + SS)',
          layout: 'stack' as const,
          preview: <DependenciesDemo />,
          code: `const dependencies = [
  { id: 'd-t1-t2', from: 't1', to: 't2', type: 'FS' }, // Finish-to-Start
  { id: 'd-t4-t5', from: 't4', to: 't5', type: 'SS' }, // Start-to-Start
];

<Gantt tasks={tasks} dependencies={dependencies} scale="week" />`,
        },
        {
          title: 'Critical path (CPM)',
          layout: 'stack' as const,
          preview: <CriticalPathDemo />,
          code: `// Critical-path highlight uses a forward + backward longest-path pass
// over the dependency DAG. Tasks with zero float switch to error styling
// and their connecting arrows turn red. The toolbar toggle lets users
// switch it on / off; passing the prop sets the initial value.
<Gantt
  tasks={tasks}
  dependencies={dependencies}
  scale="week"
  criticalPath
/>`,
        },
        {
          title: 'Milestones + baselines + weekends',
          layout: 'stack' as const,
          preview: <M4Demo />,
          code: `// Milestones (zero-duration tasks rendered as diamonds), planned-vs-actual
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
/>`,
        },
        {
          title: 'Export + resource conflicts + working-day snap',
          layout: 'stack' as const,
          preview: <M5Demo />,
          code: `// M5 wires three things at once:
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
/>`,
        },
        {
          title: 'Keyboard nav + locale + reduced motion',
          layout: 'stack' as const,
          preview: <M6Demo />,
          code: `// M6 adds:
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
/>`,
        },
        {
          title: 'Interactive (drag + dependencies)',
          layout: 'stack' as const,
          preview: <InteractiveDemo />,
          code: `const [tasks, setTasks] = useState<Task[]>(initial);
const [deps,  setDeps]  = useState<Dependency[]>([]);

<Gantt
  tasks={tasks}
  dependencies={deps}
  scale="week"
  onTaskUpdate={(t) => setTasks((prev) => prev.map((p) => (p.id === t.id ? t : p)))}
  onDependencyCreate={(d) => setDeps((prev) => [...prev, d])}
  onDependencyDelete={(id) => setDeps((prev) => prev.filter((d) => d.id !== id))}
/>`,
        },
      ],
    },
  ];
}
