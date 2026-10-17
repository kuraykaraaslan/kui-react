# UserMenu

- **id:** `common-user-menu`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/user/UserMenu.tsx`
- **status:** stable
- **since:** 2025-03

Avatar + name + role trigger (the role line only when the user has one); the chevron turns over while the menu is open. Dropdown with Profile, Settings, and Sign out items (hrefs, handlers and labels configurable). `extraItems` (or `items` + `mergeItems`) merge contributed items with the defaults, placed by group and order; a hidden item with a built-in id leaves that item out. `user` takes a SafeUser or just an email, an optional role and a profile. `portal` renders the open menu in document.body so a sticky or clipping top bar cannot cut it off. Closes on outside click and Escape.

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

### Session user, no Settings, in a portal

```tsx
// A session user (email + profile, no role): the trigger shows the name alone.
// A hidden item with a built-in id leaves Settings out; portal opens the menu in
// document.body so a sticky top bar cannot clip it.
<UserMenu
  user={{ email: 'sam@acme.com', userProfile: { name: 'Sam Lee' } }}
  profileHref="/me"
  signOutHref="/logout"
  mergeItems
  items={[{ id: 'settings', label: 'Settings', hidden: true }]}
  portal
/>
```

## Full source

```tsx
'use client';
import { UserMenu } from '@/modules/domains/common/user/UserMenu';

<UserMenu user={currentUser} align="right" />
```
