import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RangeSlider } from './RangeSlider';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('RangeSlider commit-on-release', () => {
  it('fires onChange per step but onCommit once on pointer up', () => {
    const onChange = vi.fn(); const onCommit = vi.fn();
    render(<RangeSlider label="Level" value={10} onChange={onChange} onCommit={onCommit} />);
    const input = screen.getByRole('slider');
    fireEvent.change(input, { target: { value: '20' } });
    fireEvent.change(input, { target: { value: '30' } });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onCommit).not.toHaveBeenCalled();
    fireEvent.pointerUp(input);
    fireEvent.pointerUp(input);
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith(30);
  });
  it('commits after keyboard idle', () => {
    const onCommit = vi.fn();
    render(<RangeSlider label="Level" value={10} onChange={() => {}} onCommit={onCommit} commitIdleMs={300} />);
    const input = screen.getByRole('slider');
    fireEvent.change(input, { target: { value: '11' } });
    fireEvent.keyUp(input, { key: 'ArrowRight' });
    expect(onCommit).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(350); });
    expect(onCommit).toHaveBeenCalledWith(11);
  });
  it('commits on blur and is disabled with aria-busy while pending', () => {
    const onCommit = vi.fn();
    const { rerender } = render(<RangeSlider label="Level" value={10} onChange={() => {}} onCommit={onCommit} />);
    const input = screen.getByRole('slider');
    fireEvent.change(input, { target: { value: '12' } });
    fireEvent.blur(input);
    expect(onCommit).toHaveBeenCalledWith(12);
    rerender(<RangeSlider label="Level" value={12} onChange={() => {}} pending />);
    expect(screen.getByRole('slider')).toBeDisabled();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-busy', 'true');
  });
});
