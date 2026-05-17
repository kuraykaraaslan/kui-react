# AppNav

- **id:** `app-nav`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppNav.tsx`
- **status:** stable
- **since:** 2025-03

Yatay navigasyon çubuğu. Masaüstünde inline linkler, mobilde NavDrawer açan hamburger gösterir. logo, navItems, actions slotları var.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Marketing bar (logo + links + CTA)

```tsx
<AppNav
  logo={<span className="font-bold text-primary">Acme</span>}
  navItems={[
    { label: 'Home',     href: '/', active: true },
    { label: 'Products', href: '/products' },
    { label: 'Pricing',  href: '/pricing' },
  ]}
>
  <Button variant="ghost" size="sm">Log in</Button>
  <Button variant="primary" size="sm">Sign up</Button>
</AppNav>
```

### App bar (links + UserMenu)

```tsx
<AppNav
  logo={<span className="font-bold">Dashboard</span>}
  navItems={[
    { label: 'Overview', active: true },
    { label: 'Analytics' },
    { label: 'Reports' },
  ]}
>
  <UserMenu user={currentUser} />
</AppNav>
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { NavDrawer } from '@/modules/app/NavDrawer';
import { Button } from '@/modules/ui/Button';

export function AppNav({ logo, navItems = [], children, sticky = false, bordered = true, className, ...rest }) {
  return (
    <header className={cn('w-full flex items-center gap-3 px-4 py-3 bg-surface-raised',
      bordered && 'border-b border-border', sticky && 'sticky top-0 z-40', className)} {...rest}>
      <div className="md:hidden">
        <NavDrawer title="Navigation" side="left"
          trigger={<Button variant="ghost" size="sm" iconOnly aria-label="Open navigation menu">☰</Button>}>
          <nav className="flex flex-col gap-0.5 pt-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a key={item.label} href={item.href ?? '#'} aria-current={item.active ? 'page' : undefined}
                className={cn('flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  item.active ? 'bg-primary-subtle text-primary' : 'text-text-primary hover:bg-surface-overlay')}>
                {item.label}
              </a>
            ))}
          </nav>
        </NavDrawer>
      </div>
      {logo && <div className="shrink-0">{logo}</div>}
      <nav className="hidden md:flex items-center gap-0.5 flex-1" aria-label="Main navigation">
        {navItems.map((item) => (
          <a key={item.label} href={item.href ?? '#'} aria-current={item.active ? 'page' : undefined}
            className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              item.active ? 'bg-primary-subtle text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay')}>
            {item.label}
          </a>
        ))}
      </nav>
      {children && <div className="flex items-center gap-2 ml-auto shrink-0">{children}</div>}
    </header>
  );
}
```
