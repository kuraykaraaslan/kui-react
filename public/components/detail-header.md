# DetailHeader

- **id:** `detail-header`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/DetailHeader.tsx`
- **status:** stable
- **since:** 2025-03

Page header for detail/record views: title, subtitle, status badge, action buttons, and optional tab navigation.

## Variants

### With actions, no tabs

```tsx
<DetailHeader
  title="Invoice #1042"
  subtitle="Created 3 days ago by Jane Doe"
  status="Pending"
  statusVariant="warning"
>
  <Button variant="outline" size="sm">Edit</Button>
  <Button variant="primary" size="sm">Approve</Button>
</DetailHeader>
```

### With tabs

```tsx
<DetailHeader
  title="Order #8821"
  subtitle="Last updated 2 hours ago"
  status="Shipped"
  statusVariant="success"
  tabs={[
    { value: 'overview', label: 'Overview' },
    { value: 'items',    label: 'Items'    },
    { value: 'history',  label: 'History'  },
    { value: 'notes',    label: 'Notes', disabled: true },
  ]}
  defaultTab="overview"
>
  <Button variant="ghost" size="sm">Print</Button>
  <Button variant="primary" size="sm">Track</Button>
</DetailHeader>
```

## Full source

```tsx
'use client';
import { DetailHeader } from '@/modules/app/DetailHeader';

<DetailHeader
  title="Invoice #1042"
  subtitle="Created 3 days ago"
  status="Pending"
  statusVariant="warning"
  tabs={[
    { value: 'overview', label: 'Overview' },
    { value: 'items',    label: 'Items'    },
  ]}
  defaultTab="overview"
>
  <Button variant="primary" size="sm">Approve</Button>
</DetailHeader>
```
