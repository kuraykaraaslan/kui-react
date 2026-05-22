# app/theme/jobs

Jobs board theme demo — job listings, companies, applications, and salaries pages. Wires `modules/domains/jobs/`.

## Files

```
applications/
companies/
jobs/
jobs.data.ts
layout.tsx
page.tsx
salaries/
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `jobs.data.ts` — passed in as props.
3. Dynamic job/company routes use `generateStaticParams`.
4. Compose `@/modules/domains/jobs/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
5. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
6. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
