# app/theme/fintech

Fintech dashboard theme demo — wallets, cards, portfolio, transactions, and transfer pages. Wires `modules/domains/fintech/`.

## Files

```
cards/
fintech.data.ts
layout.tsx
page.tsx
portfolio/
transactions/
transfer/
wallets/
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `fintech.data.ts` — passed in as props.
3. Compose `@/modules/domains/fintech/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
4. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
5. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
