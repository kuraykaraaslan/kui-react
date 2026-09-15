'use client';
import { useState } from 'react';
import { RangeSlider } from '@/modules/ui/RangeSlider';
import type { ShowcaseComponent } from '../showcase.types';

function RangeSliderSingleDemo() {
  const [v, setV] = useState(40);
  return <RangeSlider label="Volume" value={v} onChange={setV} className="w-full max-w-xs" />;
}
function RangeSliderDualDemo() {
  const [v, setV] = useState<[number, number]>([20, 70]);
  return <RangeSlider range label="Price range" value={v} onChange={setV} min={0} max={100} className="w-full max-w-xs" />;
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

const [v, setV] = useState(40);
<RangeSlider label="Volume" value={v} onChange={setV} />

const [range, setRange] = useState<[number, number]>([20, 70]);
<RangeSlider range label="Price range" value={range} onChange={setRange} min={0} max={100} />`,
      variants: [
        {
          title: 'Single value',
          layout: 'stack' as const,
          preview: <RangeSliderSingleDemo />,
          code: `const [v, setV] = useState(40);\n<RangeSlider label="Volume" value={v} onChange={setV} />`,
        },
        {
          title: 'Dual handle (range)',
          layout: 'stack' as const,
          preview: <RangeSliderDualDemo />,
          code: `const [range, setRange] = useState<[number, number]>([20, 70]);\n<RangeSlider range label="Price range" value={range} onChange={setRange} min={0} max={100} />`,
        },
      ],
    },
  ];
}
