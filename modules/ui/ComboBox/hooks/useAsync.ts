'use client';
// useAsync — debounced async search + in-memory cache + AbortController.
// M1 contract:
//   - debounceMs (default 300)
//   - AbortController cancels in-flight on every new query / unmount
//   - cache keyed by query string with 5-minute TTL
//   - exposes { results, loading, refresh } for the listbox to consume

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComboBoxOption } from '../types';

type AsyncSearchFn = (
  query: string,
  signal?: AbortSignal
) => ComboBoxOption[] | Promise<ComboBoxOption[]>;

type CacheEntry = { ts: number; data: ComboBoxOption[] };

const TTL_MS = 5 * 60 * 1000; // 5 minutes

export type UseAsyncResult = {
  results: ComboBoxOption[] | null; // null = no async result yet -> caller falls back to local options
  loading: boolean;
  // appendResults — used by useLoadMore to merge cursor pages into the same cache key.
  appendResults: (next: ComboBoxOption[]) => void;
};

export function useAsync(
  enabled: boolean,
  query: string,
  onSearch: AsyncSearchFn | undefined,
  debounceMs = 300
): UseAsyncResult {
  const [results, setResults] = useState<ComboBoxOption[] | null>(null);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cacheKey = query.trim().toLowerCase();

  useEffect(() => {
    if (!enabled || !onSearch) return;

    // Cache hit? skip the network round-trip.
    const hit = cacheRef.current.get(cacheKey);
    if (hit && Date.now() - hit.ts < TTL_MS) {
      setResults(hit.data);
      setLoading(false);
      return;
    }

    // Cancel any in-flight request & debounce timer.
    abortRef.current?.abort();
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    debounceRef.current = setTimeout(() => {
      let value: ComboBoxOption[] | Promise<ComboBoxOption[]>;
      try {
        value = onSearch(query.trim(), controller.signal);
      } catch (err) {
        if (!controller.signal.aborted) {
          setResults([]);
          setLoading(false);
        }
        return;
      }

      Promise.resolve(value)
        .then((next) => {
          if (controller.signal.aborted) return;
          cacheRef.current.set(cacheKey, { ts: Date.now(), data: next });
          setResults(next);
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          // Suppress AbortError noise from fetch().
          const name = (err as { name?: string } | null)?.name;
          if (name === 'AbortError') return;
          setResults([]);
        })
        .finally(() => {
          if (controller.signal.aborted) return;
          setLoading(false);
        });
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      controller.abort();
    };
  }, [enabled, cacheKey, query, onSearch, debounceMs]);

  // Reset when async is disabled (so consumers fall back to local options).
  useEffect(() => {
    if (!enabled) {
      setResults(null);
      setLoading(false);
    }
  }, [enabled]);

  const appendResults = useCallback((next: ComboBoxOption[]) => {
    setResults((prev) => {
      const merged = prev ? [...prev, ...next] : next;
      cacheRef.current.set(cacheKey, { ts: Date.now(), data: merged });
      return merged;
    });
  }, [cacheKey]);

  return useMemo(() => ({ results, loading, appendResults }), [results, loading, appendResults]);
}
