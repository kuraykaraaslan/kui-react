'use client';
import { Separator } from '@/modules/ui/Separator';
import type { ShowcaseComponent } from '../showcase.types';

export function buildSeparatorData(): ShowcaseComponent[] {
  return [
    {
      id: 'separator',
      title: 'Separator',
      category: 'Atom',
      abbr: 'Se',
      description: 'Visual divider between sections of content. Supports horizontal and vertical orientation, and an optional centered label for horizontal dividers.',
      filePath: 'modules/ui/Separator.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';

type SeparatorOrientation = 'horizontal' | 'vertical';

type SeparatorProps = {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  label?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Separator({ orientation = 'horizontal', decorative = true, label, className, ...rest }: SeparatorProps) {
  if (label && orientation === 'horizontal') {
    return (
      <div role={decorative ? 'none' : 'separator'} className={cn('flex items-center gap-3 text-xs font-medium text-text-secondary', className)} {...rest}>
        <span className="h-px flex-1 bg-border" />
        {label}
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
      {...rest}
    />
  );
}`,
      variants: [
        {
          title: 'Horizontal',
          preview: (
            <div className="w-full max-w-sm space-y-3 text-sm text-text-primary">
              <p>Section one content</p>
              <Separator />
              <p>Section two content</p>
            </div>
          ),
          code: `<p>Section one content</p>\n<Separator />\n<p>Section two content</p>`,
        },
        {
          title: 'Vertical + labeled',
          preview: (
            <div className="space-y-4">
              <div className="flex h-6 items-center gap-3 text-sm text-text-primary">
                <span>Profile</span>
                <Separator orientation="vertical" />
                <span>Settings</span>
                <Separator orientation="vertical" />
                <span>Billing</span>
              </div>
              <Separator label={<span>OR</span>} className="max-w-sm" />
            </div>
          ),
          code: `<span>Profile</span>\n<Separator orientation="vertical" />\n<span>Settings</span>\n\n<Separator label="OR" />`,
        },
      ],
    },
  ];
}
