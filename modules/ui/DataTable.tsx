'use client';
// Backwards-compatible shim — `DataTable` now lives in `modules/ui/Table/`.
// Defaults to `mode="paginated"` so existing consumers see no behavioral
// change. Use the new modes (`static` | `server`) via `<DataTable mode="…" />`.
export { DataTable } from './Table/index';
export type { TableColumn } from './Table/index';
export type { DataTableProps } from './Table/index';
