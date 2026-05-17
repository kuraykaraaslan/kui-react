# ForumUserCard

- **id:** `forum-user-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/forum/user/ForumUserCard.tsx`
- **status:** stable
- **since:** 2026-05

Profile card for a forum user: avatar with online dot, role badge, joined / posts / reputation.

## Variants

### Moderator, online

```tsx
<ForumUserCard user={{ username: 'mod_jane', role: 'moderator', online: true, postCount: 892, reputation: 4280 }} />
```

### Regular member, offline

```tsx
<ForumUserCard user={{ username: 'rustacean99', role: 'member', online: false }} />
```

## Full source

```tsx
import { ForumUserCard } from '@/modules/domains/forum/user/ForumUserCard';
<ForumUserCard user={user} onFollow={...} onMessage={...} />
```
