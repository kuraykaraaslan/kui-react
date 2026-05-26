'use client';
// Unified Table family — public entry point.
//
// Exposes:
// - <Table />              — low-level "dumb" table primitive (named export from ./Table)
// - <DataTable />          — unified rich table (modes: static | paginated | server)
// - <AdvancedDataTable />  — @deprecated thin wrapper rendering the legacy advanced view
// - <ServerDataTable />    — @deprecated thin wrapper rendering the legacy server-controlled card
//
// Older `modules/ui/{DataTable,AdvancedDataTable,ServerDataTable}.tsx` re-export
// from here so existing consumers keep working without source changes.

export { Table } from './Table';
export { DataTable } from './DataTable';
export type {
  DataTableProps,
  AdvancedDataTableRow,
} from './DataTable';
export type {
  Column,
  TableColumn,
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
} from './types';
export { DEFAULT_MESSAGES } from './types';

// Core hooks — exposed for advanced consumers building bespoke layouts.
export { useTable } from './core/useTable';
export type { UseTableArgs, UseTableReturn } from './core/useTable';
export { useServerTable } from './core/useServerTable';
export type {
  UseServerTableArgs,
  UseServerTableReturn,
} from './core/useServerTable';

// ---------------------------------------------------------------------------
// Backwards-compatible thin wrappers for the deprecated names.
// ---------------------------------------------------------------------------

import { DataTable as UnifiedDataTable } from './DataTable';
import type { DataTableProps, AdvancedDataTableRow } from './DataTable';
import type { Column } from './types';
import type { ReactNode } from 'react';

/**
 * @deprecated Use `<DataTable />` with selection / expandable props (coming in M4/M5).
 * Will be removed in a future major. Kept as a thin re-export over the unified
 * implementation so existing consumers keep working.
 */
export function AdvancedDataTable<T extends Record<string, unknown>>(props: {
  columns: Column<T>[];
  rows: AdvancedDataTableRow<T>[];
  caption?: string;
  selectable?: boolean;
  stickyHeader?: boolean;
  emptyMessage?: string;
  onSelectionChange?: (selected: number[]) => void;
  className?: string;
}) {
  return (
    <UnifiedDataTable<T>
      columns={props.columns}
      legacyAdvancedRows={props.rows}
      caption={props.caption}
      selectable={props.selectable}
      stickyHeader={props.stickyHeader}
      emptyMessage={props.emptyMessage}
      onSelectionChange={props.onSelectionChange}
      className={props.className}
    />
  );
}

/**
 * @deprecated Use `<DataTable mode="server" fetchPage={...} />`. Kept as a thin
 * wrapper for source-compatible migration.
 */
export function ServerDataTable<T extends Record<string, unknown>>(props: {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  page: number;
  totalPages: number;
  total?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  toolbar?: ReactNode;
  className?: string;
  caption?: string;
}) {
  return (
    <UnifiedDataTable<T>
      columns={props.columns}
      rows={props.rows}
      caption={props.caption}
      emptyMessage={props.emptyMessage}
      onRowClick={props.onRowClick}
      className={props.className}
      serverControlled={{
        page: props.page,
        totalPages: props.totalPages,
        total: props.total,
        pageSize: props.pageSize,
        onPageChange: props.onPageChange,
        getRowKey: props.getRowKey,
        loading: props.loading,
        title: props.title,
        subtitle: props.subtitle,
        headerRight: props.headerRight,
        toolbar: props.toolbar,
      }}
    />
  );
}

export type { DataTableProps as DataTablePropsUnified };
