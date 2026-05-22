# app/theme/ai

AI workspace theme demo — model catalog, playground/chat, and usage analytics pages. Wires `modules/domains/ai/`.

## Files

```
ai.data.ts
layout.tsx
page.tsx
models/
playground/
usage/
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `ai.data.ts` — passed in as props.
3. Compose `@/modules/domains/ai/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
4. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
5. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
