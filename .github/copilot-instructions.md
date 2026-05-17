# GitHub Copilot instructions — kui-react

> Canonical source: [AGENTS.md](../AGENTS.md). When this file and AGENTS.md disagree, AGENTS.md wins.

This is **not** stock Next.js. APIs, conventions, and file structure differ from Copilot's training defaults. Use the AI-facing catalog below before suggesting code.

## Discovery before generation

| Endpoint | Purpose |
| --- | --- |
| `/api/registry?index=1` | Full catalog (no source) — ~5x smaller, fast to scan |
| `/api/registry` | Full catalog with inline source per component |
| `/llms-full.txt` | Markdown dump for context windows |
| `public/registry/components.json` | Offline static snapshot |
| `public/components/<id>.md` | One markdown file per component for chunked retrieval |

Filter `components[]` by `layer` (`ui` \| `app` \| `domain` \| `theme`), `category`, `name`, or `filePath`. Use `composes[]` recursively to find dependencies; `usedBy[]` is the inverse index.

## Hard rules

1. **`'use client';`** at the top of every file in `modules/ui/`, `modules/app/`, `modules/domains/`. Theme `layout.tsx` is client; theme `page.tsx` is server unless it owns local state.
2. **Named exports only.** No default exports (excluding `next/dynamic` wrappers).
3. **`cn()`** from `@/libs/utils/cn` for classNames — never template literals, never string concatenation.
4. **Token-only styling.** `bg-primary`, `text-text-secondary`, `border-border-focus`. Never raw hex / rgb / hsl.
5. **Font Awesome icons only.** Named imports from `@fortawesome/free-solid-svg-icons` / `@fortawesome/free-brands-svg-icons`. Never `lucide-react`, `heroicons`, `react-icons`, inline SVG, or emoji as icons.
6. **Accessibility on every interactive element:**
   - `focus-visible:ring-2 focus-visible:ring-border-focus`
   - `aria-busy` / `aria-invalid` / `aria-describedby` / `aria-pressed` / `aria-expanded` as the pattern requires
   - `disabled:opacity-50 disabled:cursor-not-allowed`
   - `aria-hidden="true"` on decorative `<FontAwesomeIcon>`
7. **Spread `...rest`** to the root element.
8. **No business logic in `modules/ui/`.** Data fetching, routing, external calls belong in `modules/app/` or `modules/domains/`.

## Where new code goes

- Single-purpose primitive → `modules/ui/`
- Composed UI widget → `modules/ui/`
- Full page section / layout shell / form → `modules/app/`
- Industry-specific component → `modules/domains/<vertical>/`
- New industry vertical → also add `modules/showcase/data/sections/domain-<vertical>.showcase.tsx` and entries in `modules/showcase/data/showcase.menu.ts` (the sidebar is static-driven)
- Full multi-page demo → `app/theme/<vertical>/`

## Path aliases

- `@/` → project root
- `@/modules/ui/<Component>` → atoms + molecules
- `@/modules/app/<Component>` → organisms + page shells
- `@/modules/domains/<vertical>` → industry vertical barrel
- `@/libs/utils/cn` → className utility

## Component template

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

type Variant = 'primary' | 'secondary';
const variantClasses: Record<Variant, string> = {
  primary:   'bg-primary text-primary-fg hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-fg hover:bg-secondary-hover',
};

type Props = { variant?: Variant; className?: string } & React.HTMLAttributes<HTMLDivElement>;

export function MyComponent({ variant = 'primary', className, children, ...rest }: Props) {
  return (
    <div
      className={cn(
        'rounded-md px-4 py-2 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
```

## Don't

- Don't install new icon libraries (`lucide-react`, `heroicons`, `react-icons`).
- Don't introduce a CSS-in-JS runtime (`styled-components`, `emotion`). Tailwind + CSS variables only.
- Don't fetch real data in `modules/ui/` components.
- Don't suggest a new component before checking the registry for an existing one.
