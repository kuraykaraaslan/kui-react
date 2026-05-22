'use client';
import { AppNav } from '@/modules/app/AppNav';
import { NavDrawer } from '@/modules/app/NavDrawer';
import { UserMenu } from '@/modules/domains/common/user/UserMenu';
import { Button } from '@/modules/ui/Button';
import type { ShowcaseComponent } from '../showcase.types';

const DEMO_USER = {
  userId: 'demo-1',
  email: 'jane@acme.com',
  userRole: 'ADMIN',
  userStatus: 'ACTIVE',
  userPreferences: null,
  userProfile: { name: 'Jane Doe', profilePicture: null },
} as const;

const NAV_ITEMS = [
  { label: 'Home',     href: '#', active: true },
  { label: 'Products', href: '#' },
  { label: 'Pricing',  href: '#' },
  { label: 'Blog',     href: '#' },
];

function AppNavMarketingDemo() {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <AppNav
        logo={<span className="text-base font-bold text-primary">Acme</span>}
        navItems={NAV_ITEMS}
      >
        <Button variant="ghost" size="sm">Log in</Button>
        <Button variant="primary" size="sm">Sign up</Button>
      </AppNav>
      <div className="px-6 py-6 text-sm text-text-secondary bg-surface-base">
        Page content — resize window to see mobile hamburger.
      </div>
    </div>
  );
}

function AppNavAppDemo() {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <AppNav
        logo={<span className="font-bold text-text-primary">Dashboard</span>}
        navItems={[
          { label: 'Overview',  active: true },
          { label: 'Analytics' },
          { label: 'Reports'   },
          { label: 'Settings'  },
        ]}
      >
        <UserMenu user={DEMO_USER as any} />
      </AppNav>
      <div className="px-6 py-6 text-sm text-text-secondary bg-surface-base">Page content</div>
    </div>
  );
}

function NavDrawerLeftDemo() {
  return (
    <NavDrawer
      title="Navigation"
      side="left"
      trigger={<Button variant="outline" iconLeft={<span>☰</span>}>Open menu</Button>}
      footer={<Button variant="ghost" size="sm" fullWidth>Sign out</Button>}
    >
      <div className="space-y-1 pt-1">
        {['Home', 'Products', 'Pricing', 'Blog', 'Contact'].map((label, i) => (
          <a
            key={label}
            href="#"
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              i === 0
                ? 'bg-primary-subtle text-primary'
                : 'text-text-primary hover:bg-surface-overlay'
            }`}
          >
            {label}
          </a>
        ))}
      </div>
    </NavDrawer>
  );
}

function NavDrawerRightDemo() {
  return (
    <NavDrawer
      title="Cart"
      side="right"
      trigger={<Button variant="outline">🛒 Cart (3)</Button>}
    >
      <div className="space-y-4 pt-1">
        {['Product A — $29', 'Product B — $49', 'Product C — $19'].map((item) => (
          <div key={item} className="flex items-center justify-between text-sm">
            <span className="text-text-primary">{item.split(' — ')[0]}</span>
            <span className="font-medium text-text-primary">{item.split(' — ')[1]}</span>
          </div>
        ))}
        <div className="pt-3 border-t border-border flex justify-between text-sm font-semibold">
          <span>Total</span><span>$97</span>
        </div>
        <Button variant="primary" fullWidth>Checkout</Button>
      </div>
    </NavDrawer>
  );
}

export function buildAppNavData(): ShowcaseComponent[] {
  return [
    {
      id: 'app-nav',
      title: 'AppNav',
      category: 'App',
      abbr: 'AN',
      description: 'Horizontal navigation bar. Renders inline links on desktop and a hamburger that opens a NavDrawer on mobile. Provides logo, navItems and actions slots.',
      filePath: 'modules/app/AppNav.tsx',
      sourceCode: `'use client';
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
}`,
      variants: [
        {
          title: 'Marketing bar (logo + links + CTA)',
          layout: 'stack' as const,
          preview: <AppNavMarketingDemo />,
          code: `<AppNav
  logo={<span className="font-bold text-primary">Acme</span>}
  navItems={[
    { label: 'Home',     href: '/', active: true },
    { label: 'Products', href: '/products' },
    { label: 'Pricing',  href: '/pricing' },
  ]}
>
  <Button variant="ghost" size="sm">Log in</Button>
  <Button variant="primary" size="sm">Sign up</Button>
</AppNav>`,
        },
        {
          title: 'App bar (links + UserMenu)',
          layout: 'stack' as const,
          preview: <AppNavAppDemo />,
          code: `<AppNav
  logo={<span className="font-bold">Dashboard</span>}
  navItems={[
    { label: 'Overview', active: true },
    { label: 'Analytics' },
    { label: 'Reports' },
  ]}
>
  <UserMenu user={currentUser} />
</AppNav>`,
        },
      ],
    },
    {
      id: 'nav-drawer',
      title: 'NavDrawer',
      category: 'App',
      abbr: 'ND',
      description: 'Wrapper that wraps any trigger and children inside a drawer. Manages its own open/closed state. Used as AppNav\'s mobile menu and also works standalone.',
      filePath: 'modules/app/NavDrawer.tsx',
      sourceCode: `'use client';
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
}`,
      variants: [
        {
          title: 'Sol nav (standalone)',
          preview: <NavDrawerLeftDemo />,
          code: `<NavDrawer
  title="Navigation"
  side="left"
  trigger={<Button variant="outline" iconLeft={<MenuIcon />}>Open menu</Button>}
  footer={<Button variant="ghost" size="sm" fullWidth>Sign out</Button>}
>
  <nav className="space-y-1 pt-1">
    <a href="/" className="block px-3 py-2.5 rounded-lg bg-primary-subtle text-primary text-sm">Home</a>
    <a href="/products" className="block px-3 py-2.5 rounded-lg text-text-primary hover:bg-surface-overlay text-sm">Products</a>
  </nav>
</NavDrawer>`,
        },
        {
          title: 'Sağ drawer (cart panel)',
          preview: <NavDrawerRightDemo />,
          code: `<NavDrawer
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
</NavDrawer>`,
        },
      ],
    },
  ];
}
