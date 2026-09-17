import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popconfirm } from './Popconfirm';

describe('Popconfirm', () => {
  it('is closed by default', () => {
    render(<Popconfirm trigger={<button>Delete</button>} title="Delete this item?" onConfirm={() => {}} />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('opens on trigger click and moves focus into the panel', async () => {
    const user = userEvent.setup();
    render(<Popconfirm trigger={<button>Delete</button>} title="Delete this item?" onConfirm={() => {}} />);
    await user.click(screen.getByText('Delete'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
  });

  it('Escape closes the panel and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Popconfirm trigger={<button>Delete</button>} title="Delete this item?" onConfirm={() => {}} />);
    const trigger = screen.getByText('Delete');
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('clicking outside the panel closes it without confirming', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <div>
        <Popconfirm trigger={<button>Delete</button>} title="Delete this item?" onConfirm={onConfirm} />
        <button>Outside</button>
      </div>,
    );
    await user.click(screen.getByText('Delete'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await user.click(screen.getByText('Outside'));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('clicking Confirm calls onConfirm and closes', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<Popconfirm trigger={<button>Delete</button>} title="Delete this item?" onConfirm={onConfirm} />);
    await user.click(screen.getByText('Delete'));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('clicking Cancel calls onCancel and closes without confirming', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<Popconfirm trigger={<button>Delete</button>} title="Delete this item?" onConfirm={onConfirm} onCancel={onCancel} />);
    await user.click(screen.getByText('Delete'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
