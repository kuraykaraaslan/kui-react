// Shared types for the unified Table / DataTable family.
// All public type names live here so consumers can import a single namespace.

import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export type SortState = {
  /** Column key. */
  key: string;
  /** Direction. */
  dir: SortDirection;
};

export type ColumnFilterKind = 'text' | 'select';

export type ColumnFilterConfig = {
  /** Filter kind — M1 only supports 'text' and 'select'. */
  kind: ColumnFilterKind;
  /** Placeholder text for text inputs. */
  placeholder?: string;
  /** Options for 'select' kind. */
  options?: { label: string; value: string }[];
};

export type FilterState = Record<string, string>;

export type PaginationState = {
  /** 1-based page index. */
  page: number;
  /** Rows per page. */
  pageSize: number;
};

/**
 * Column definition shared by every table mode.
 * Backwards compatible with the legacy `TableColumn<T>` shape.
 */
export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  /** M1: per-column filter popover config. Set to truthy to enable. */
  filter?: ColumnFilterConfig;
  /** Optional CSS class for the `<th>`. */
  thClass?: string;
  /** Optional CSS class for the `<td>`. */
  tdClass?: string;
};

/**
 * Backwards-compatible alias preserved so legacy `TableColumn<T>` imports
 * keep working without source changes.
 */
export type TableColumn<T> = Column<T>;

export type DataTableMode = 'static' | 'paginated' | 'server';

export type DataTableStateValue = 'empty' | 'loading' | 'error' | 'ready';

export type DataTableFetchArgs = {
  page: number;
  pageSize: number;
  sort: SortState[];
  search: string;
  filters: FilterState;
};

export type DataTableFetchResult<T> = {
  rows: T[];
  total: number;
  cursor?: string;
};

export type DataTableMessages = {
  empty: string;
  loading: string;
  error: string;
  searchPlaceholder: string;
  rowsPerPage: string;
  filter: string;
  clearFilter: string;
  apply: string;
};

export const DEFAULT_MESSAGES: DataTableMessages = {
  empty: 'No results found.',
  loading: 'Loading…',
  error: 'Something went wrong.',
  searchPlaceholder: 'Search…',
  rowsPerPage: 'Rows per page:',
  filter: 'Filter',
  clearFilter: 'Clear',
  apply: 'Apply',
};
