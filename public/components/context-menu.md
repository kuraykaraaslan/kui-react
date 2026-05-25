# ContextMenu

- **id:** `context-menu`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/ContextMenu.tsx`
- **status:** stable
- **since:** 2026-05

Right-click context menu. Wraps any element as a trigger. Supports item groups, keyboard shortcuts, separators, danger items, and disabled items. Positions itself via viewport-aware boundary detection, auto-flips when near screen edges. Full keyboard navigation: ↑↓ arrows, Enter, Escape.

## Variants

### Text editor — clipboard + format actions

```tsx
<ContextMenu items={[
  { label: 'Cut',      icon: <Icon />, shortcut: '⌘X' },
  { label: 'Copy',     icon: <Icon />, shortcut: '⌘C' },
  { label: 'Paste',    icon: <Icon />, shortcut: '⌘V' },
  { type: 'separator' },
  { label: 'Copy link',icon: <Icon />, shortcut: '⌘⇧C' },
  { type: 'separator' },
  { label: 'Rename',   icon: <Icon /> },
  { label: 'Delete',   icon: <Icon />, danger: true, shortcut: '⌫' },
]}>
  <div>Right-click anywhere in this area</div>
</ContextMenu>
```

### File manager — groups + shortcut hint

```tsx
<ContextMenu items={[
  { type: 'group', label: 'Actions' },
  { label: 'Open',     icon: <Icon /> },
  { label: 'Download', icon: <Icon />, shortcut: '⌘D' },
  { label: 'Share',    icon: <Icon />, shortcut: '⌘⇧S' },
  { type: 'separator' },
  { type: 'group', label: 'Organise' },
  { label: 'Move to…', icon: <Icon /> },
  { label: 'Add tag',  icon: <Icon /> },
  { type: 'separator' },
  { label: 'Delete', icon: <Icon />, danger: true },
]}>
  <FileCard name="Report Q1.pdf" />
</ContextMenu>
```

### Code branch — some items disabled

```tsx
<ContextMenu items={[
  { label: 'View diff',        icon: <Icon /> },
  { label: 'Copy branch name', icon: <Icon />, shortcut: '⌘C' },
  { type: 'separator' },
  { label: 'Merge into main',  icon: <Icon />, disabled: true },
  { label: 'Cherry-pick',                      disabled: true },
  { type: 'separator' },
  { label: 'Delete branch',    icon: <Icon />, danger: true },
]}>
  <BranchRow name="feature/context-menu" />
</ContextMenu>
```

## Full source

```tsx
'use client';
import { ContextMenu } from '@/modules/app/ContextMenu';
import type { ContextMenuItem } from '@/modules/app/ContextMenu';

const items: ContextMenuItem[] = [
  { label: 'Copy',   icon: <Icon />, shortcut: '⌘C', onClick: () => {} },
  { label: 'Paste',  icon: <Icon />, shortcut: '⌘V', onClick: () => {} },
  { type: 'separator' },
  { label: 'Delete', icon: <Icon />, danger: true,   onClick: () => {} },
];

<ContextMenu items={items}>
  <div>Right-click anywhere here</div>
</ContextMenu>
```
