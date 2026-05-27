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
CommentThread.tsx
DetailHeader.tsx
EmptyErrorState.tsx
FilterBar.tsx
Form.tsx
FormField.tsx
GlobalSearch.tsx
InlineAlert.tsx
LoadingState.tsx
MaintenancePage.tsx
MentionPicker.tsx
NavDrawer.tsx
NotFoundPage.tsx
NotificationSystem.tsx
OnboardingWizard.tsx
SectionCard.tsx
ShareDialog.tsx
SplashScreen.tsx
StepFlow.tsx
StepShell.tsx
ThemeSwitcher.tsx
index.ts
```

## Parity

NextJS-first. The following organisms have pixel-parity EJS partials under `/home/kuray/02_EJS_Components/modules/app/`:

- `MaintenancePage.tsx` ↔ `MaintenancePage.ejs`
- `ShareDialog.tsx` ↔ `ShareDialog.ejs`
- `CommentThread.tsx` ↔ `CommentThread.ejs` (recursive via self-include)
- `MentionPicker.tsx` ↔ `MentionPicker.ejs` (server-render + inline keyboard handler)
- `OnboardingWizard.tsx` ↔ `OnboardingWizard.ejs` (server-rendered, `?step=N` query)

EJS layouts under `views/layouts/` and `views/theme/common/` cover the remaining shells.

## Conventions

1. `'use client';` at top.
2. `cn()` from `@/libs/utils/cn`.
3. Named exports only.
4. Shared Tailwind tokens from `app/globals.css`.
5. Icons via `<FontAwesomeIcon>`.
6. Compose `modules/ui/` primitives — never re-implement atoms.
7. No fetch/router calls in component bodies — accept data and callbacks as props.

See [/AGENTS.md](../../AGENTS.md) for the full authoring contract.
