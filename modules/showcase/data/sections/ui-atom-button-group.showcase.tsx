'use client';
import { ButtonGroup } from '@/modules/ui/ButtonGroup';
import { useState } from 'react';
import type { ShowcaseComponent } from '../showcase.types';

function ButtonGroupDemo() {
  const [v, setV] = useState('week');
  return (
    <ButtonGroup
      value={v}
      onChange={setV}
      items={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]}
    />
  );
}

function ButtonGroupVariantDemo({ variant }: { variant: 'primary' | 'secondary' | 'ghost' | 'outline' }) {
  return (
    <ButtonGroup
      value="week"
      onChange={() => {}}
      variant={variant}
      items={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
    />
  );
}

export function buildButtonGroupData(): ShowcaseComponent[] {
  return [
    {
      id: 'button-group',
      title: 'ButtonGroup',
      category: 'Molecule',
      abbr: 'BG',
      description: 'Segmented button group for mutually-exclusive options. Supports 4 variants, 4 sizes and disabled items.',
      filePath: 'modules/ui/ButtonGroup.tsx',
      sourceCode: `'use client';\nimport { cn } from '@/libs/utils/cn';\n\nexport function ButtonGroup({ items, value, onChange, variant = 'outline', size = 'md' }) {\n  return (\n    <div role="group" className="inline-flex rounded-md overflow-hidden border border-border divide-x divide-border">\n      {items.map((item) => (\n        <button key={item.value} type="button" aria-pressed={item.value === value}\n          onClick={() => onChange(item.value)}\n          className={cn('px-4 py-2 text-sm font-medium transition-colors', item.value === value ? 'bg-surface-overlay font-semibold' : 'bg-surface-base hover:bg-surface-overlay')}>\n          {item.label}\n        </button>\n      ))}\n    </div>\n  );\n}`,
      variants: [
        {
          title: 'Outline (default)',
          preview: <ButtonGroupDemo />,
          code: `function Demo() {\n  const [v, setV] = useState('week');\n  return (\n    <ButtonGroup value={v} onChange={setV}\n      items={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]}\n    />\n  );\n}`,
        },
        {
          title: 'Sizes',
          preview: (
            <div className="flex flex-wrap items-center gap-4">
              {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
                <ButtonGroup key={s} value="a" onChange={() => {}} size={s}
                  items={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]}
                />
              ))}
            </div>
          ),
          code: `<ButtonGroup size="sm" value="a" onChange={setV} items={[...]} />\n<ButtonGroup size="md" value="a" onChange={setV} items={[...]} />`,
          layout: 'stack' as const,
        },
        {
          title: 'Primary / secondary / ghost',
          layout: 'stack' as const,
          preview: (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Primary</p>
                <ButtonGroupVariantDemo variant="primary" />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Secondary</p>
                <ButtonGroupVariantDemo variant="secondary" />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Ghost</p>
                <ButtonGroupVariantDemo variant="ghost" />
              </div>
            </div>
          ),
          code: `<ButtonGroup variant="primary" value="week" onChange={setV} items={[...]} />\n<ButtonGroup variant="secondary" value="week" onChange={setV} items={[...]} />\n<ButtonGroup variant="ghost" value="week" onChange={setV} items={[...]} />`,
        },
        {
          title: 'With disabled item',
          preview: (
            <ButtonGroup
              value="week"
              onChange={() => {}}
              items={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month', disabled: true },
              ]}
            />
          ),
          code: `<ButtonGroup value="week" onChange={setV}\n  items={[\n    { value: 'day',   label: 'Day' },\n    { value: 'week',  label: 'Week' },\n    { value: 'month', label: 'Month', disabled: true },\n  ]}\n/>`,
        },
        {
          title: 'Icon-style labels',
          preview: (
            <div className="flex flex-wrap items-center gap-4">
              <ButtonGroup
                value="grid"
                onChange={() => {}}
                items={[
                  { value: 'list', label: '☰' },
                  { value: 'grid', label: '⊞' },
                  { value: 'map', label: '◫' },
                ]}
              />
              <ButtonGroup
                value="center"
                onChange={() => {}}
                variant="secondary"
                items={[
                  { value: 'left', label: '⇤' },
                  { value: 'center', label: '↔' },
                  { value: 'right', label: '⇥' },
                ]}
              />
            </div>
          ),
          code: `// Use single-char labels as icon proxies:\n<ButtonGroup value="grid" onChange={setV}\n  items={[\n    { value: 'list', label: '☰' },\n    { value: 'grid', label: '⊞' },\n    { value: 'map',  label: '◫' },\n  ]}\n/>`,
        },
      ],
    },
  ];
}
