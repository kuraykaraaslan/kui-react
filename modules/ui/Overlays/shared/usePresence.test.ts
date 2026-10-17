import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePresence } from './usePresence';

describe('usePresence', () => {
  afterEach(() => vi.useRealTimers());

  it('mounts at once on open and unmounts 250ms after close', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ open }) => usePresence(open), { initialProps: { open: false } });
    expect(result.current).toEqual({ mounted: false, state: 'closed' });
    rerender({ open: true });
    expect(result.current).toEqual({ mounted: true, state: 'open' });
    rerender({ open: false });
    expect(result.current).toEqual({ mounted: true, state: 'closing' });
    act(() => vi.advanceTimersByTime(249));
    expect(result.current.state).toBe('closing');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toEqual({ mounted: false, state: 'closed' });
  });

  it('arms no timer while closed, so nothing can close an overlay opened right after mount', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ open }) => usePresence(open), { initialProps: { open: false } });
    expect(vi.getTimerCount()).toBe(0);
    rerender({ open: true });
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toEqual({ mounted: true, state: 'open' });
  });

  it('reopening during the exit animation keeps the overlay open', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ open }) => usePresence(open), { initialProps: { open: true } });
    rerender({ open: false });
    act(() => vi.advanceTimersByTime(100));
    rerender({ open: true });
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toEqual({ mounted: true, state: 'open' });
  });
});
