# ScrollArea

- **id:** `scroll-area`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/ScrollArea.tsx`
- **status:** stable
- **since:** 2026-09

Scrollable container with a themed, thin scrollbar (Firefox scrollbar-color + WebKit pseudo-elements) instead of the bulky native default. Supports vertical, horizontal, or both-axis scrolling.

## Design tokens consumed

- `--border`
- `--border-strong`

## Variants

### Vertical list

```tsx
<ScrollArea className="h-40 w-64 rounded-md border border-border p-3">
  <ul className="space-y-2">
    {items.map((item) => <li key={item.id}>{item.label}</li>)}
  </ul>
</ScrollArea>
```

### Horizontal

```tsx
<ScrollArea orientation="horizontal" className="w-full rounded-md border border-border p-3">
  <div className="flex gap-3">
    {cards.map((c) => <Card key={c.id} {...c} />)}
  </div>
</ScrollArea>
```

## Full source

```tsx
'use client';
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
}
```
