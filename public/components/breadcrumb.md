# Breadcrumb

- **id:** `breadcrumb`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Breadcrumb.tsx`
- **status:** stable
- **since:** 2025-02

nav aria-label="Breadcrumb" sarıcı ile erişilebilir. Son öge aria-current="page" ile işaretlenir, ayrılıcı aria-hidden.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```tsx
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Breadcrumb' },
]} />
```

### Long path

```tsx
<Breadcrumb items={[
  { label: 'Dashboard', href: '/' },
  { label: 'Users', href: '/users' },
  { label: 'Settings', href: '/users/settings' },
  { label: 'Permissions' },
]} />
```

### Custom separator

```tsx
<Breadcrumb items={[...]} separator={<span>/</span>} />
```

### Overflow / ellipsis

```tsx
<Breadcrumb items={[/* 6 items */]} maxItems={3} />
```

## Full source

```tsx
import { cn } from '@/libs/utils/cn';

export function Breadcrumb({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {!isLast && item.href ? (
                <><a href={item.href} className="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">{item.label}</a><span aria-hidden="true" className="text-text-disabled">›</span></>
              ) : (
                <span className={isLast ? 'text-text-primary font-medium' : 'text-text-secondary'} aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```
