import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from './index';

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
});
