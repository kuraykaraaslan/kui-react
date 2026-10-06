'use client';
import { useState } from 'react';
import { RangeSlider } from '@/modules/ui/RangeSlider';
import type { ShowcaseComponent } from '../showcase.types';

function RangeSliderSingleDemo() {
  const [v, setV] = useState(65);
  return <RangeSlider label="Volume" value={v} onChange={setV} min={0} max={100} className="w-full max-w-xs" />;
}
function RangeSliderDualDemo() {
  const [v, setV] = useState<[number, number]>([20, 80]);
  return <RangeSlider range label="Price range" value={v} onChange={setV} min={0} max={100} className="w-full max-w-xs" />;
}
function RangeSliderCommitDemo() {
  const [v, setV] = useState(40);
  const [commits, setCommits] = useState<{ n: number; last: number | null }>({ n: 0, last: null });
  return (
    <div className="w-full max-w-xs space-y-1">
      <RangeSlider
        label="Fan speed"
        value={v}
        onChange={setV}
        onCommit={(next) => setCommits((c) => ({ n: c.n + 1, last: next }))}
        min={0}
        max={100}
        step={5}
      />
      <p className="text-xs text-text-secondary">
        {commits.n === 0 ? 'Commits: none yet' : `Commits: ${commits.n} (last value ${commits.last})`}
      </p>
    </div>
  );
}
function RangeSliderPendingDemo() {
  return (
    <div className="w-full max-w-xs">
      <RangeSlider label="Fan speed" value={40} onChange={() => {}} min={0} max={100} step={5} pending />
    </div>
  );
}

export function buildRangeSliderData(): ShowcaseComponent[] {
  return [
    {
      id: 'range-slider',
      title: 'RangeSlider',
      category: 'Molecule',
      abbr: 'Rs',
      description: 'Numeric range input built on native `<input type="range">`. Single-handle by default, or `range` for a dual-handle min/max selector. Distinct from the `Slider` carousel component.',
      filePath: 'modules/ui/RangeSlider.tsx',
      since: '2026-09',
      relatedTo: ['slider'],
      sourceCode: `'use client';
import { RangeSlider } from '@/modules/ui/RangeSlider';

const [v, setV] = useState(65);
<RangeSlider label="Volume" value={v} onChange={setV} />

const [range, setRange] = useState<[number, number]>([20, 80]);
<RangeSlider range label="Price range" value={range} onChange={setRange} min={0} max={100} />`,
      variants: [
        {
          title: 'Single value',
          layout: 'stack' as const,
          preview: <RangeSliderSingleDemo />,
          code: `const [v, setV] = useState(65);\n<RangeSlider label="Volume" value={v} onChange={setV} min={0} max={100} />`,
        },
        {
          title: 'Dual-handle range',
          layout: 'stack' as const,
          preview: <RangeSliderDualDemo />,
          code: `const [range, setRange] = useState<[number, number]>([20, 80]);\n<RangeSlider range label="Price range" value={range} onChange={setRange} min={0} max={100} />`,
        },
        {
          title: 'Commit on release (one write per gesture)',
          layout: 'stack' as const,
          preview: <RangeSliderCommitDemo />,
          code: `<RangeSlider label="Fan speed" value={v} onChange={setV} onCommit={(n) => api.setFan(n)} min={0} max={100} step={5} />`,
        },
        {
          title: 'Pending (a write is in flight)',
          layout: 'stack' as const,
          preview: <RangeSliderPendingDemo />,
          code: `<RangeSlider label="Fan speed" value={40} onChange={setV} min={0} max={100} step={5} pending />`,
        },
      ],
    },
  ];
}
