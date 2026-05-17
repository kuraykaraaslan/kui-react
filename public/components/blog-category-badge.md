# CategoryBadge

- **id:** `blog-category-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/category/CategoryBadge.tsx`
- **status:** stable
- **since:** 2025-03

Renders a category name as a small primary-colored pill. Accepts Pick<Category, "title" | "slug"> — the full Category object is not required.

## Variants

### Categories

```tsx
<CategoryBadge category={{ title: 'Technology', slug: 'technology' }} />
<CategoryBadge category={{ title: 'Design', slug: 'design' }} />
<CategoryBadge category={{ title: 'Career', slug: 'career' }} />
```

### Sizes

```tsx
<CategoryBadge category={category} size="sm" />
<CategoryBadge category={category} size="md" />
<CategoryBadge category={category} size="lg" />
```

## Full source

```tsx
'use client';
import { CategoryBadge } from '@/modules/domains/blog/category/CategoryBadge';

<CategoryBadge category={post.category} />
<CategoryBadge category={{ title: 'Technology', slug: 'technology' }} size="sm" />
```
