'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronUp,
  faChevronDown,
  faSort,
} from '@fortawesome/free-solid-svg-icons';
import type { Column, SortDirection, SortState } from '../types';
import { headerClassFor } from '../core/columnHelpers';
import { FilterPopover } from './FilterPopover';

// TODO M2: column resize handle, drag-reorder handle, pin toggle, hide menu.

export function HeaderCell<T extends Record<string, unknown>>({
  column,
  sort,
  filterValue,
  onToggleSort,
  onSetFilter,
}: {
  column: Column<T>;
  sort: SortState[];
  filterValue: string;
  onToggleSort: (key: string, shiftKey: boolean) => void;
  onSetFilter: (key: string, value: string) => void;
}) {
  const key = String(column.key);
  const sortEntry = sort.find((s) => s.key === key);
  const dir: SortDirection | null = sortEntry?.dir ?? null;
  const ariaSort = column.sortable
    ? dir === 'asc'
      ? 'ascending'
      : dir === 'desc'
        ? 'descending'
        : 'none'
    : undefined;

  const sortOrder =
    sortEntry && sort.length > 1 ? sort.findIndex((s) => s.key === key) + 1 : null;

  const headerClass = headerClassFor(
    column,
    'px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider',
  );

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={cn(
        headerClass,
        column.sortable &&
          'cursor-pointer select-none hover:text-text-primary transition-colors',
      )}
      onClick={
        column.sortable
          ? (e) => onToggleSort(key, e.shiftKey)
          : undefined
      }
    >
      <span className="inline-flex items-center gap-1">
        {column.header}
        {column.sortable && (
          <FontAwesomeIcon
            icon={dir === 'asc' ? faChevronUp : dir === 'desc' ? faChevronDown : faSort}
            className="w-2.5 h-2.5"
            aria-hidden="true"
          />
        )}
        {sortOrder !== null && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-fg px-1"
          >
            {sortOrder}
          </span>
        )}
        {column.filter && (
          <FilterPopover
            column={column}
            value={filterValue}
            onChange={(v) => onSetFilter(key, v)}
          />
        )}
      </span>
    </th>
  );
}
