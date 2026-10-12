import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { useFullscreen } from './useFullscreen';

afterEach(() => {
  cleanup();
  for (const k of ['fullscreenEnabled', 'fullscreenElement', 'exitFullscreen']) Reflect.deleteProperty(document, k);
  Reflect.deleteProperty(HTMLElement.prototype, 'requestFullscreen');
});

function Probe() {
  const fs = useFullscreen(() => document.getElementById('target'));
  return <div><div id="target" /><button onClick={fs.toggle}>{fs.active ? 'on' : 'off'}</button></div>;
}
const target = () => document.getElementById('target')!;
const click = async () => { await act(async () => { screen.getByRole('button').click(); }); };

describe('useFullscreen', () => {
  it('without the Fullscreen API it marks the element so it covers the page, and Esc leaves', async () => {
    render(<Probe />);
    await click();
    expect(target().dataset.fs).toBe('true');
    expect(screen.getByRole('button')).toHaveTextContent('on');
    act(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); });
    expect(target().dataset.fs).toBeUndefined();
    expect(screen.getByRole('button')).toHaveTextContent('off');
  });
  it('toggles off by the button', async () => {
    render(<Probe />);
    await click();
    await click();
    expect(target().dataset.fs).toBeUndefined();
  });
  it('uses the Fullscreen API where it is there, and leaves when the browser leaves it', async () => {
    const request = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, 'fullscreenEnabled', { value: true, configurable: true });
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', { value: request, configurable: true });
    render(<Probe />);
    await click();
    expect(request).toHaveBeenCalledTimes(1);
    expect(target().dataset.fs).toBe('true');
    // Esc in real fullscreen is the browser's: the hook only hears fullscreenchange
    act(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); });
    expect(target().dataset.fs).toBe('true');
    Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true });
    act(() => { document.dispatchEvent(new Event('fullscreenchange')); });
    expect(target().dataset.fs).toBeUndefined();
  });
  it('exits real fullscreen when the button is pressed again', async () => {
    const exit = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, 'fullscreenEnabled', { value: true, configurable: true });
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', { value: vi.fn().mockResolvedValue(undefined), configurable: true });
    Object.defineProperty(document, 'fullscreenElement', { value: document.body, configurable: true });
    Object.defineProperty(document, 'exitFullscreen', { value: exit, configurable: true });
    render(<Probe />);
    await click();
    await click();
    expect(exit).toHaveBeenCalledTimes(1);
    expect(target().dataset.fs).toBeUndefined();
  });
  it('keeps the overlay when the browser refuses', async () => {
    Object.defineProperty(document, 'fullscreenEnabled', { value: true, configurable: true });
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', { value: vi.fn().mockRejectedValue(new Error('no')), configurable: true });
    render(<Probe />);
    await click();
    expect(target().dataset.fs).toBe('true');
    act(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); });
    expect(target().dataset.fs).toBeUndefined();
  });
  it('clears the mark when it unmounts', async () => {
    const { unmount } = render(<Probe />);
    await click();
    const el = target();
    unmount();
    expect(el.dataset.fs).toBeUndefined();
  });
});
