# UserProfileCard

- **id:** `common-user-profile-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/user/UserProfileCard.tsx`
- **status:** stable
- **since:** 2025-04

Profile card with cover banner, avatar, display name, username, bio, role and status badges, and an optional actions slot.

## Variants

### Full profile

```tsx
<UserProfileCard user={user} actions={<Button variant="outline" size="sm">Edit</Button>} />
```

### No profile data

```tsx
<UserProfileCard user={user} />
```

## Full source

```tsx
'use client';
import { UserProfileCard } from '@/modules/domains/common/user/UserProfileCard';

<UserProfileCard
  user={currentUser}
  actions={<Button variant="outline" size="sm">Edit</Button>}
/>
```
