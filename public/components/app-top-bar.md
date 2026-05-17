# AppTopBar

- **id:** `app-top-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppTopBar.tsx`
- **status:** stable
- **since:** 2025-03

AppShell'in header slotuna geçilen üst çubuk wrapper'ı. logo slotu sol tarafa; children (GlobalSearch, UserMenu, Button vb.) flex satırda sıralanır.

## Variants

### Arama + actions + kullanıcı

```tsx
<AppTopBar>
  <GlobalSearch
    onSearch={handleSearch}
    onSelect={handleSelect}
    className="flex-1 max-w-sm hidden sm:block"
  />
  <div className="ml-auto flex items-center gap-1">
    <Button variant="ghost" size="sm" iconOnly aria-label="Notifications">🔔</Button>
    <Button variant="ghost" size="sm" iconOnly aria-label="Settings">⚙️</Button>
    <UserMenu user={currentUser} />
  </div>
</AppTopBar>
```

### Logo + action + kullanıcı

```tsx
<AppTopBar logo={<span className="font-black text-primary text-lg">Acme</span>}>
  <div className="ml-auto flex items-center gap-2">
    <Button variant="primary" size="sm">Upgrade</Button>
    <UserMenu user={currentUser} />
  </div>
</AppTopBar>
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

export function AppTopBar({ logo, children, className, ...rest }) {
  return (
    <div className={cn('flex items-center gap-3 flex-1', className)} {...rest}>
      {logo && <div className="shrink-0">{logo}</div>}
      {children}
    </div>
  );
}
```
