import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ControlButton, ControlSetpoint, ControlSwitch } from './index';
import { asBoolean, snapToStep, toRange, validateSetpoint } from './control-logic';

describe('control-logic', () => {
  it('asBoolean reads common spellings and rejects the rest', () => {
    expect(asBoolean('On')).toBe(true);
    expect(asBoolean(0)).toBe(false);
    expect(asBoolean(2)).toBeNull();
    expect(asBoolean('maybe')).toBeNull();
  });
  it('toRange fixes an inverted range and a bad step', () => {
    expect(toRange({ min: 10, max: 5, step: -1 })).toEqual({ min: 10, max: 11, step: 1 });
  });
  it('validateSetpoint refuses empty, NaN and out-of-range', () => {
    const r = toRange({ min: 0, max: 10 });
    expect(validateSetpoint('', r)).toEqual({ ok: false, reason: 'empty' });
    expect(validateSetpoint('x', r)).toEqual({ ok: false, reason: 'nan' });
    expect(validateSetpoint('11', r)).toEqual({ ok: false, reason: 'range' });
    expect(validateSetpoint('5', r)).toEqual({ ok: true, value: 5 });
  });
  it('snapToStep removes float noise and clamps', () => {
    const r = toRange({ min: 0, max: 1, step: 0.1 });
    expect(snapToStep(0.30000000004, r)).toBe(0.3);
    expect(snapToStep(5, r)).toBe(1);
  });
});

describe('ControlSwitch', () => {
  it('commits the toggled value and shows the status line', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(<ControlSwitch title="Heater" value={false} onCommit={onCommit} />);
    await userEvent.setup().click(screen.getByRole('switch'));
    expect(onCommit).toHaveBeenCalledWith(true);
    await waitFor(() => expect(screen.getByText('Done')).toBeInTheDocument());
  });
  it('rolls back and shows the failure on a rejected commit', async () => {
    const onCommit = vi.fn().mockRejectedValue(new Error('Device offline'));
    render(<ControlSwitch title="Heater" value={false} onCommit={onCommit} />);
    await userEvent.setup().click(screen.getByRole('switch'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Device offline');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });
  it('read-only blocks the control and says why', () => {
    render(<ControlSwitch title="Heater" value readOnly onCommit={vi.fn()} />);
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(screen.getByText(/do not have permission/)).toBeInTheDocument();
  });
});

describe('ControlSetpoint', () => {
  it('shows a field error and sends nothing for an out-of-range entry', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ControlSetpoint title="Target" value={20} min={5} max={30} onCommit={onCommit} />);
    const input = screen.getByRole('textbox', { name: 'Target' });
    await user.clear(input);
    await user.type(input, '99{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('between 5 and 30');
    expect(onCommit).not.toHaveBeenCalled();
  });
  it('commits a valid number on Enter', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ControlSetpoint title="Target" value={20} min={5} max={30} onCommit={onCommit} />);
    const input = screen.getByRole('textbox', { name: 'Target' });
    await user.clear(input);
    await user.type(input, '22{Enter}');
    expect(onCommit).toHaveBeenCalledWith(22);
  });
});

describe('ControlButton', () => {
  it('fires immediately without a confirmation policy', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(<ControlButton label="Reboot" onCommit={onCommit} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Reboot' }));
    expect(onCommit).toHaveBeenCalledWith(undefined);
  });
  it('typed confirmation needs the exact text and passes it on', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ControlButton label="Wipe" confirm="typed" confirmText="wipe-dev" onCommit={onCommit} />);
    await user.click(screen.getByRole('button', { name: 'Wipe' }));
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    expect(confirm).toBeDisabled();
    await user.type(screen.getByRole('textbox'), 'wipe-dev');
    await user.click(confirm);
    expect(onCommit).toHaveBeenCalledWith({ confirmed: true, typed: 'wipe-dev' });
  });
});
