# UserMenu

- **id:** `user-menu`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/UserMenu.tsx`
- **status:** stable
- **since:** 2025-03

User dropdown opened by a trigger showing avatar, name and role. Accepts a SafeUser prop; the dropdown header shows the name and email.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Varsayılan (isim + e-posta + rol)

```tsx
<UserMenu
  user={{
    userId: 'u1',
    email: 'jane@acme.com',
    userRole: 'Admin',
    userStatus: 'ACTIVE',
    userPreferences: null,
    userProfile: { name: 'Jane Doe', profilePicture: null },
  }}
/>
```

### Özel items

```tsx
<UserMenu
  user={currentUser}
  items={[
    { label: 'View Profile',  icon: '👤', onClick: () => {} },
    { label: 'Billing',       icon: '💳', onClick: () => {} },
    { type: 'separator' },
    { label: 'Sign out',      icon: '↩️', danger: true, onClick: () => {} },
  ]}
/>
```

## Full source

```tsx
'use client';
import { Avatar } from '@/modules/ui/Avatar';
import { DropdownMenu } from '@/modules/ui/DropdownMenu';

export function UserMenu({ user, items, align = 'right' }) {
  const displayName = user.userProfile?.name ?? user.name ?? user.email;
  const avatar      = user.userProfile?.profilePicture ?? null;

  const defaultItems = items ?? [
    { type: 'item', label: 'Profile',  icon: '👤' },
    { type: 'item', label: 'Settings', icon: '⚙️' },
    { type: 'separator' },
    { type: 'item', label: 'Sign out', icon: '↩️', danger: true },
  ];

  const header = (
    <div className="px-3 py-2.5">
      <p className="text-sm font-semibold text-text-primary truncate">{displayName}</p>
      <p className="text-xs text-text-secondary truncate">{user.email}</p>
    </div>
  );

  const trigger = (
    <button type="button"
      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      <Avatar src={avatar} name={displayName} size="sm" />
      <div className="hidden sm:block text-left min-w-0">
        <p className="text-sm font-medium text-text-primary truncate max-w-[8rem]">{displayName}</p>
        <p className="text-xs text-text-secondary truncate">{user.userRole}</p>
      </div>
      <span aria-hidden="true" className="text-text-disabled text-xs hidden sm:block">▾</span>
    </button>
  );

  return <DropdownMenu trigger={trigger} items={defaultItems} header={header} align={align} />;
}
```
