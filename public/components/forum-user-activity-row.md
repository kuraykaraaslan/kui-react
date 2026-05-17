# UserActivityRow

- **id:** `forum-user-activity-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/forum/user/UserActivityRow.tsx`
- **status:** stable
- **since:** 2026-05

Single activity entry in a user feed: kind icon, action verb, topic link, excerpt, time-ago.

## Variants

### All four kinds

```tsx
<UserActivityRow kind="reply" topicTitle="…" topicHref="…" excerpt="…" createdAt={date} />
```

## Full source

```tsx
import { UserActivityRow } from '@/modules/domains/forum/user/UserActivityRow';
<UserActivityRow kind="reply" topicTitle="…" excerpt="…" createdAt={date} />
```
