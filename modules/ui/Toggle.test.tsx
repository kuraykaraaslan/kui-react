import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders as an accessible switch with the label text', () => {
    render(<Toggle id="notify" label="Notifications" checked={false} onChange={() => {}} />);
    const toggle = screen.getByRole('switch', { name: 'Notifications' });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('reflects the checked prop via aria-checked', () => {
    render(<Toggle id="notify" label="Notifications" checked onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange with the new value on click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle id="notify" label="Notifications" checked={false} onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange via keyboard (Space) since it is a real checkbox input', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle id="notify" label="Notifications" checked={false} onChange={onChange} />);
    screen.getByRole('switch').focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('disabled prevents interaction and applies the disabled styling', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle id="notify" label="Notifications" checked={false} onChange={onChange} disabled />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeDisabled();
    await user.click(toggle);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders an optional description', () => {
    render(<Toggle id="notify" label="Notifications" description="Get emailed about updates" checked={false} onChange={() => {}} />);
    expect(screen.getByText('Get emailed about updates')).toBeInTheDocument();
  });
});
