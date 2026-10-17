import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownMenu, arrangeMenuItems, mergeMenuItems, type DropdownItem } from './DropdownMenu';

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

  describe('contributed items', () => {
    async function open(items: DropdownItem[], extra: Partial<React.ComponentProps<typeof DropdownMenu>> = {}) {
      const user = userEvent.setup();
      render(<DropdownMenu trigger={<button>Options</button>} items={items} {...extra} />);
      await user.click(screen.getByText('Options'));
      return user;
    }

    it('hidden items are left out, with no stray separators', async () => {
      await open([
        { label: 'Edit' },
        { type: 'separator' },
        { label: 'Call', hidden: true },
        { type: 'separator' },
        { label: 'Delete', danger: true },
      ]);
      expect(screen.queryByRole('menuitem', { name: 'Call' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('separator')).toHaveLength(1);
    });

    it('orders items by group and order, with a separator between groups', async () => {
      await open([
        { id: 'sign-out', label: 'Sign out', group: 'session', order: 1000 },
        { id: 'profile', label: 'Profile', group: 'account', order: 100 },
        { type: 'separator' },
        { id: 'dnd', label: 'Do not disturb', group: 'status', order: 50 },
        { id: 'settings', label: 'Settings', group: 'account', order: 200 },
      ]);
      expect(screen.getAllByRole('menuitem').map((i) => i.textContent)).toEqual(['Do not disturb', 'Profile', 'Settings', 'Sign out']);
      expect(screen.getAllByRole('separator')).toHaveLength(2);
    });

    it('an item with href renders as a link and still closes the menu', async () => {
      const onClick = vi.fn();
      const user = await open([{ id: 'docs', label: 'Docs', href: '#docs', onClick }]);
      const link = screen.getByRole('menuitem', { name: 'Docs' });
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '#docs');
      expect(link).toHaveAttribute('data-item-id', 'docs');
      await user.click(link);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('a disabled item with href is a disabled button, never a link', async () => {
      await open([{ label: 'Docs', href: '/docs', disabled: true }]);
      const item = screen.getByRole('menuitem', { name: 'Docs' });
      expect(item.tagName).toBe('BUTTON');
      expect(item).toBeDisabled();
    });

    it('disabledReason shows under a disabled item and describes it', async () => {
      await open([{ label: 'Archive', disabled: true, disabledReason: 'Only owners can archive' }]);
      const item = screen.getByRole('menuitem', { name: 'Archive' });
      expect(item).toHaveAccessibleDescription('Only owners can archive');
      expect(item).toHaveAttribute('title', 'Only owners can archive');
      expect(screen.getByText('Only owners can archive')).toBeInTheDocument();
    });

    it('disabledReason is ignored while the item is enabled', async () => {
      await open([{ label: 'Archive', disabledReason: 'Only owners can archive' }]);
      expect(screen.queryByText('Only owners can archive')).not.toBeInTheDocument();
    });

    it('portal renders the open menu in document.body, outside the trigger container', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { container } = render(
        <DropdownMenu portal align="right" trigger={<button>Options</button>} items={[{ label: 'Edit', onClick }]} />,
      );
      await user.click(screen.getByText('Options'));
      const menu = screen.getByRole('menu');
      expect(container.contains(menu)).toBe(false);
      expect(menu.className).toContain('fixed');
      // A click inside the portalled menu is not an outside click.
      await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('arrangeMenuItems / mergeMenuItems', () => {
    it('leaves a list without group or order exactly as it is', () => {
      const items: DropdownItem[] = [{ label: 'A' }, { type: 'separator' }, { label: 'B' }];
      expect(arrangeMenuItems(items)).toEqual(items);
    });

    it('mergeMenuItems replaces by id in place and appends the rest', () => {
      const merged = mergeMenuItems(
        [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
        [{ id: 'b', label: 'B2' }, { id: 'c', label: 'C' }, { label: 'No id' }],
      );
      expect(merged.map((i) => (i.type === 'separator' ? '-' : i.label))).toEqual(['A', 'B2', 'C', 'No id']);
    });
  });
});
