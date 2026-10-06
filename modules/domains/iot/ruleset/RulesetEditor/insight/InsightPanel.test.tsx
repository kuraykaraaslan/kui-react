import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { InsightPanel } from './InsightPanel';
import type { DebugMessage } from './types';

afterEach(() => cleanup());

const msg = (seq: number, kind: DebugMessage['kind'] = 'msg', extra: Partial<DebugMessage> = {}): DebugMessage => ({ seq, ts: 1000 + seq, node: 'n1', kind, msg: { v: seq }, ...extra });
const names = { n1: 'Source', n2: 'Gate', s1: 'Hold 2 min', c1: 'Catcher' };
const tab = (id: string) => fireEvent.click(screen.getByTestId(`insight-tab-${id}`));

describe('InsightPanel', () => {
  it('switches the four tabs', () => {
    render(<InsightPanel nodeNames={names} />);
    expect(screen.getByTestId('insight-dbg-list')).toBeTruthy();
    tab('busiest');
    expect(screen.getByText('No block has handled a message yet.')).toBeTruthy();
    tab('errors');
    expect(screen.getByText('No errors in the messages read so far.')).toBeTruthy();
    tab('data');
    expect(screen.getByTestId('insight-ctx-scope')).toBeTruthy();
  });

  it('Busiest: names subflow rows after the instance, sorts and reveals the root block', () => {
    const onReveal = vi.fn();
    render(<InsightPanel defaultTab="busiest" onReveal={onReveal} nodeNames={names}
      nodeStats={{ n2: { in: 3, out: 3, avgMs: 9 }, 's1/x': { in: 8, out: 8, avgMs: 1 } }} />);
    const rows = () => within(screen.getByTestId('insight-perf-rows')).getAllByRole('row').slice(1).map((r) => r.textContent);
    expect(rows()[0]).toContain('Hold 2 min');
    fireEvent.click(screen.getByTestId('insight-perf-ms'));
    expect(rows()[0]).toContain('Gate');
    fireEvent.click(screen.getByRole('button', { name: 'Hold 2 min' }));
    expect(onReveal).toHaveBeenCalledWith('s1');
  });

  it('Debug: pause stops reading and resume catches up', () => {
    const { rerender } = render(<InsightPanel nodeNames={names} messages={[msg(1)]} />);
    expect(screen.getByTestId('insight-dbg-list').children).toHaveLength(1);
    fireEvent.click(screen.getByTestId('insight-dbg-pause'));
    expect(screen.getByTestId('insight-dbg-pause').getAttribute('aria-pressed')).toBe('true');
    rerender(<InsightPanel nodeNames={names} messages={[msg(1), msg(2), msg(3)]} />);
    expect(screen.getByTestId('insight-dbg-list').children).toHaveLength(1);
    fireEvent.click(screen.getByTestId('insight-dbg-pause'));
    expect(screen.getByTestId('insight-dbg-list').children).toHaveLength(3);
  });

  it('Debug: kind filter', () => {
    render(<InsightPanel nodeNames={names} messages={[msg(1), msg(2, 'error', { text: 'bad' }), msg(3, 'warn', { text: 'hmm' })]} />);
    const list = screen.getByTestId('insight-dbg-list');
    fireEvent.change(screen.getByTestId('insight-dbg-kind'), { target: { value: 'problem' } });
    expect(list.children).toHaveLength(2);
    fireEvent.change(screen.getByTestId('insight-dbg-kind'), { target: { value: 'msg' } });
    expect(list.children).toHaveLength(1);
  });

  it('Debug: download notices empty, and copies when the download is blocked', () => {
    const onNotice = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const { rerender } = render(<InsightPanel nodeNames={names} onNotice={onNotice} />);
    fireEvent.click(screen.getByTestId('insight-dbg-save'));
    expect(onNotice).toHaveBeenCalledWith('empty', 0);
    rerender(<InsightPanel nodeNames={names} onNotice={onNotice} messages={[msg(1)]} />);
    /* jsdom has no URL.createObjectURL, so the download is "blocked" */
    fireEvent.click(screen.getByTestId('insight-dbg-save'));
    expect(onNotice).toHaveBeenLastCalledWith('copied', 1);
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toContain('Source');
  });

  it('Errors: caught link selects the catcher; its own port is a badge', () => {
    const onReveal = vi.fn();
    render(<InsightPanel defaultTab="errors" onReveal={onReveal} nodeNames={names}
      runs={[{ ts: 5, errors: [{ node: 'n2', message: 'boom', caught: 'c1' }, { node: 'n1', message: 'own', caught: 'n1' }] }]} />);
    fireEvent.click(screen.getByTestId('insight-caught-link'));
    expect(onReveal).toHaveBeenCalledWith('c1');
    expect(screen.getByText('its error port')).toBeTruthy();
  });

  it('Data: fill bar tones, hidden for system scope and without numbers', () => {
    const { rerender } = render(<InsightPanel defaultTab="data" context={{ memory: { bytes: 85, limit: 100 } }} />);
    expect(screen.getByRole('progressbar').getAttribute('data-tone')).toBe('warn');
    rerender(<InsightPanel defaultTab="data" context={{ memory: { bytes: 100, limit: 100 } }} />);
    expect(screen.getByRole('progressbar').getAttribute('data-tone')).toBe('full');
    fireEvent.change(screen.getByTestId('insight-ctx-scope'), { target: { value: 'sys' } });
    expect(screen.queryByRole('progressbar')).toBeNull();
    fireEvent.change(screen.getByTestId('insight-ctx-scope'), { target: { value: 'flow' } });
    fireEvent.change(screen.getByTestId('insight-ctx-store'), { target: { value: 'persist' } });
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
