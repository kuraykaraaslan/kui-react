# app/theme/common

Common / cross-domain theme demo — auth flows, account, notifications, cart, payment, and 404 pages. Wires `modules/domains/common/`.

## Files

```
account/
auth/
cart/
common.data.ts
layout.tsx
not-found/
notifications/
page.tsx
payment/
```

## Parity

Shared with EJS. Counterpart: `/home/kuray/02_EJS_Components/views/theme/common/`. Keep auth and account flows aligned with the EJS version.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `common.data.ts` — passed in as props.
3. Compose `@/modules/domains/common/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
4. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
5. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
