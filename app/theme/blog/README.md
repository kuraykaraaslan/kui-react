# app/theme/blog

Blog theme demo — homepage, archive, author pages, and dynamic `[slug]` post detail. Wires `modules/domains/blog/`.

## Files

```
[slug]/
archive/
authors/
blog.data.ts
layout.tsx
page.tsx
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `blog.data.ts` — passed in as props.
3. `[slug]/page.tsx` uses `generateStaticParams` to enumerate posts.
4. Compose `@/modules/domains/blog/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
5. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
6. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
