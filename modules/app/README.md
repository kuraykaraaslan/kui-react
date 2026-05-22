# modules/app

App-level patterns (organisms + page shells). Composes `modules/ui/` primitives into reusable page sections, layouts, and workflows. May own local state. No domain-specific business logic.

## Files

```
AccessibilityKit.tsx
AppBreadcrumbs.tsx
AppCommandBar.tsx
AppDrawer.tsx
AppFooter.tsx
AppNav.tsx
AppShell.tsx
AppSidebar.tsx
AppTopBar.tsx
DetailHeader.tsx
EmptyErrorState.tsx
FilterBar.tsx
Form.tsx
FormField.tsx
GlobalSearch.tsx
InlineAlert.tsx
LoadingState.tsx
NavDrawer.tsx
NotFoundPage.tsx
NotificationSystem.tsx
SectionCard.tsx
SplashScreen.tsx
StepFlow.tsx
StepShell.tsx
ThemeSwitcher.tsx
index.ts
```

## Parity

NextJS-only. EJS layouts under `/home/kuray/02_EJS_Components/views/layouts/` and `views/theme/common/` cover equivalent ground via server-rendered templates.

## Conventions

1. `'use client';` at top.
2. `cn()` from `@/libs/utils/cn`.
3. Named exports only.
4. Shared Tailwind tokens from `app/globals.css`.
5. Icons via `<FontAwesomeIcon>`.
6. Compose `modules/ui/` primitives — never re-implement atoms.
7. No fetch/router calls in component bodies — accept data and callbacks as props.

See [/AGENTS.md](../../AGENTS.md) for the full authoring contract.
