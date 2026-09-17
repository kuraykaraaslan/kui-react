import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownMenu, type DropdownItem } from './DropdownMenu';

const ITEMS: DropdownItem[] = [
  { label: 'Edit', onClick: vi.fn() },
  { type: 'separator' },
  { label: 'Delete', danger: true, onClick: vi.fn() },
  { label: 'Archive', disabled: true, onClick: vi.fn() },
];

describe('DropdownMenu', () => {
  it('is closed by default (menu not in the document)', () => {
    render(<DropdownMenu trigger={<button>Options</button>} items={ITEMS} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByText('Options').closest('[aria-haspopup]')).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the menu on trigger click, with every item and the separator', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Options</button>} items={ITEMS} />);
    await user.click(screen.getByText('Options'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('clicking an item calls its onClick and closes the menu', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Options</button>} items={[{ label: 'Edit', onClick }]} />);
    await user.click(screen.getByText('Options'));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('a disabled item is not clickable and does not fire onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Options</button>} items={[{ label: 'Archive', disabled: true, onClick }]} />);
    await user.click(screen.getByText('Options'));
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toBeDisabled();
    await user.click(screen.getByRole('menuitem', { name: 'Archive' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('Escape closes the open menu', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Options</button>} items={ITEMS} />);
    await user.click(screen.getByText('Options'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking outside the menu closes it', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <DropdownMenu trigger={<button>Options</button>} items={ITEMS} />
        <button>Outside</button>
      </div>,
    );
    await user.click(screen.getByText('Options'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(screen.getByText('Outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders an optional header above the items', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Options</button>} items={ITEMS} header={<span>Signed in as jane@acme.com</span>} />);
    await user.click(screen.getByText('Options'));
    expect(screen.getByText('Signed in as jane@acme.com')).toBeInTheDocument();
  });

  it('align="right" applies the right-aligned class', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Options</button>} items={ITEMS} align="right" />);
    await user.click(screen.getByText('Options'));
    expect(screen.getByRole('menu').className).toContain('right-0');
  });

  it('moves focus into the menu (first item) on open', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Options</button>} items={ITEMS} />);
    await user.click(screen.getByText('Options'));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
  });

  it('returns focus to the trigger when closed via Escape', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Options</button>} items={ITEMS} />);
    const trigger = screen.getByText('Options');
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('Tab from the last focusable item (disabled items are skipped) wraps to the first', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Options</button>} items={ITEMS} />);
    await user.click(screen.getByText('Options'));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
    // Archive is disabled, so Delete is the last *focusable* item.
    screen.getByRole('menuitem', { name: 'Delete' }).focus();
    await user.tab();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });
});
