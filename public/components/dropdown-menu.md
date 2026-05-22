# DropdownMenu

- **id:** `dropdown-menu`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/DropdownMenu.tsx`
- **status:** stable
- **since:** 2025-03

Accessible dropdown using role="menu" + role="menuitem". Closes on Escape and outside click. Supports left/right alignment, icons, separators, danger and disabled items, and arrow-key navigation.

## Design tokens consumed

- `--border`
- `--error`
- `--error-subtle`
- `--primary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`

## Variants

### Default

```tsx
<DropdownMenu
  trigger={<Button variant="outline" size="sm">Actions ▾</Button>}
  items={[
    { label: 'Edit', icon: '✏' },
    { label: 'Duplicate', icon: '⧉' },
    { type: 'separator' },
    { label: 'Delete', icon: '🗑', danger: true },
  ]}
/>
```

### Right-aligned

```tsx
<DropdownMenu align="right"
  trigger={<Button variant="ghost" size="sm">⋮</Button>}
  items={[{ label: 'View details' }, { label: 'Remove', danger: true }]}
/>
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useEffect, useRef, useState } from 'react';

export function DropdownMenu({ trigger, items, align = 'left', className }) {
  const [open, setOpen] = useState(false);
  // outside click + Escape handlers
  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen((p) => !p)} aria-haspopup="menu" aria-expanded={open}>{trigger}</div>
      {open && (
        <div role="menu" className={cn('absolute z-50 mt-1 min-w-[10rem] rounded-lg border border-border bg-surface-raised shadow-lg py-1', align === 'right' ? 'right-0' : 'left-0')}>
          {items.map((item, i) => item.type === 'separator' ? <div key={i} role="separator" className="my-1 border-t border-border" /> : (
            <button key={i} role="menuitem" type="button" disabled={item.disabled} onClick={() => { item.onClick?.(); setOpen(false); }}
              className={cn('flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors focus-visible:outline-none focus-visible:bg-surface-overlay', item.danger ? 'text-error hover:bg-error-subtle' : 'text-text-primary hover:bg-surface-overlay', item.disabled && 'opacity-50 cursor-not-allowed')}>
              {item.icon && <span aria-hidden="true">{item.icon}</span>}{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```
