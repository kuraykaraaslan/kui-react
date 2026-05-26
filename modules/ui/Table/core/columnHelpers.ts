// Small helpers shared by every Table mode.

import type { Column } from '../types';

export const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

/**
 * Returns the standard set of <th> classes for a column header.
 */
export function headerClassFor<T>(col: Column<T>, base: string): string {
  const parts: string[] = [base];
  if (col.align === 'center') parts.push(alignClass.center);
  else if (col.align === 'right') parts.push(alignClass.right);
  else parts.push(alignClass.left);
  if (col.thClass) parts.push(col.thClass);
  return parts.join(' ');
}

/**
 * Returns the standard set of <td> classes for a column cell.
 */
export function cellClassFor<T>(col: Column<T>, base: string): string {
  const parts: string[] = [base];
  if (col.align === 'center') parts.push(alignClass.center);
  else if (col.align === 'right') parts.push(alignClass.right);
  if (col.tdClass) parts.push(col.tdClass);
  return parts.join(' ');
}

/**
 * Returns the stringified raw value of a column cell (no `render` applied).
 */
export function rawCellValue<T extends Record<string, unknown>>(
  row: T,
  col: Column<T>,
): string {
  const v = row[col.key as keyof T];
  return v === undefined || v === null ? '' : String(v);
}
