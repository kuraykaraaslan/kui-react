# UserMenu

- **id:** `common-user-menu`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/user/UserMenu.tsx`
- **status:** stable
- **since:** 2025-03

Avatar + name + role trigger. Dropdown with Profile, Settings, and Sign out items (hrefs, handlers and labels configurable). `extraItems` (or `items` + `mergeItems`) merge contributed items with the defaults, placed by group and order. Closes on outside click.

## Variants

### Admin user

```tsx
<UserMenu user={{ userId: 'u1', email: 'admin@acme.com', userRole: 'ADMIN', userStatus: 'ACTIVE', userProfile: { name: 'Jane Doe', profilePicture: null } }} />
```

### Custom items

```tsx
<UserMenu user={authorUser} items={[
  { type: 'item', label: 'My Posts', icon: '📝' },
  { type: 'separator' },
  { type: 'item', label: 'Sign Out', icon: '↩️', danger: true },
]} />
```

### Contributed items (merged)

```tsx
// extraItems merge with Profile / Settings / Sign out instead of replacing them.
// No group: joins the account items. No order: after them, before sign out (order 1000).
<UserMenu
  user={currentUser}
  profileHref="/me"
  onSignOut={signOut}
  extraItems={[
    { id: 'dnd', label: 'Do not disturb', group: 'status', order: 10 },
    { id: 'preferences', label: 'Preferences' },
    { id: 'switch-tenant', label: 'Switch workspace', group: 'workspace', order: 600 },
    { id: 'stop-impersonating', label: 'Stop impersonating', group: 'session', order: 900, hidden: !impersonating },
  ]}
/>
```

## Full source

```tsx
'use client';
import { UserMenu } from '@/modules/domains/common/user/UserMenu';

<UserMenu user={currentUser} align="right" />
```
