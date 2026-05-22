'use client';
import { SkeletonLine, SkeletonAvatar, SkeletonText, SkeletonCard, SkeletonTableRow } from '@/modules/ui/Skeleton';
import type { ShowcaseComponent } from '../showcase.types';

export function buildSkeletonData(): ShowcaseComponent[] {
  return [
    {
      id: 'skeleton',
      title: 'Skeleton',
      category: 'Atom',
      abbr: 'Sk',
      description: 'Animated placeholder shown before content loads. Uses animate-pulse bg-surface-sunken. aria-busy="true" ensures accessibility.',
      filePath: 'modules/ui/Skeleton.tsx',
      sourceCode: `import { cn } from '@/libs/utils/cn';

const base = 'animate-pulse bg-surface-sunken';

export function SkeletonLine({ width = 'w-full', className }) {
  return <div className={cn(base, 'h-3 rounded', width, className)} />;
}

export function SkeletonAvatar({ size = 'md', className }) {
  const s = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }[size];
  return <div className={cn(base, 'rounded-full shrink-0', s, className)} />;
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)} aria-busy="true" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 1 ? 'w-4/5' : 'w-full'} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('bg-surface-raised border border-border rounded-xl p-6 space-y-4', className)} aria-busy="true">
      <div className="flex items-center gap-3">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="w-2/3" />
          <SkeletonLine width="w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}`,
      playground: {
        controls: [
          { key: 'lines', label: 'Lines', type: 'number', min: 1, max: 8, step: 1, default: 3 },
        ],
        render: (p) => (
          <div className="w-full max-w-xs">
            <SkeletonText lines={p.lines as number} />
          </div>
        ),
        generateCode: (p) => `<SkeletonText lines={${p.lines}} />`,
      },
      variants: [
        {
          title: 'Lines',
          preview: (
            <div className="w-full max-w-xs space-y-2">
              <SkeletonLine width="w-full" />
              <SkeletonLine width="w-3/4" />
              <SkeletonLine width="w-1/2" />
            </div>
          ),
          code: `<SkeletonLine width="w-full" />\n<SkeletonLine width="w-3/4" />\n<SkeletonLine width="w-1/2" />`,
        },
        {
          title: 'Text block',
          preview: <div className="w-full max-w-xs"><SkeletonText lines={4} /></div>,
          code: `<SkeletonText lines={4} />`,
        },
        {
          title: 'Card',
          preview: <div className="w-full max-w-sm"><SkeletonCard /></div>,
          code: `<SkeletonCard />`,
        },
        {
          title: 'Table rows',
          preview: (
            <div className="w-full overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <tbody>
                  <SkeletonTableRow cols={4} />
                  <SkeletonTableRow cols={4} />
                  <SkeletonTableRow cols={4} />
                </tbody>
              </table>
            </div>
          ),
          code: `<table className="w-full"><tbody><SkeletonTableRow cols={4} /></tbody></table>`,
        },
        {
          title: 'Dashboard layout',
          layout: 'stack' as const,
          preview: (
            <div className="w-full space-y-4" aria-busy="true">
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                    <SkeletonLine width="w-1/2" />
                    <div className="h-5 bg-surface-sunken animate-pulse rounded w-3/4" />
                    <SkeletonLine width="w-1/3" />
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {[0, 1, 2].map((i) => <SkeletonTableRow key={i} cols={4} />)}
                  </tbody>
                </table>
              </div>
            </div>
          ),
          code: `// Stat cards + table skeleton\n<div className="space-y-4">\n  <div className="grid grid-cols-3 gap-3">\n    {[...Array(3)].map((_, i) => (\n      <div key={i} className="border rounded-lg p-4 space-y-2">\n        <SkeletonLine width="w-1/2" />\n        <SkeletonLine width="w-3/4" className="h-5" />\n        <SkeletonLine width="w-1/3" />\n      </div>\n    ))}\n  </div>\n  <table><tbody><SkeletonTableRow cols={4} /></tbody></table>\n</div>`,
        },
        {
          title: 'Article layout',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-md space-y-4" aria-busy="true">
              <SkeletonLine width="w-1/4" />
              <div className="space-y-2">
                <div className="h-6 bg-surface-sunken animate-pulse rounded w-full" />
                <div className="h-6 bg-surface-sunken animate-pulse rounded w-3/4" />
              </div>
              <div className="flex items-center gap-3">
                <SkeletonAvatar size="sm" />
                <SkeletonLine width="w-24" />
              </div>
              <div className="h-40 bg-surface-sunken animate-pulse rounded-xl w-full" />
              <SkeletonText lines={4} />
            </div>
          ),
          code: `// Blog post / article skeleton\n<div className="space-y-4">\n  <SkeletonLine width="w-1/4" />        {/* category */}\n  <SkeletonLine width="w-full" className="h-6" /> {/* title row 1 */}\n  <SkeletonLine width="w-3/4" className="h-6" />  {/* title row 2 */}\n  <div className="flex items-center gap-3">\n    <SkeletonAvatar size="sm" />\n    <SkeletonLine width="w-24" />\n  </div>\n  <div className="h-40 animate-pulse bg-surface-sunken rounded-xl" /> {/* hero */}\n  <SkeletonText lines={4} />\n</div>`,
        },
      ],
    },
  ];
}
