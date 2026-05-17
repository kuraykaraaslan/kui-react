# AuthorStatsRow

- **id:** `blog-author-stats-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/author/AuthorStatsRow.tsx`
- **status:** stable
- **since:** 2026-05

Horizontal stat strip for an author profile — posts, views, comments, likes, followers.

## Variants

### All stats

```tsx
<AuthorStatsRow stats={{ posts, views, comments, likes, followers }} />
```

### Posts + followers

```tsx
<AuthorStatsRow stats={{ posts: 12, followers: 480 }} />
```

## Full source

```tsx
import { AuthorStatsRow } from '@/modules/domains/blog/author/AuthorStatsRow';
<AuthorStatsRow stats={{ posts: 42, views: 18400 }} />
```
