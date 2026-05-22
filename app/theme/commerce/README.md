# app/theme/commerce

E-commerce theme demo — product listing/detail, cart, and orders pages. Wires `modules/domains/commerce/`.

## Files

```
cart/
commerce.data.ts
layout.tsx
orders/
page.tsx
products/
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `commerce.data.ts` — passed in as props.
3. Dynamic product/order routes use `generateStaticParams`.
4. Compose `@/modules/domains/commerce/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
5. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
6. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
