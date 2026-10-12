import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { useLeaveGuard } from './useLeaveGuard';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function Probe({ active, onGuard }: { active: boolean; onGuard: (g: ReturnType<typeof useLeaveGuard>) => void }) {
  onGuard(useLeaveGuard(active, 'Leave without saving?'));
  return null;
}
const unload = () => { const e = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(e); return e; };

describe('useLeaveGuard', () => {
  it('asks the browser to confirm a reload or close only while active', () => {
    const { rerender } = render(<Probe active={false} onGuard={() => undefined} />);
    expect(unload().defaultPrevented).toBe(false);
    rerender(<Probe active onGuard={() => undefined} />);
    expect(unload().defaultPrevented).toBe(true);
    rerender(<Probe active={false} onGuard={() => undefined} />);
    expect(unload().defaultPrevented).toBe(false);
  });
  it('removes the listener when it unmounts', () => {
    const { unmount } = render(<Probe active onGuard={() => undefined} />);
    unmount();
    expect(unload().defaultPrevented).toBe(false);
  });
  it('confirmLeave asks only while active, and says what the user answered', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    let guard!: ReturnType<typeof useLeaveGuard>;
    const { rerender } = render(<Probe active={false} onGuard={(g) => { guard = g; }} />);
    expect(guard.confirmLeave()).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
    rerender(<Probe active onGuard={(g) => { guard = g; }} />);
    expect(guard.confirmLeave()).toBe(false);
    expect(confirm).toHaveBeenCalledWith('Leave without saving?');
    confirm.mockReturnValue(true);
    expect(guard.confirmLeave()).toBe(true);
  });
});
