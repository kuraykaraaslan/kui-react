# PostComposer

- **id:** `forum-post-composer`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/forum/post/PostComposer.tsx`
- **status:** stable
- **since:** 2026-05

Topic creation form: title + category + write/preview tabs + tag input. Composes UI primitives.

## Variants

### Default composer

```tsx
<PostComposer categories={[{ value: 'tech-help', label: 'Tech Help' }]} />
```

### Pre-filled draft

```tsx
<PostComposer initialTitle="…" initialBody="…" initialTags={['nextjs', 'devops']} />
```

## Full source

```tsx
import { PostComposer } from '@/modules/domains/forum/post/PostComposer';
<PostComposer categories={[{ value, label }]} onSubmit={(data) => ...} />
```
