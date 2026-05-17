# MegaMenu

- **id:** `landing-mega-menu`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/nav/MegaMenu.tsx`
- **status:** stable
- **since:** 2026-05

Compound component for hover-activated mega menus. Composed of MegaMenu.Root, Trigger, Panel, Section, Item, Footer, and FeaturedCard sub-components. Use useMegaMenu() to share open/close state across multiple menus. Includes an invisible hover bridge that prevents the gap between the trigger and panel from closing the menu.

## Variants

### Product menu (with FeaturedCard)

```tsx
<MegaMenu.Root id="product" openId={openId} onOpen={open} onScheduleClose={scheduleClose}>
  <MegaMenu.Trigger label="Product" isOpen={openId === 'product'} />
  {openId === 'product' && (
    <MegaMenu.Panel id="product" onOpen={open} onScheduleClose={scheduleClose} width="w-[560px]">
      ...
    </MegaMenu.Panel>
  )}
</MegaMenu.Root>
```

### Resources menu (2-column grid)

```tsx
<MegaMenu.Section label="Resources">
  <div className="grid grid-cols-2 gap-0.5">
    {items.map((item) => <MegaMenu.Item key={item.label} {...item} iconVariant="neutral" />)}
  </div>
</MegaMenu.Section>
```

## Full source

```tsx
'use client';
import { MegaMenu, useMegaMenu } from '@/modules/domains/landing/nav/MegaMenu';

function Nav() {
  const { openId, open, scheduleClose, close } = useMegaMenu();
  return (
    <MegaMenu.Root id="product" openId={openId} onOpen={open} onScheduleClose={scheduleClose}>
      <MegaMenu.Trigger label="Product" isOpen={openId === 'product'} />
      {openId === 'product' && (
        <MegaMenu.Panel id="product" onOpen={open} onScheduleClose={scheduleClose} width="w-[560px]">
          <div className="grid grid-cols-[1fr_176px]">
            <MegaMenu.Section label="Platform">
              {items.map((item) => (
                <MegaMenu.Item key={item.label} {...item} iconVariant="primary" onClick={close} />
              ))}
              <MegaMenu.Footer label="See all features" href="/features" onClick={close} />
            </MegaMenu.Section>
            <MegaMenu.FeaturedCard
              eyebrow="What's new"
              title="Velox 2.0"
              description="Faster builds, smarter previews."
              primaryCta={{ label: 'Start free', href: '/pricing', onClick: close }}
            />
          </div>
        </MegaMenu.Panel>
      )}
    </MegaMenu.Root>
  );
}
```
