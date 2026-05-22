# NavDrawer

- **id:** `nav-drawer`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/NavDrawer.tsx`
- **status:** stable
- **since:** 2025-03

Wrapper that wraps any trigger and children inside a drawer. Manages its own open/closed state. Used as AppNav's mobile menu and also works standalone.

## Variants

### Sol nav (standalone)

```tsx
<NavDrawer
  title="Navigation"
  side="left"
  trigger={<Button variant="outline" iconLeft={<MenuIcon />}>Open menu</Button>}
  footer={<Button variant="ghost" size="sm" fullWidth>Sign out</Button>}
>
  <nav className="space-y-1 pt-1">
    <a href="/" className="block px-3 py-2.5 rounded-lg bg-primary-subtle text-primary text-sm">Home</a>
    <a href="/products" className="block px-3 py-2.5 rounded-lg text-text-primary hover:bg-surface-overlay text-sm">Products</a>
  </nav>
</NavDrawer>
```

### Sağ drawer (cart panel)

```tsx
<NavDrawer
  title="Cart"
  side="right"
  trigger={<Button variant="outline">🛒 Cart (3)</Button>}
>
  {cartItems.map((item) => (
    <div key={item.id} className="flex justify-between text-sm py-2">
      <span>{item.name}</span><span>{item.price}</span>
    </div>
  ))}
  <Button variant="primary" fullWidth>Checkout</Button>
</NavDrawer>
```

## Full source

```tsx
'use client';
import { useState } from 'react';
import { Drawer } from '@/modules/ui/Drawer';

export function NavDrawer({ trigger, title = 'Menu', side = 'left', footer, children, className }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div role="none" onClick={() => setOpen(true)} className={cn('inline-flex', className)}>
        {trigger}
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title={title} side={side} footer={footer}>
        {children}
      </Drawer>
    </>
  );
}
```
