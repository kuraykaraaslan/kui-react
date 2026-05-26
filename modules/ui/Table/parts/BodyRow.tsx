'use client';
import { cn } from '@/libs/utils/cn';
import type { Column } from '../types';
import { cellClassFor } from '../core/columnHelpers';

// TODO M4: row selection checkbox column injection.
// TODO M5: expand toggle injection, sub-row rendering, inline edit.

export function BodyRow<T extends Record<string, unknown>>({
  row,
  columns,
  onClick,
}: {
  row: T;
  columns: Column<T>[];
  onClick?: (row: T) => void;
}) {
  return (
    <tr
      onClick={onClick ? () => onClick(row) : undefined}
      className={cn(
        'hover:bg-surface-overlay transition-colors',
        onClick && 'cursor-pointer',
      )}
    >
      {columns.map((col) => (
        <td
          key={String(col.key)}
          className={cellClassFor(col, 'px-4 py-3 text-text-primary')}
        >
          {col.render
            ? col.render(row)
            : String(row[col.key as keyof T] ?? '')}
        </td>
      ))}
    </tr>
  );
}
