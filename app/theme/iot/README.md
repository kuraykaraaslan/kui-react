# app/theme/iot

IoT platform theme demo — workspaces, devices, rulesets, and alerts pages. Wires `modules/domains/iot/`.

## Files

```
alerts/
devices/
iot.data.ts
layout.tsx
page.tsx
rulesets/
workspaces/
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `iot.data.ts` — passed in as props.
3. Dynamic device/workspace/ruleset routes use `generateStaticParams`.
4. Compose `@/modules/domains/iot/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
5. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
6. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
