import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RunsPanel } from './RunsPanel';
import type { RunRow } from './runs';

const run = (over: Partial<RunRow> = {}): RunRow => ({
  run: 'r1', ts: 1_700_000_000_000, ms: 5, status: 'ok', level: 'all', originator: { type: 'tenant', id: 't' }, msgType: 'demo',
  trigger: { node: 't', input: { payload: 'start' } }, path: ['a', 'b'],
  steps: [
    { i: 1, t: 1, node: 'a', type: 'x', in: { payload: 'in-a' }, ms: 1, out: [{ port: 'yes', msg: { payload: 'out-a' }, to: ['b'] }] },
    { i: 2, t: 2, node: 'b', type: 'x', in: { payload: 'in-b' }, ms: 2, error: { code: 'boom', message: 'bad' }, out: [] },
  ],
  outputs: [], errors: [{ node: 'b', code: 'boom', message: 'bad', caught: false }], actions: [], ...over,
});
const NAMES = { t: 'Start', a: 'Check', b: 'Notify' };

describe('RunsPanel', () => {
  it('lists the runs newest first with their status and filters them', async () => {
    const user = userEvent.setup();
    render(<RunsPanel runs={[run({ run: 'old', ts: 1_000_000_000_000 }), run({ run: 'bad', status: 'error' })]} nodeNames={NAMES} />);
    expect(screen.getAllByTestId('runs-item').map((x) => x.getAttribute('data-status'))).toEqual(['error', 'ok']);
    await user.selectOptions(screen.getByTestId('runs-filter'), 'error');
    expect(screen.getAllByTestId('runs-item')).toHaveLength(1);
  });

  it('says so when there is nothing to show', () => {
    render(<RunsPanel runs={[]} />);
    expect(screen.getByText('No runs recorded.')).toBeInTheDocument();
  });

  it('opens a run on the message that started it and walks the steps, marking the canvas as it goes', async () => {
    const user = userEvent.setup();
    const onMark = vi.fn();
    render(<RunsPanel runs={[run()]} nodeNames={NAMES} onMark={onMark} />);
    await user.click(screen.getByTestId('runs-item'));
    expect(screen.getByTestId('runs-frame')).toHaveTextContent('1 of 3');
    expect(screen.getByText('"start"')).toBeInTheDocument();
    expect(onMark).toHaveBeenLastCalledWith({ visited: ['t'], current: 't', failed: null });

    await user.click(screen.getByLabelText('Next step'));
    expect(screen.getByText('"in-a"')).toBeInTheDocument();
    expect(screen.getByText(/Sent on: yes/)).toBeInTheDocument();
    expect(screen.getByText('"out-a"')).toBeInTheDocument();
    expect(onMark).toHaveBeenLastCalledWith({ visited: ['t', 'a'], current: 'a', failed: null });

    await user.click(screen.getByLabelText('Last step'));
    expect(screen.getByText(/Error: boom: bad/)).toBeInTheDocument();
    expect(onMark).toHaveBeenLastCalledWith({ visited: ['t', 'a', 'b'], current: 'b', failed: 'b' });
    expect(screen.getByLabelText('Next step')).toBeDisabled();

    await user.click(screen.getByTestId('runs-back'));
    expect(onMark).toHaveBeenLastCalledWith(null);
    expect(screen.getByTestId('runs-list')).toBeInTheDocument();
  });

  it('shows a block on the canvas and offers a test with the input of a frame', async () => {
    const user = userEvent.setup();
    const onReveal = vi.fn();
    const onTestInput = vi.fn();
    const r = run();
    render(<RunsPanel runs={[r]} nodeNames={NAMES} onReveal={onReveal} onTestInput={onTestInput} />);
    await user.click(screen.getByTestId('runs-item'));
    await user.click(screen.getByLabelText('Next step'));
    await user.click(screen.getByText('Check'));
    expect(onReveal).toHaveBeenCalledWith('a');
    await user.click(screen.getByTestId('runs-test'));
    expect(onTestInput).toHaveBeenCalledWith(r, 1, 'a');
  });

  it('explains a run kept without steps and hides bodies from a viewer who may not see them', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<RunsPanel runs={[run({ steps: undefined })]} nodeNames={NAMES} />);
    await user.click(screen.getByTestId('runs-item'));
    expect(screen.getByText(/kept without its steps/)).toBeInTheDocument();
    rerender(<RunsPanel runs={[run()]} nodeNames={NAMES} bodiesHidden />);
    expect(screen.getByText(/shown only to people who may debug/)).toBeInTheDocument();
  });

  it('narrows to the runs of the selected block', async () => {
    const user = userEvent.setup();
    render(<RunsPanel runs={[run({ run: 'x', path: ['a'] }), run({ run: 'y', path: ['b'], trigger: { node: 'q', input: {} } })]} nodeNames={NAMES} selectedNodeId="b" />);
    expect(screen.getAllByTestId('runs-item')).toHaveLength(2);
    await user.click(screen.getByTestId('runs-this-block'));
    expect(screen.getAllByTestId('runs-item')).toHaveLength(1);
  });
});
