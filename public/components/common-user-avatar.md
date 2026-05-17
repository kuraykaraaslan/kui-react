# UserAvatar

- **id:** `common-user-avatar`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/user/UserAvatar.tsx`
- **status:** stable
- **since:** 2025-03

Avatar that consumes the SafeUser type. Falls back to initials when no profile picture is set; supports online/away/busy/offline status dots.

## Variants

### Sizes

```tsx
<UserAvatar user={user} size="xs" />
<UserAvatar user={user} size="sm" />
<UserAvatar user={user} size="md" />
<UserAvatar user={user} size="lg" />
<UserAvatar user={user} size="xl" />
```

### Status indicators

```tsx
<UserAvatar user={user} size="lg" status="online" />
<UserAvatar user={user} size="lg" status="away" />
<UserAvatar user={user} size="lg" status="busy" />
<UserAvatar user={user} size="lg" status="offline" />
```

## Full source

```tsx
'use client';
import { UserAvatar } from '@/modules/domains/common/user/UserAvatar';

<UserAvatar user={currentUser} size="md" status="online" />
```
