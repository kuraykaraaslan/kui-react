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
  /**
   * Column heading.
   *
   * Widened from `string` to `ReactNode` so a header can carry a control —
   * a select-all checkbox, a help tooltip — without the consumer overlaying
   * one absolutely and hoping the alignment holds. Every existing `string`
   * header keeps working unchanged.
   */
  header: ReactNode;
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
  /** Accessible label of each row's actions button. */
  rowActions?: string;
  /** Screen-reader heading of the row-actions column. */
  actionsColumn?: string;
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
  rowActions: 'Row actions',
  actionsColumn: 'Actions',
};

/**
 * One entry of a row's actions menu (`DataTable` `rowActions`). Every per-row field also takes
 * a function of the row, so one descriptor list serves the whole table.
 */
export type DataTableRowAction<T> = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: (row: T) => void;
  /** Makes the action a link. */
  href?: string | ((row: T) => string | undefined);
  hidden?: boolean | ((row: T) => boolean);
  disabled?: boolean | ((row: T) => boolean);
  /** Shown under the label (and as its tooltip) while the action is disabled. */
  disabledReason?: string | ((row: T) => string | undefined);
  /** Danger styling, for delete-like actions. */
  destructive?: boolean;
  /** Position in the menu, like CSS `order`: missing counts as 0. */
  order?: number;
  /** Actions of a group sit together, split from other groups by a separator. */
  group?: string;
};
