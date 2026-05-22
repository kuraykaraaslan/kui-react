# Avatar

- **id:** `avatar`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Avatar.tsx`
- **status:** stable
- **since:** 2025-01

User profile photo or initials indicator. 5 sizes with optional status dot. When no image is provided, initials render on a bg-primary-subtle / text-primary tile.

## Used by

- `reviews-review-card`

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-subtle`

## Variants

### Initials (sizes)

```tsx
<Avatar name="Jane Doe" size="xs" />
<Avatar name="Jane Doe" size="sm" />
<Avatar name="Jane Doe" size="md" />
<Avatar name="Jane Doe" size="lg" />
<Avatar name="Jane Doe" size="xl" />
```

### With label

```tsx
<div className="flex items-center gap-3">
  <Avatar name="John Smith" size="md" />
  <div>
    <p className="text-sm font-medium text-text-primary">John Smith</p>
    <p className="text-xs text-text-secondary">john@example.com</p>
  </div>
</div>
```

### Image source

```tsx
<Avatar src="/avatar.jpg" name="Jane Doe" />
```

### Status dot

```tsx
<Avatar name="Alice" status="online" />
<Avatar name="Bob" status="away" />
<Avatar name="Carol" status="busy" />
<Avatar name="Dave" status="offline" />
```

### AvatarGroup

```tsx
<AvatarGroup
  avatars={[{ name: 'Alice' }, { name: 'Bob' }, ...]}
  max={4}
/>
```

## Full source

```tsx
import { cn } from '@/libs/utils/cn';

const sizeMap = {
  xs: 'h-6 w-6 text-xs',  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base', xl: 'h-16 w-16 text-lg',
};

function getInitials(name) {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';
}

export function Avatar({ src, name, size = 'md', className }) {
  const sizeClass = sizeMap[size];
  if (src) return <img src={src} alt={name} className={cn(sizeClass, 'rounded-full object-cover border border-border shrink-0', className)} />;
  return (
    <span aria-label={name} className={cn(sizeClass, 'rounded-full bg-primary-subtle text-primary font-semibold flex items-center justify-center shrink-0 border border-primary-subtle select-none', className)}>
      {getInitials(name)}
    </span>
  );
}
```
