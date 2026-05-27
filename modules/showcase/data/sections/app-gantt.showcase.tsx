'use client';
import { useState } from 'react';
import { Gantt, type Dependency, type Task, type TimeUnit } from '@/modules/app/Gantt';
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
        'MS Project / GanttPRO / dhtmlxGantt-style project timeline. M1 ships the scale switcher (day / week / month / quarter / year), a vertical Today line, WBS tree with expand/collapse on the left panel, sticky timeline header with synchronised horizontal + vertical scroll, and absolutely-positioned task bars with a %-progress fill. M2 adds full interactivity: drag a bar to reschedule (snap to day), drag the left/right edges to resize, drag the white progress thumb to change %, and drag from the right-edge blue dot to another bar to draw an FS dependency. Dependencies render as orthogonal SVG arrows with a marker-end arrowhead; click an arrow then press Delete to remove it. All mutations are optimistic and roll back automatically if `onTaskUpdate` / `onDependencyCreate` rejects. Internal state is owned by a per-instance Zustand store (`store.ts`). Public props for `baselines`, `criticalPath`, `workingDays`, `holidays`, `exportFormats`, and `reducedMotion` are accepted but not yet wired — they become live in M3 (CPM highlight + hover tooltip), M4 (milestones + baselines + weekends), M5 (export + working-day calendar), and M6 (full keyboard nav + locale + virtualisation).',
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
