# AlertBanner

- **id:** `alert-banner`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/AlertBanner.tsx`
- **status:** stable
- **since:** 2025-02

Page-level info, success, warning or error message. Announced via role="alert" for screen readers with optional dismissible and action support.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--info`
- `--info-subtle`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--warning`
- `--warning-subtle`

## Variants

### Info

```tsx
<AlertBanner variant="info" title="System update" message="A new version is available." dismissible />
```

### Success

```tsx
<AlertBanner variant="success" message="Profile updated successfully." dismissible />
```

### Warning

```tsx
<AlertBanner variant="warning" title="Maintenance window" message="The service will be unavailable from 2–4 AM UTC." />
```

### Error

```tsx
<AlertBanner variant="error" title="Something went wrong" message="Unable to load the resource. Please try again." />
```

### With CTA action

```tsx
<AlertBanner variant="warning" title="Your plan is expiring" message="Upgrade before your trial ends."
  action={{ label: 'Upgrade now', onClick: handleUpgrade }} dismissible />
```

### Link CTA (action.href)

```tsx
<AlertBanner variant="info" title="Documentation updated" message="New guides are available."
  action={{ label: 'Read docs', href: '/docs/api' }} />
```

### Custom icon

```tsx
<AlertBanner variant="info" message="Custom icon override." icon={<RocketIcon />} />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';

const variantMap = {
  success: { container: 'bg-success-subtle border-success text-success-fg', icon: '✓' },
  warning: { container: 'bg-warning-subtle border-warning text-warning-fg', icon: '⚠' },
  error:   { container: 'bg-error-subtle border-error text-error-fg',       icon: '✕' },
  info:    { container: 'bg-info-subtle border-info text-info-fg',          icon: 'ℹ' },
};

export function AlertBanner({ variant = 'info', title, message, dismissible = false, className }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const { container, icon } = variantMap[variant];
  return (
    <div role="alert" className={cn('flex items-start gap-3 rounded-lg border p-4', container, className)}>
      <span aria-hidden="true" className="mt-0.5 shrink-0 font-bold">{icon}</span>
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold">{title}</p>}
        <p className={cn(title && 'mt-0.5')}>{message}</p>
      </div>
      {dismissible && (
        <button type="button" aria-label="Dismiss" onClick={() => setDismissed(true)} className="shrink-0 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">✕</button>
      )}
    </div>
  );
}
```
