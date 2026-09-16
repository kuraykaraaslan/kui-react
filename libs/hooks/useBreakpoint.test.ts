import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBreakpoint } from './useBreakpoint';

function setInnerWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
}

describe('useBreakpoint', () => {
  afterEach(() => {
    // jsdom's default viewport, so later tests in the same file (or other
    // files sharing this jsdom instance) aren't left with a stubbed width.
    setInnerWidth(1024);
  });

  it('resolves to the breakpoint matching the current window width after mount', () => {
    setInnerWidth(1600);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe('2xl');
    expect(result.current.is2xl).toBe(true);
    expect(result.current.isDesktop).toBe(true);
  });

  it('updates on window resize', () => {
    setInnerWidth(1600);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe('2xl');

    act(() => {
      setInnerWidth(500);
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current.breakpoint).toBe('sm');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('classifies md as isTablet and neither mobile nor desktop', () => {
    setInnerWidth(800);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe('md');
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('classifies lg and xl as isDesktop', () => {
    setInnerWidth(1024);
    const { result: lg } = renderHook(() => useBreakpoint());
    expect(lg.current.breakpoint).toBe('lg');
    expect(lg.current.isDesktop).toBe(true);

    setInnerWidth(1280);
    const { result: xl } = renderHook(() => useBreakpoint());
    expect(xl.current.breakpoint).toBe('xl');
    expect(xl.current.isDesktop).toBe(true);
  });

  it('removes its resize listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useBreakpoint());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeSpy.mockRestore();
  });
});
