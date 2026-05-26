'use client';
// Backwards-compatible shim — the implementation now lives in
// `modules/ui/Table/`. Existing `import { Table, TableColumn } from '@/modules/ui/Table'`
// keeps working unchanged. Also re-exports the unified `DataTable` family
// types so consumers can pull everything from `@/modules/ui/Table`.
export { Table } from './Table/index';
export type {
  TableColumn,
  Column,
  SortDirection,
  SortState,
  FilterState,
  PaginationState,
  ColumnFilterConfig,
  DataTableMode,
  DataTableStateValue,
  DataTableFetchArgs,
  DataTableFetchResult,
  DataTableMessages,
} from './Table/index';
