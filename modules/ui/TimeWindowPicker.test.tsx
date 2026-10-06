import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeWindowPicker } from './TimeWindowPicker';

describe('TimeWindowPicker', () => {
  it('marks the active preset and emits a relative window keeping interval/aggregation', async () => {
    const onChange = vi.fn();
    render(<TimeWindowPicker value={{ mode: 'relative', last: '1h', interval: '5m' }} onChange={onChange} />);
    expect(screen.getByRole('radio', { name: '1h' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.setup().click(screen.getByRole('radio', { name: '7d' }));
    expect(onChange).toHaveBeenCalledWith({ mode: 'relative', last: '7d', interval: '5m', aggregation: undefined, timezone: undefined });
  });
  it('Custom emits an absolute 24h window and reveals the two date inputs', async () => {
    const onChange = vi.fn();
    render(<TimeWindowPicker value={{ mode: 'relative', last: '1h' }} onChange={onChange} />);
    await userEvent.setup().click(screen.getByRole('radio', { name: 'Custom' }));
    const next = onChange.mock.calls[0][0];
    expect(next.mode).toBe('absolute');
    expect(Date.parse(next.to) - Date.parse(next.from)).toBe(24 * 3_600_000);
  });
  it('takes every label from messages', () => {
    render(<TimeWindowPicker value={null} onChange={() => {}} messages={{ label: 'Zeitraum', custom: 'Eigene' }} />);
    expect(screen.getByRole('group', { name: 'Zeitraum' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Eigene' })).toBeInTheDocument();
  });
  it('changing interval emits the new interval', async () => {
    const onChange = vi.fn();
    render(<TimeWindowPicker value={{ mode: 'relative', last: '24h' }} onChange={onChange} />);
    await userEvent.setup().selectOptions(screen.getByRole('combobox', { name: 'Interval' }), '1h');
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ last: '24h', interval: '1h' }));
  });
});
