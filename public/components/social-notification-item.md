# SocialNotificationItem

- **id:** `social-notification-item`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/social/notification/SocialNotificationItem.tsx`
- **status:** stable
- **since:** 2026-05

Notification list item showing actor avatar, type icon overlay, message and timestamp. Unread items have a distinct background and dot indicator.

## Variants

### Unread (like) + Read (follow)

```tsx
<div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
  <SocialNotificationItem notification={{ type: 'LIKE',   isRead: false, actor: user, message: 'liked your post', ... }} />
  <SocialNotificationItem notification={{ type: 'FOLLOW', isRead: true,  actor: user, message: 'started following you', ... }} />
</div>
```

### All notification types

```tsx
{(['LIKE', 'COMMENT', 'FOLLOW', 'MENTION', 'SHARE'] as const).map((type) => (
  <SocialNotificationItem key={type} notification={{ type, isRead: false, actor: user, ... }} />
))}
```

## Full source

```tsx
import { SocialNotificationItem } from '@/modules/domains/social/notification/SocialNotificationItem';
<SocialNotificationItem notification={notification} />
```
