import { describe, it, expect, afterEach } from 'vitest';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette, DEMO_COMMANDS, registerCommands, type CommandItem } from './index';

// CommandPalette renders its panel through <Modal>, which owns the actual
// focus trap (see Modal.test.tsx / useFocusTrap.test.tsx for that
// machinery's own coverage) — this just smoke-tests that the wiring
// between the trigger, Modal, and useShortcuts' Escape handling works.
describe('CommandPalette', () => {
  it('is closed by default', () => {
    render(<CommandPalette trigger={<button>Open palette</button>} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on trigger click and moves focus into the dialog (Modal\'s own close button, the first focusable element)', async () => {
    const user = userEvent.setup();
    render(<CommandPalette trigger={<button>Open palette</button>} />);
    await user.click(screen.getByText('Open palette'));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus());
  });

  it('Escape closes the palette and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<CommandPalette trigger={<button>Open palette</button>} />);
    const trigger = screen.getByText('Open palette');
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus());
    await user.keyboard('{Escape}');
    // Modal plays a 250ms exit animation before actually unmounting.
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  describe('commands', () => {
    let dispose: (() => void) | null = null;
    afterEach(() => {
      if (dispose) act(() => dispose!());
      dispose = null;
    });

    async function openPalette(ui: React.ReactElement) {
      const user = userEvent.setup();
      render(ui);
      await user.click(screen.getByText('Open palette'));
      const dialog = await screen.findByRole('dialog');
      return { user, listbox: () => within(dialog).queryByRole('listbox') };
    }

    const optionLabels = () => screen.queryAllByRole('option').map((o) => o.textContent ?? '');

    it('lists no demo commands by default', async () => {
      const { listbox } = await openPalette(<CommandPalette trigger={<button>Open palette</button>} />);
      expect(listbox()).toBeNull();
      expect(screen.queryByText('Go to Dashboard')).not.toBeInTheDocument();
    });

    it('demo fills in the sample commands', async () => {
      await openPalette(<CommandPalette demo trigger={<button>Open palette</button>} />);
      expect(screen.getAllByRole('option')).toHaveLength(DEMO_COMMANDS.length);
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    });

    it('items win over demo', async () => {
      await openPalette(<CommandPalette demo items={[{ label: 'Only me', group: 'Mine' }]} trigger={<button>Open palette</button>} />);
      expect(optionLabels()).toEqual([expect.stringContaining('Only me')]);
    });

    it('orders groups and commands by order, and drops hidden commands', async () => {
      const items: CommandItem[] = [
        { id: 'logs', label: 'Open logs', group: 'Admin', order: 50 },
        { id: 'new-lead', label: 'New lead', group: 'Create', order: 20 },
        { id: 'new-contact', label: 'New contact', group: 'Create', order: 10 },
        { id: 'secret', label: 'Secret tool', group: 'Admin', hidden: true },
        { id: 'home', label: 'Go home', category: 'Navigation', order: 0 },
      ];
      await openPalette(<CommandPalette items={items} trigger={<button>Open palette</button>} />);
      expect(optionLabels().map((l) => l.trim())).toEqual([
        expect.stringContaining('Go home'),
        expect.stringContaining('New contact'),
        expect.stringContaining('New lead'),
        expect.stringContaining('Open logs'),
      ]);
      expect(screen.queryByText('Secret tool')).not.toBeInTheDocument();
    });

    it('lists commands other modules register, and drops them on dispose', async () => {
      act(() => {
        dispose = registerCommands([
          { id: 'call', label: 'Call contact', group: 'Telephony' },
          { id: 'hidden-call', label: 'Hidden call', group: 'Telephony', hidden: true },
        ]);
      });
      await openPalette(<CommandPalette trigger={<button>Open palette</button>} />);
      expect(screen.getByText('Call contact')).toBeInTheDocument();
      expect(screen.queryByText('Hidden call')).not.toBeInTheDocument();
      act(() => dispose!());
      dispose = null;
      await waitFor(() => expect(screen.queryByText('Call contact')).not.toBeInTheDocument());
    });

    it('ArrowDown follows the on-screen order across groups', async () => {
      const items: CommandItem[] = [
        { id: 'a1', label: 'Alpha one', group: 'A' },
        { id: 'b1', label: 'Beta one', group: 'B' },
        { id: 'a2', label: 'Alpha two', group: 'A' },
      ];
      const { user } = await openPalette(<CommandPalette items={items} trigger={<button>Open palette</button>} />);
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowDown}');
      const active = screen.getAllByRole('option').find((o) => o.getAttribute('aria-selected') === 'true');
      expect(active).toHaveTextContent('Alpha two');
    });
  });
});
