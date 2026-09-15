'use client';
import { ScrollArea } from '@/modules/ui/ScrollArea';
import type { ShowcaseComponent } from '../showcase.types';

export function buildScrollAreaData(): ShowcaseComponent[] {
  return [
    {
      id: 'scroll-area',
      title: 'ScrollArea',
      category: 'Atom',
      abbr: 'SA',
      description: 'Scrollable container with a themed, thin scrollbar (Firefox scrollbar-color + WebKit pseudo-elements) instead of the bulky native default. Supports vertical, horizontal, or both-axis scrolling.',
      filePath: 'modules/ui/ScrollArea.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';

type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

type ScrollAreaProps = {
  orientation?: ScrollAreaOrientation;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const overflowClasses: Record<ScrollAreaOrientation, string> = {
  vertical: 'overflow-y-auto overflow-x-hidden',
  horizontal: 'overflow-x-auto overflow-y-hidden',
  both: 'overflow-auto',
};

export function ScrollArea({ orientation = 'vertical', className, children, ...rest }: ScrollAreaProps) {
  return (
    <div
      className={cn(
        'relative rounded-md',
        overflowClasses[orientation],
        '[scrollbar-width:thin] [scrollbar-color:var(--border-strong)_transparent]',
        '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        '[&::-webkit-scrollbar-thumb]:bg-border-strong [&::-webkit-scrollbar-thumb]:rounded-full',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}`,
      variants: [
        {
          title: 'Vertical list',
          layout: 'stack' as const,
          preview: (
            <ScrollArea className="h-40 w-64 rounded-md border border-border p-3">
              <ul className="space-y-2 text-sm text-text-primary">
                {Array.from({ length: 20 }).map((_, i) => (
                  <li key={i} className="rounded-md bg-surface-raised px-3 py-2">Item {i + 1}</li>
                ))}
              </ul>
            </ScrollArea>
          ),
          code: `<ScrollArea className="h-40 w-64 rounded-md border border-border p-3">\n  <ul className="space-y-2">\n    {items.map((item) => <li key={item.id}>{item.label}</li>)}\n  </ul>\n</ScrollArea>`,
        },
        {
          title: 'Horizontal',
          layout: 'stack' as const,
          preview: (
            <ScrollArea orientation="horizontal" className="w-full rounded-md border border-border p-3">
              <div className="flex gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-16 w-24 shrink-0 rounded-md bg-surface-raised flex items-center justify-center text-sm text-text-primary">
                    Card {i + 1}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ),
          code: `<ScrollArea orientation="horizontal" className="w-full rounded-md border border-border p-3">\n  <div className="flex gap-3">\n    {cards.map((c) => <Card key={c.id} {...c} />)}\n  </div>\n</ScrollArea>`,
        },
      ],
    },
  ];
}
