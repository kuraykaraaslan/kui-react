'use client';
import { Spinner } from '@/modules/ui/Spinner';
import { Button } from '@/modules/ui/Button';
import type { ShowcaseComponent } from '../showcase.types';

export function buildSpinnerData(): ShowcaseComponent[] {
  return [
    {
      id: 'spinner',
      title: 'Spinner',
      category: 'Atom',
      abbr: 'Sp',
      description: 'CSS border-based loading indicator. Does not require FontAwesome. 5 sizes, border-border / border-t-primary colour system.',
      filePath: 'modules/ui/Spinner.tsx',
      sourceCode: `import { cn } from '@/libs/utils/cn';

const sizeMap = {
  xs: 'h-3 w-3 border', sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2', lg: 'h-8 w-8 border-[3px]', xl: 'h-12 w-12 border-4',
};

export function Spinner({ size = 'md', className }) {
  return (
    <>
      <span aria-hidden="true" className={cn('inline-block rounded-full border-border border-t-primary animate-spin', sizeMap[size], className)} />
      <span className="sr-only">Loading…</span>
    </>
  );
}`,
      playground: {
        controls: [
          { key: 'size', label: 'Size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] as const, default: 'md' },
        ],
        render: (p) => <Spinner size={p.size as any} />,
        generateCode: (p) => `<Spinner size="${p.size}" />`,
      },
      variants: [
        {
          title: 'Sizes',
          preview: (
            <div className="flex items-center gap-4">
              {(['xs','sm','md','lg','xl'] as const).map((s) => <Spinner key={s} size={s} />)}
            </div>
          ),
          code: `<Spinner size="xs" />\n<Spinner size="sm" />\n<Spinner size="md" />\n<Spinner size="lg" />\n<Spinner size="xl" />`,
        },
        {
          title: 'In a Button',
          preview: <Button variant="primary" loading>Loading…</Button>,
          code: `<Button variant="primary" loading>Loading…</Button>`,
        },
      ],
    },
  ];
}
