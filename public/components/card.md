# Card

- **id:** `card`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Card.tsx`
- **status:** stable
- **since:** 2025-02

Raised / flat / outline varyantlı içerik konteyneri. title + subtitle + headerRight + footer slotları desteklenir.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Raised

```tsx
<Card title="User profile" subtitle="Manage your account" headerRight={<Badge variant="success">Active</Badge>}>
  <p>Card body content goes here.</p>
</Card>
```

### With footer

```tsx
<Card title="Confirm deletion" footer={<><Button variant="outline" size="sm">Cancel</Button><Button variant="danger" size="sm">Delete</Button></>}>
  <p>This action is irreversible.</p>
</Card>
```

### Flat

```tsx
<Card variant="flat" title="Flat card">
  <p>No shadow, uses page background color.</p>
</Card>
```

### Outline

```tsx
<Card variant="outline" title="Outline card">
  <p>Transparent background, border only.</p>
</Card>
```

### Clickable / hoverable

```tsx
<Card title="Clickable" onClick={() => navigate('/detail')}>...</Card>
<Card title="Hoverable" hoverable>...</Card>
```

### Loading skeleton

```tsx
<Card loading />
```

## Full source

```tsx
import { cn } from '@/libs/utils/cn';

export function Card({ title, subtitle, headerRight, footer, children, variant = 'raised', className }) {
  return (
    <div className={cn('rounded-xl border border-border overflow-hidden', variant === 'raised' && 'bg-surface-raised shadow-sm', variant === 'flat' && 'bg-surface-base', variant === 'outline' && 'bg-transparent', className)}>
      {(title || headerRight) && (
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-border">
          <div>
            {title && <h3 className="text-sm font-semibold text-text-primary">{title}</h3>}
            {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </div>
      )}
      {children && <div className="px-6 py-4">{children}</div>}
      {footer && <div className="px-6 py-3 border-t border-border bg-surface-base">{footer}</div>}
    </div>
  );
}
```
