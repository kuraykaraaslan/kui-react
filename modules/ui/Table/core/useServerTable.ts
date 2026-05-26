'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  DataTableFetchArgs,
  DataTableFetchResult,
  FilterState,
  SortState,
} from '../types';
import { nextSortState } from './useTable';

// TODO M3: `keepPreviousData` semantic + abort-on-stale request handling.
// TODO M4: server-side row selection state synchronization across pages.

export type UseServerTableArgs<T> = {
  fetchPage: (args: DataTableFetchArgs) => Promise<DataTableFetchResult<T>>;
  initialPageSize?: number;
  initialSort?: SortState[];
  initialSearch?: string;
  initialFilters?: FilterState;
  /** Manual override of `state` for the consumer (e.g. external error). */
  externalError?: string | null;
};

export function useServerTable<T>({
  fetchPage,
  initialPageSize = 10,
  initialSort = [],
  initialSearch = '',
  initialFilters = {},
  externalError = null,
}: UseServerTableArgs<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<SortState[]>(initialSort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(externalError);

  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;

  // Track the in-flight request key so a stale response doesn't clobber a newer
  // one. M1: just discard out-of-order responses. M3 will swap in AbortController.
  const reqIdRef = useRef(0);

  useEffect(() => {
    const id = ++reqIdRef.current;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchRef
      .current({ page, pageSize, sort, search, filters })
      .then((res) => {
        if (cancelled || id !== reqIdRef.current) return;
        setRows(res.rows);
        setTotal(res.total);
      })
      .catch((err: unknown) => {
        if (cancelled || id !== reqIdRef.current) return;
        setError(err instanceof Error ? err.message : 'Fetch failed');
      })
      .finally(() => {
        if (cancelled || id !== reqIdRef.current) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, sort, search, filters]);

  useEffect(() => {
    setError(externalError);
  }, [externalError]);

  const toggleSort = useCallback((key: string, shiftKey: boolean) => {
    setSort((curr) => nextSortState(curr, key, shiftKey));
    setPage(1);
  }, []);

  const setColumnFilter = useCallback((key: string, value: string) => {
    setFilters((curr) => {
      if (!value) {
        const next = { ...curr };
        delete next[key];
        return next;
      }
      return { ...curr, [key]: value };
    });
    setPage(1);
  }, []);

  const setGlobalSearch = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const changePageSize = useCallback((n: number) => {
    setPageSize(n);
    setPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    rows,
    total,
    totalPages,
    page,
    pageSize,
    sort,
    search,
    filters,
    loading,
    error,
    toggleSort,
    setColumnFilter,
    setGlobalSearch,
    changePageSize,
    setPage,
    setSort,
    setFilters,
  };
}

export type UseServerTableReturn<T> = ReturnType<typeof useServerTable<T>>;
