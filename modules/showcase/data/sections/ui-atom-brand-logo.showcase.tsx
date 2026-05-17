'use client';
import { BrandLogo } from '@/modules/ui/BrandLogo';
import type { ShowcaseComponent } from '../showcase.types';

const SOURCE = `'use client';
import { cn } from '@/libs/utils/cn';

type BrandLogoProps = {
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
};

export function BrandLogo({ children, size = 'md', className }: BrandLogoProps) {
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-2xl bg-primary text-primary-fg font-bold shadow-sm',
        size === 'sm'  && 'h-8 w-8 text-sm',
        size === 'md'  && 'h-12 w-12 text-lg',
        size === 'lg'  && 'h-16 w-16 text-2xl',
        size === 'xl'  && 'h-20 w-20 text-3xl',
        size === '2xl' && 'h-24 w-24 text-4xl',
        className
      )}
    >
      {children}
    </span>
  );
}`;

export function buildBrandLogoData(): ShowcaseComponent[] {
  return [
    {
      id: 'brand-logo',
      title: 'BrandLogo',
      category: 'Atom',
      abbr: 'BL',
      description: 'Square brand mark with rounded corners. Renders a single letter or short token on a primary-coloured tile. 5 sizes (sm → 2xl).',
      filePath: 'modules/ui/BrandLogo.tsx',
      sourceCode: SOURCE,
      variants: [
        {
          title: 'Default sizes',
          preview: (
            <div className="flex items-end gap-3">
              <BrandLogo size="sm">A</BrandLogo>
              <BrandLogo size="md">B</BrandLogo>
              <BrandLogo size="lg">C</BrandLogo>
              <BrandLogo size="xl">D</BrandLogo>
              <BrandLogo size="2xl">E</BrandLogo>
            </div>
          ),
          code: `<BrandLogo size="sm">A</BrandLogo>
<BrandLogo size="md">B</BrandLogo>
<BrandLogo size="lg">C</BrandLogo>
<BrandLogo size="xl">D</BrandLogo>
<BrandLogo size="2xl">E</BrandLogo>`,
        },
        {
          title: 'Custom content',
          preview: (
            <div className="flex items-center gap-3">
              <BrandLogo size="lg">KU</BrandLogo>
              <BrandLogo size="lg" className="bg-secondary">N</BrandLogo>
              <BrandLogo size="lg" className="bg-success">✓</BrandLogo>
            </div>
          ),
          code: `<BrandLogo size="lg">KU</BrandLogo>
<BrandLogo size="lg" className="bg-secondary">N</BrandLogo>
<BrandLogo size="lg" className="bg-success">✓</BrandLogo>`,
        },
      ],
    },
  ];
}
