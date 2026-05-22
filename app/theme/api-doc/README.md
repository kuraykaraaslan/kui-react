# app/theme/api-doc

API documentation theme demo — endpoint browser and auth-scheme pages. Wires `modules/domains/api-doc/`.

## Files

```
api-doc.data.ts
auth/
layout.tsx
page.tsx
```

## Parity

Shared with EJS. Counterpart: `/home/kuray/02_EJS_Components/views/theme/api-doc/`. Keep navigation and section structure aligned with the EJS version.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `api-doc.data.ts` — passed in as props.
3. Compose `@/modules/domains/api-doc/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
4. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
5. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
