# Separator

- **id:** `separator`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Separator.tsx`
- **status:** stable
- **since:** 2026-09

Visual divider between sections of content. Supports horizontal and vertical orientation, and an optional centered label for horizontal dividers.

## Design tokens consumed

- `--border`
- `--secondary`
- `--text-secondary`

## Variants

### Horizontal

```tsx
<p>Section one content</p>
<Separator />
<p>Section two content</p>
```

### Vertical + labeled

```tsx
<span>Profile</span>
<Separator orientation="vertical" />
<span>Settings</span>

<Separator label="OR" />
```

## Full source

```tsx
'use client';
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
}
```
