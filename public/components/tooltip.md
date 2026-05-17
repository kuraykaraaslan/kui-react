# Tooltip

- **id:** `tooltip`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Tooltip.tsx`
- **status:** stable
- **since:** 2025-02

Hover ve focus ile görünür yardım metni. role="tooltip" + aria-describedby bağlantısı ile erişilebilir. 4 yön desteklenir.

## Design tokens consumed

- `--border`
- `--primary`
- `--surface-overlay`
- `--text-primary`

## Variants

### Placements

```tsx
<Tooltip content="Help text" placement="top">
  <Button variant="outline" size="sm">Hover me</Button>
</Tooltip>
```

### Themes

```tsx
<Tooltip content="Dark theme" theme="dark"><Button>Dark</Button></Tooltip>
```

### Arrow + Delay

```tsx
<Tooltip content="With arrow" arrow placement="top">
  <Button>Arrow</Button>
</Tooltip>
<Tooltip content="500ms delay" delay={500}>
  <Button>Delayed</Button>
</Tooltip>
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useRef, useState } from 'react';

export function Tooltip({ content, placement = 'top', children, className }) {
  const [visible, setVisible] = useState(false);
  const id = useRef(`tooltip-${Math.random().toString(36).slice(2)}`).current;
  const placementClass = { top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5', bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5', left: 'right-full top-1/2 -translate-y-1/2 mr-1.5', right: 'left-full top-1/2 -translate-y-1/2 ml-1.5' }[placement];
  return (
    <span className={cn('relative inline-flex items-center', className)} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} onFocus={() => setVisible(true)} onBlur={() => setVisible(false)}>
      <span aria-describedby={id}>{children}</span>
      <span id={id} role="tooltip" className={cn('absolute z-50 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium shadow-md bg-surface-overlay text-text-primary border border-border transition-opacity duration-150 pointer-events-none', placementClass, visible ? 'opacity-100' : 'opacity-0')}>{content}</span>
    </span>
  );
}
```
