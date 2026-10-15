// WidgetKit: the dashboard widget card, settings templates and widget views (next-boilerplate phase 21).
// Pure parts (settings/*, templates/*, kind.ts) are safe on a server; components are client-only.
export * from './settings/types';
export * from './settings/style';
export * from './settings/engine';
export * from './settings/packs';
export * from './settings/core';
export * from './kind';
export { BUILTIN_KINDS, builtinKind, builtinTemplate } from './templates';
export { BUILTIN_VIEWS } from './views';
export { WidgetCard, formatUpdated } from './WidgetCard';
export type { CardSettings, WidgetCardProps, WidgetCardState } from './WidgetCard';
export { WidgetKitProvider, useWidgetKit, SettingIcon } from './WidgetKitContext';
export type { WidgetKitHost } from './WidgetKitContext';
export { WidgetSettingsEditor } from './WidgetSettingsEditor';
export type { WidgetSettingsEditorProps } from './WidgetSettingsEditor';
export { resolvePlacement, capsOf, toCsvText } from './settings/resolve';
export type { ResolvedPlacement } from './settings/resolve';
export { PlacementCard } from './PlacementCard';
export type { PlacementCardProps } from './PlacementCard';
export { exportBoard, importBoard, nextFreeRow, BOARD_DOCUMENT_FORMAT, BOARD_DOCUMENT_VERSION, GRID_COLUMNS } from './settings/board';
export type { BoardDocument, BoardPlacement, ImportResult } from './settings/board';
export { WidgetBoard } from './WidgetBoard';
export type { WidgetBoardProps } from './WidgetBoard';
export { useLocalSetting } from './useLocalSetting';
export { useNow } from './useNow';
