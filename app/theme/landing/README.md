# app/theme/landing

Marketing landing theme demo — homepage, features, pricing, about, and case studies pages. Wires `modules/domains/landing/`.

## Files

```
about/
case-studies/
features/
landing.data.ts
layout.tsx
page.tsx
pricing/
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data (copy + assets) in `landing.data.ts` — passed in as props; no hardcoded marketing strings inside components.
3. Compose `@/modules/domains/landing/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
4. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
5. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
