import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { InsightPanel } from './InsightPanel';
import { previewOf } from './format';
import type { EventRecord } from './types';

afterEach(cleanup);

const T0 = new Date(2026, 9, 12, 7, 5, 9).getTime() / 1000;
const events: EventRecord[] = [
  { seq: 2, ts: T0 + 5, source: 'wan', kind: 'down', data: { iface: 'wan', reason: 'carrier lost' } },
  { seq: 1, ts: T0, source: 'dhcp', kind: 'lease', data: 'plain text' },
];
const open = (p: Partial<React.ComponentProps<typeof InsightPanel>> = {}) => render(<InsightPanel defaultTab="data" {...p} />);

describe('Data tab: Events', () => {
  it('opens on Events and says there are none', () => {
    open();
    expect(screen.getByTestId('insight-data-events')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('No events yet.')).toBeInTheDocument();
    expect(screen.getByText('What happened lately. Use one to build a trigger block.')).toBeInTheDocument();
  });
  it('lists the events newest first with the time, source/kind and a one-line preview', () => {
    open({ events });
    const rows = screen.getByTestId('insight-events').children;
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('07:05:14');
    expect(rows[0]).toHaveTextContent('wan/down');
    expect(rows[0].querySelector('summary')?.textContent).toBe('{"iface":"wan","reason":"carrier lost"}');
    expect(rows[1].querySelector('summary')?.textContent).toBe('plain text');
  });
  it('draws the value of an event folded, to open on a click', () => {
    open({ events });
    const card = screen.getByTestId('insight-events').children[0] as HTMLElement;
    expect(card.querySelector('details details[open]')).toBeNull();
    expect(card).toHaveTextContent('object { iface, reason }');
  });
  it('gives each event a "Use as trigger" button only when the host can make a trigger', () => {
    const onUseAsTrigger = vi.fn();
    const { rerender } = open({ events, onUseAsTrigger });
    const buttons = screen.getAllByTestId('insight-event-use');
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[1]);
    expect(onUseAsTrigger).toHaveBeenCalledWith(events[1]);
    rerender(<InsightPanel defaultTab="data" events={events} />);
    expect(screen.queryByTestId('insight-event-use')).toBeNull();
  });
  it('cuts a long preview at 80 characters', () => {
    expect(previewOf('x'.repeat(100))).toBe(`${'x'.repeat(77)}…`);
    expect(previewOf(undefined)).toBe('');
    expect(previewOf({ a: 1 })).toBe('{"a":1}');
  });
});

describe('Data tab: Context', () => {
  const ctx = (p: Partial<React.ComponentProps<typeof InsightPanel>> = {}) => open({ defaultSegment: 'context', ...p });

  it('asks the host to read the keys when Context is opened, the scope or store changes and on reload', () => {
    const onContextLoad = vi.fn();
    open({ onContextLoad });
    fireEvent.click(screen.getByTestId('insight-data-context'));
    expect(onContextLoad).toHaveBeenLastCalledWith('flow', 'memory');
    fireEvent.change(screen.getByTestId('insight-ctx-store'), { target: { value: 'persist' } });
    expect(onContextLoad).toHaveBeenLastCalledWith('flow', 'persist');
    fireEvent.change(screen.getByTestId('insight-ctx-scope'), { target: { value: 'global' } });
    expect(onContextLoad).toHaveBeenLastCalledWith('global', 'persist');
    fireEvent.click(screen.getByTestId('insight-ctx-reload'));
    expect(onContextLoad).toHaveBeenCalledTimes(4);
  });
  it('says what is going on while there are no keys: loading, save the flow first, nothing stored, or the error', () => {
    const { rerender } = ctx();
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    rerender(<InsightPanel defaultTab="data" defaultSegment="context" flowSaved={false} />);
    expect(screen.getByText('Save the flow first.')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('insight-ctx-scope'), { target: { value: 'global' } });
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    rerender(<InsightPanel defaultTab="data" defaultSegment="context" contextKeys={{}} />);
    expect(screen.getByText('Nothing is stored here.')).toBeInTheDocument();
    rerender(<InsightPanel defaultTab="data" defaultSegment="context" contextError="no access" />);
    expect(screen.getByText('no access')).toBeInTheDocument();
  });
  it('draws each key with its value tree', () => {
    ctx({ contextKeys: { boiler: { temp: 31.5, tags: ['a'] }, mode: 'night' } });
    const rows = screen.getByTestId('insight-ctx').children;
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('boiler');
    expect(rows[0]).toHaveTextContent('temp: 31.5');
    expect(rows[1]).toHaveTextContent('"night"');
  });
  it('lets only an administrator change and delete a key, and never in the system scope', () => {
    const onContextEdit = vi.fn(), onContextDelete = vi.fn();
    const keys = { mode: 'night' };
    const { rerender } = ctx({ contextKeys: keys, canEditContext: true, onContextEdit, onContextDelete });
    fireEvent.click(screen.getByTestId('insight-ctx-edit'));
    expect(onContextEdit).toHaveBeenCalledWith('mode', 'night', 'flow', 'memory');
    fireEvent.click(screen.getByTestId('insight-ctx-delete'));
    expect(onContextDelete).toHaveBeenCalledWith('mode', 'flow', 'memory');
    expect(screen.queryByText('Only the administrator can change the context.')).toBeNull();
    fireEvent.change(screen.getByTestId('insight-ctx-scope'), { target: { value: 'sys' } });
    expect(screen.queryByTestId('insight-ctx-edit')).toBeNull();
    expect(screen.queryByTestId('insight-ctx-store')).toBeNull();
    rerender(<InsightPanel defaultTab="data" defaultSegment="context" contextKeys={keys} />);
    fireEvent.change(screen.getByTestId('insight-ctx-scope'), { target: { value: 'flow' } });
    expect(screen.queryByTestId('insight-ctx-edit')).toBeNull();
    expect(screen.getByText('Only the administrator can change the context.')).toBeInTheDocument();
  });
  it('shows the bar of the store above the keys', () => {
    ctx({ contextKeys: { a: 1 }, context: { memory: { bytes: 41000, limit: 65536 } } });
    const fill = screen.getByTestId('insight-ctx-fill');
    expect(fill).toHaveTextContent('The store of all flows: 40.0 kB of 64.0 kB used (63%).');
    expect(within(fill).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '63');
    expect(fill.compareDocumentPosition(screen.getByTestId('insight-ctx')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
