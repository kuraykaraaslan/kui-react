# AppBreadcrumbs

- **id:** `app-breadcrumbs`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppBreadcrumbs.tsx`
- **status:** stable
- **since:** 2026-05

Page header with breadcrumb trail, title, description, and optional status badge. Collapses to a Breadcrumb + dropdown menu on mobile for deep paths.

## Variants

### With title + badge

```tsx
<AppBreadcrumbs
  title="Project Atlas"
  description="Internal tooling for the design system team"
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Projects',  href: '/projects' },
    { label: 'Atlas' },
  ]}
  badge={<Badge variant="info" size="sm">Beta</Badge>}
/>
```

### Deep path

```tsx
<AppBreadcrumbs
  title="invoice-2026-05-001.pdf"
  items={[
    { label: 'Home',     href: '/' },
    { label: 'Accounts', href: '/accounts' },
    { label: 'Acme Inc', href: '/accounts/acme' },
    { label: 'Invoices', href: '/accounts/acme/invoices' },
    { label: '2026-05',  href: '/accounts/acme/invoices/2026-05' },
    { label: 'invoice-2026-05-001.pdf' },
  ]}
/>
```

## Full source

```tsx
'use client';
import { AppBreadcrumbs } from '@/modules/app/AppBreadcrumbs';
import { Badge } from '@/modules/ui/Badge';

<AppBreadcrumbs
  title="Project Atlas"
  description="Internal tooling for the design system team"
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Projects',  href: '/projects' },
    { label: 'Atlas' },
  ]}
  badge={<Badge variant="info" size="sm">Beta</Badge>}
/>
```
