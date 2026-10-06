import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsyncControl } from './useAsyncControl';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('useAsyncControl', () => {
  it('shows the requested value while pending, then confirms and returns to idle', async () => {
    let resolve!: () => void;
    const commit = vi.fn(() => new Promise<void>((r) => { resolve = r; }));
    const { result } = renderHook(() => useAsyncControl<number>({ value: 1, commit }));
    expect(result.current.state).toBe('idle');
    act(() => result.current.set(5));
    expect(result.current.state).toBe('pending');
    expect(result.current.displayValue).toBe(5);
    await act(async () => { resolve(); });
    expect(result.current.state).toBe('confirmed');
    await act(async () => { vi.advanceTimersByTime(2100); });
    expect(result.current.state).toBe('idle');
  });

  it('rolls back and exposes the message when the commit rejects, and retry repeats it', async () => {
    const commit = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined);
    const { result } = renderHook(() => useAsyncControl<number>({ value: 1, commit }));
    await act(async () => { result.current.set(9); });
    expect(result.current.state).toBe('failed');
    expect(result.current.error).toBe('offline');
    expect(result.current.displayValue).toBe(1);
    await act(async () => { result.current.retry(); });
    expect(commit).toHaveBeenLastCalledWith(9);
    expect(result.current.state).toBe('confirmed');
  });

  it('waits for `reported`, confirming when it matches', async () => {
    const commit = vi.fn().mockResolvedValue(undefined);
    const { result, rerender } = renderHook(({ reported }) => useAsyncControl<number>({ value: 1, reported, commit }), { initialProps: { reported: 1 as number | null } });
    await act(async () => { result.current.set(7); });
    expect(result.current.state).toBe('pending');
    rerender({ reported: 7 });
    expect(result.current.state).toBe('confirmed');
  });

  it('turns a never-matching `reported` into mismatch after timeoutMs', async () => {
    const commit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useAsyncControl<number>({ value: 1, reported: 1, commit, timeoutMs: 500 }));
    await act(async () => { result.current.set(7); });
    expect(result.current.state).toBe('pending');
    await act(async () => { vi.advanceTimersByTime(600); });
    expect(result.current.state).toBe('mismatch');
  });

  it('with confirm, set parks the value until accept() and dismiss() drops it', async () => {
    const commit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useAsyncControl<boolean>({ value: false, commit, confirm: true }));
    act(() => result.current.set(true));
    expect(commit).not.toHaveBeenCalled();
    expect(result.current.awaiting).toEqual({ value: true });
    act(() => result.current.dismiss());
    expect(result.current.awaiting).toBeNull();
    act(() => result.current.set(true));
    await act(async () => { result.current.accept(); });
    expect(commit).toHaveBeenCalledWith(true);
  });

  it('ignores the result of a superseded write', async () => {
    const resolvers: Array<(e?: Error) => void> = [];
    const commit = vi.fn(() => new Promise<void>((res, rej) => { resolvers.push((e) => (e ? rej(e) : res())); }));
    const { result } = renderHook(() => useAsyncControl<number>({ value: 0, commit }));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    await act(async () => { resolvers[0](new Error('late')); });
    expect(result.current.state).toBe('pending');
    expect(result.current.displayValue).toBe(2);
  });
});
