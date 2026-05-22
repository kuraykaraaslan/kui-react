# Skeleton

- **id:** `skeleton`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Skeleton.tsx`
- **status:** stable
- **since:** 2025-01

Animated placeholder shown before content loads. Uses animate-pulse bg-surface-sunken. aria-busy="true" ensures accessibility.

## Design tokens consumed

- `--border`
- `--surface-raised`
- `--surface-sunken`

## Variants

### Lines

```tsx
<SkeletonLine width="w-full" />
<SkeletonLine width="w-3/4" />
<SkeletonLine width="w-1/2" />
```

### Text block

```tsx
<SkeletonText lines={4} />
```

### Card

```tsx
<SkeletonCard />
```

### Table rows

```tsx
<table className="w-full"><tbody><SkeletonTableRow cols={4} /></tbody></table>
```

### Dashboard layout

```tsx
// Stat cards + table skeleton
<div className="space-y-4">
  <div className="grid grid-cols-3 gap-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border rounded-lg p-4 space-y-2">
        <SkeletonLine width="w-1/2" />
        <SkeletonLine width="w-3/4" className="h-5" />
        <SkeletonLine width="w-1/3" />
      </div>
    ))}
  </div>
  <table><tbody><SkeletonTableRow cols={4} /></tbody></table>
</div>
```

### Article layout

```tsx
// Blog post / article skeleton
<div className="space-y-4">
  <SkeletonLine width="w-1/4" />        {/* category */}
  <SkeletonLine width="w-full" className="h-6" /> {/* title row 1 */}
  <SkeletonLine width="w-3/4" className="h-6" />  {/* title row 2 */}
  <div className="flex items-center gap-3">
    <SkeletonAvatar size="sm" />
    <SkeletonLine width="w-24" />
  </div>
  <div className="h-40 animate-pulse bg-surface-sunken rounded-xl" /> {/* hero */}
  <SkeletonText lines={4} />
</div>
```

## Full source

```tsx
import { cn } from '@/libs/utils/cn';

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
}
```
