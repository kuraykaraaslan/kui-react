# Popover

- **id:** `popover`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Popover.tsx`
- **status:** stable
- **since:** 2025-03

Anchor-based contextual panel. Closes on outside click and Escape key. Supports top/bottom/left/right placement.

## Variants

### Bottom (default)

```tsx
<Popover trigger={<Button variant="outline">Open</Button>} placement="bottom">
  <div className="p-4">
    <p className="text-sm font-semibold">Title</p>
    <p className="text-xs text-text-secondary">Content goes here.</p>
  </div>
</Popover>
```

### Placements

```tsx
<Popover placement="top" trigger={<Button>Top</Button>}><div>...</div></Popover>
<Popover placement="right" trigger={<Button>Right</Button>}><div>...</div></Popover>
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useEffect, useRef, useState } from 'react';

export function Popover({ trigger, children, placement = 'bottom' }) {
  // manages open state, outside-click + Escape close, focus management
}
```
