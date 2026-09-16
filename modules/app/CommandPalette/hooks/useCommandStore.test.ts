import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useState, act } from 'react';
import { useCommandStore, registerCommand } from './useCommandStore';

// Regression test for a real, production-crashing bug: getSnapshot() used to
// allocate `Array.from(registry.values())` fresh on every call.
// useSyncExternalStore requires getSnapshot() to return a referentially
// stable value when the store hasn't changed — React calls it on every
// render to check for staleness, so a fresh array every time makes the
// store look changed on every single render, forcing another immediate
// re-render forever (React error 185, "Maximum update depth exceeded").
// This crashed the browser tab on the one real page that mounts
// CommandPalette (modules/app/CommandPalette, showcased as AppCommandBar),
// caught by tests/visual/showcase.spec.ts, not by any unit test — until now.

describe('useCommandStore', () => {
  it('returns a referentially stable snapshot across re-renders when nothing changed', () => {
    const { result, rerender } = renderHook(() => useCommandStore());
    const first = result.current;
    rerender();
    rerender();
    expect(result.current).toBe(first);
  });

  it('does not loop forever when re-rendered repeatedly alongside unrelated state', () => {
    // Reproduces the actual crash scenario: a component that re-renders for
    // an unrelated reason (its own local state) while also reading the
    // command store. With an unstable getSnapshot() this alone triggers the
    // infinite update loop; renderHook completing at all is the assertion.
    function useHarness() {
      const [, setTick] = useState(0);
      const commands = useCommandStore();
      return { commands, bump: () => setTick((t) => t + 1) };
    }
    const { result } = renderHook(() => useHarness());
    act(() => result.current.bump());
    act(() => result.current.bump());
    expect(Array.isArray(result.current.commands)).toBe(true);
  });

  it('returns a new snapshot only after the registry actually changes', () => {
    const { result, rerender } = renderHook(() => useCommandStore());
    const before = result.current;

    let dispose!: () => void;
    act(() => {
      dispose = registerCommand({ id: 'test-cmd', label: 'Test Command', category: 'Actions' });
    });
    rerender();
    expect(result.current).not.toBe(before);
    expect(result.current.some((c) => c.id === 'test-cmd')).toBe(true);

    const afterRegister = result.current;
    act(() => dispose());
    rerender();
    expect(result.current).not.toBe(afterRegister);
    expect(result.current.some((c) => c.id === 'test-cmd')).toBe(false);
  });
});
