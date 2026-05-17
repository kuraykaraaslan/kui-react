# BrandLogo

- **id:** `brand-logo`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/BrandLogo.tsx`
- **status:** stable
- **since:** 2026-05

Square brand mark with rounded corners. Renders a single letter or short token on a primary-coloured tile. 5 sizes (sm → 2xl).

## Design tokens consumed

- `--primary`
- `--primary-fg`

## Variants

### Default sizes

```tsx
<BrandLogo size="sm">A</BrandLogo>
<BrandLogo size="md">B</BrandLogo>
<BrandLogo size="lg">C</BrandLogo>
<BrandLogo size="xl">D</BrandLogo>
<BrandLogo size="2xl">E</BrandLogo>
```

### Custom content

```tsx
<BrandLogo size="lg">KU</BrandLogo>
<BrandLogo size="lg" className="bg-secondary">N</BrandLogo>
<BrandLogo size="lg" className="bg-success">✓</BrandLogo>
```

## Full source

```tsx
'use client';
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
}
```
