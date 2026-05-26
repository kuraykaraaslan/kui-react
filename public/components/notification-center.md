# NotificationCenter

- **id:** `notification-center`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/NotificationCenter/index.tsx`
- **status:** beta
- **since:** 2026-05

Inbox / activity feed with a bell trigger + unread badge, a popover panel listing notifications newest-first, mark-as-read on hover or click, and a toolbar "Mark all as read". M2-M6 add filter tabs / grouping / per-notification actions / realtime / preferences / full a11y. Sibling of the toast layer (NotificationSystem) — both can co-exist.

## Accessibility

- WCAG: AA
- ARIA patterns: Button with aria-haspopup="dialog" + aria-expanded (bell), Region with aria-live="polite" (panel), Badge with aria-label="N unread notifications"
- Keyboard:
  - `Enter / Space` — Toggle the panel from the bell
  - `Escape` — Close the panel
  - `Tab` — Move through notification rows + mark-read buttons

Full keyboard nav (J/K row nav, M = mark read, A = archive) and screen-reader announcement of new notifications arrive in M6.

## Design tokens consumed

- `--primary`
- `--primary-subtle`
- `--error`
- `--text-inverse`
- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--border`
- `--border-focus`
- `--text-primary`
- `--text-secondary`
- `--success`
- `--success-subtle`
- `--warning`
- `--warning-subtle`
- `--info`
- `--info-subtle`
- `--error-subtle`

## Variants

### Bell + panel (default)

```tsx
<NotificationCenter
  notifications={items}
  onMarkRead={(id) => markRead(id)}
  onMarkAllRead={() => markAllRead()}
/>
```

### Empty state

```tsx
<NotificationCenter notifications={[]} />
```

### High unread count — badge caps at 99+

```tsx
<NotificationCenter
  notifications={many /* 100+ unread */}
  onMarkRead={(id) => markRead(id)}
  onMarkAllRead={() => markAllRead()}
/>
```

## Full source

```tsx
'use client';
import { useState } from 'react';
import { NotificationCenter, type Notification } from '@/modules/app/NotificationCenter';

const seed: Notification[] = [
  {
    id: 'n1',
    title: 'Ada Lovelace requested a review',
    message: 'feat: add notification inbox.',
    createdAt: new Date(),
    read: false,
    source: 'GitHub',
    actor: 'Ada Lovelace',
    variant: 'mention',
  },
];

export function Demo() {
  const [items, setItems] = useState(seed);
  return (
    <NotificationCenter
      notifications={items}
      onMarkRead={(id) =>
        setItems((cur) => cur.map((n) => (n.id === id ? { ...n, read: true } : n)))
      }
      onMarkAllRead={() => setItems((cur) => cur.map((n) => ({ ...n, read: true })))}
    />
  );
}
```
