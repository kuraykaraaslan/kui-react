# UserMenu

- **id:** `common-user-menu`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/user/UserMenu.tsx`
- **status:** stable
- **since:** 2025-03

Avatar + name + role trigger. Dropdown with Profile, Settings, and Sign out items. Closes on outside click.

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

## Full source

```tsx
'use client';
import { UserMenu } from '@/modules/domains/common/user/UserMenu';

<UserMenu user={currentUser} align="right" />
```
