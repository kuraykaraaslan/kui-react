import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with a label linked via htmlFor/id', () => {
    render(<Checkbox id="agree" label="I agree" />);
    expect(screen.getByLabelText('I agree')).toBeInTheDocument();
  });

  it('indeterminate sets the DOM property (not an HTML attribute) and aria-checked="mixed"', () => {
    render(<Checkbox id="all" label="Select all" indeterminate onChange={() => {}} checked={false} />);
    const checkbox = screen.getByLabelText('Select all') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });

  it('error sets aria-invalid and renders role="alert" wired via aria-describedby', () => {
    render(<Checkbox id="tos" label="Accept terms" error="You must accept" />);
    const checkbox = screen.getByLabelText('Accept terms');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    const message = screen.getByRole('alert');
    expect(message).toHaveTextContent('You must accept');
    expect(checkbox).toHaveAttribute('aria-describedby', message.id);
  });

  it('hint renders and is wired via aria-describedby when there is no error', () => {
    render(<Checkbox id="marketing" label="Marketing emails" hint="You can unsubscribe anytime" />);
    const checkbox = screen.getByLabelText('Marketing emails');
    const hint = screen.getByText('You can unsubscribe anytime');
    expect(checkbox).toHaveAttribute('aria-describedby', hint.id);
  });

  it('toggles on click and fires onChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox id="c" label="Check me" onChange={onChange} />);
    await user.click(screen.getByLabelText('Check me'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('disabled prevents interaction', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox id="c" label="Check me" onChange={onChange} disabled />);
    const checkbox = screen.getByLabelText('Check me');
    expect(checkbox).toBeDisabled();
    await user.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });
});
