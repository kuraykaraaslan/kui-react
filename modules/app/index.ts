// Explicit named re-exports for every component in the app layer.
// Using explicit names (not `export * from`) lets bundlers tree-shake
// unused components out of downstream consumer bundles.

// Shell + layout
export { AppShell } from './AppShell';
export { AppSidebar } from './AppSidebar';
export type {
  AppSidebarNavItem,
  AppSidebarNavGroup,
  AppSidebarFooterRenderContext,
} from './AppSidebar';
export { AppTopBar } from './AppTopBar';
export { AppDrawer } from './AppDrawer';
export { AppFooter } from './AppFooter';
export { AppBreadcrumbs } from './AppBreadcrumbs';
export { SectionCard } from './SectionCard';

// Navigation
export { AppNav } from './AppNav';
export type { AppNavItem } from './AppNav';
export { NavDrawer } from './NavDrawer';
export { GlobalSearch } from './GlobalSearch';
export type { SearchResult } from './GlobalSearch';
export { AppCommandBar } from './AppCommandBar';
export type { CommandItem } from './AppCommandBar';

// Theming
export { ThemeSwitcher } from './ThemeSwitcher';

// Forms
export { Form } from './Form';
export { FormField } from './FormField';
export { FilterBar } from './FilterBar';
export type { FilterField, FilterValues } from './FilterBar';
export { StepFlow } from './StepFlow';
export type { StepFlowStep } from './StepFlow';
export { StepShell } from './StepShell';

// Content / detail
export { DetailHeader } from './DetailHeader';
export type { DetailTab } from './DetailHeader';
export { InlineAlert } from './InlineAlert';

// States (loading / empty / error / 404 / splash)
export { LoadingState } from './LoadingState';
export { ErrorState, NoAccessState, NotFoundState } from './EmptyErrorState';
export { NotFoundPage } from './NotFoundPage';
export { SplashScreen } from './SplashScreen';

// Cross-cutting providers / utilities
export { NotificationProvider, notify, toast } from './NotificationSystem';
export {
  Announcer,
  LiveRegion,
  SkipLink,
  Tooltip,
} from './AccessibilityKit';
