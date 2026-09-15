# Popconfirm

- **id:** `popconfirm`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Popconfirm.tsx`
- **status:** stable
- **since:** 2026-09

Inline "are you sure?" confirmation popover for destructive or consequential actions — lighter-weight than a full Modal. Built on the same dismiss/focus-trap primitives as Popover.

## Depends on

- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: alertdialog
- Keyboard:
  - `Enter / Space` — Open the trigger
  - `Tab` — Move between Cancel / Confirm
  - `Escape` — Dismiss without confirming

## Variants

### Default

```tsx
<Popconfirm trigger={<Button variant="outline">Log out</Button>} title="Log out of your account?" onConfirm={handleLogout} />
```

### Danger + description

```tsx
<Popconfirm
  trigger={<Button variant="danger">Delete project</Button>}
  title="Delete this project?"
  description="This action cannot be undone."
  danger
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>
```

## Full source

```tsx
'use client';
import { Popconfirm } from '@/modules/ui/Popconfirm';
import { Button } from '@/modules/ui/Button';

<Popconfirm
  trigger={<Button variant="danger">Delete</Button>}
  title="Delete this item?"
  description="This action cannot be undone."
  danger
  confirmLabel="Delete"
  onConfirm={() => remove(id)}
/>
```
