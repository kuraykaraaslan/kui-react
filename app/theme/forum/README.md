# app/theme/forum

Discussion forum theme demo — categories, topics, and forum users pages. Wires `modules/domains/forum/`.

## Files

```
categories/
forum.data.ts
layout.tsx
page.tsx
topics/
users/
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `forum.data.ts` — passed in as props.
3. Dynamic category/topic/user routes use `generateStaticParams`.
4. Compose `@/modules/domains/forum/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
5. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
6. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
