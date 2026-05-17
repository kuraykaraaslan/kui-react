# ForumCategoryCard

- **id:** `forum-category-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/forum/category/ForumCategoryCard.tsx`
- **status:** stable
- **since:** 2026-05

Hoverable card displaying a forum category with icon, description, topic/post stats, and last activity timestamp.

## Variants

### With stats and activity

```tsx
<ForumCategoryCard category={category} href="/forum/tech-help" />
```

### Minimal (no stats)

```tsx
<ForumCategoryCard category={{ categoryId, title, slug }} />
```

## Full source

```tsx
import { ForumCategoryCard } from '@/modules/domains/forum/category/ForumCategoryCard';
<ForumCategoryCard category={category} href="/forum/tech-help" />
```
