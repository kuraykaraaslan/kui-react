# TopicCloud

- **id:** `blog-topic-cloud`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/author/TopicCloud.tsx`
- **status:** stable
- **since:** 2026-05

Weighted tag cloud where each topic is sized by its post count.

## Variants

### Mixed counts

```tsx
<TopicCloud topics={topics} />
```

### Compact range

```tsx
<TopicCloud topics={topics} minSize={0.85} maxSize={1.1} />
```

## Full source

```tsx
import { TopicCloud } from '@/modules/domains/blog/author/TopicCloud';
<TopicCloud topics={[{ label: 'React', count: 12 }, …]} />
```
