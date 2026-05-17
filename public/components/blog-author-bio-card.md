# AuthorBioCard

- **id:** `blog-author-bio-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/blog/author/AuthorBioCard.tsx`
- **status:** stable
- **since:** 2026-05

Author profile header with avatar, bio, role/verified badges, and social links.

## Variants

### Verified author with socials

```tsx
<AuthorBioCard name="John Nolan" verified role="Senior Editor" socials={{ twitter, linkedin, github }} />
```

### Minimal author with follow

```tsx
<AuthorBioCard name="Oscar Reed" username="oscarreed" onFollow={…} />
```

## Full source

```tsx
import { AuthorBioCard } from '@/modules/domains/blog/author/AuthorBioCard';
<AuthorBioCard name="John Nolan" biography="…" socials={{ twitter: '…' }} />
```
