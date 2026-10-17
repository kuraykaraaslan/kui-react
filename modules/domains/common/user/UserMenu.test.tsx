import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserMenu } from './UserMenu';
import type { SafeUser } from '../types';

const USER = {
  userId: 'u1',
  email: 'jane@acme.com',
  userRole: 'ADMIN',
  userStatus: 'ACTIVE',
  userProfile: { name: 'Jane Doe', profilePicture: null },
} as SafeUser;

async function openMenu(ui: React.ReactElement) {
  const user = userEvent.setup();
  render(ui);
  await user.click(screen.getByRole('button', { name: 'User menu for Jane Doe' }));
  return user;
}

const labels = () => screen.getAllByRole('menuitem').map((i) => i.textContent);

describe('UserMenu', () => {
  it('shows the built-in items: Profile, Settings, a separator, Sign out', async () => {
    await openMenu(<UserMenu user={USER} />);
    expect(labels()).toEqual(['Profile', 'Settings', 'Sign out']);
    expect(screen.getAllByRole('separator')).toHaveLength(1);
  });

  it('items still replace the built-in items (backwards compatible)', async () => {
    await openMenu(<UserMenu user={USER} items={[{ label: 'My posts' }, { type: 'separator' }, { label: 'Leave', danger: true }]} />);
    expect(labels()).toEqual(['My posts', 'Leave']);
  });

  it('extraItems merge with the built-in items instead of replacing them', async () => {
    await openMenu(
      <UserMenu
        user={USER}
        extraItems={[
          { id: 'prefs', label: 'Preferences' },
          { id: 'dnd', label: 'Do not disturb', group: 'status', order: 10 },
          { id: 'stop-impersonating', label: 'Stop impersonating', group: 'session', order: 900 },
        ]}
      />,
    );
    // No group: joins the account items after the built-in ones. Own group with a low order: first.
    expect(labels()).toEqual(['Do not disturb', 'Profile', 'Settings', 'Preferences', 'Stop impersonating', 'Sign out']);
  });

  it('mergeItems turns items into additions', async () => {
    await openMenu(<UserMenu user={USER} mergeItems items={[{ id: 'billing', label: 'Billing' }]} />);
    expect(labels()).toEqual(['Profile', 'Settings', 'Billing', 'Sign out']);
  });

  it('an extra item with a built-in id replaces it and keeps its place', async () => {
    await openMenu(<UserMenu user={USER} extraItems={[{ id: 'profile', label: 'My account', href: '/me' }]} />);
    expect(labels()).toEqual(['My account', 'Settings', 'Sign out']);
    expect(screen.getByRole('menuitem', { name: 'My account' })).toHaveAttribute('href', '/me');
  });

  it('a hidden extra item is left out', async () => {
    await openMenu(<UserMenu user={USER} extraItems={[{ id: 'x', label: 'Secret', hidden: true }]} />);
    expect(labels()).toEqual(['Profile', 'Settings', 'Sign out']);
  });

  it('a hidden item with a built-in id leaves that item out', async () => {
    await openMenu(<UserMenu user={USER} mergeItems items={[{ id: 'settings', label: 'Settings', hidden: true }]} />);
    expect(labels()).toEqual(['Profile', 'Sign out']);
  });

  it('shows the role under the name, and the name alone without a role', () => {
    const { unmount } = render(<UserMenu user={USER} />);
    expect(screen.getByRole('button', { name: 'User menu for Jane Doe' })).toHaveTextContent('ADMIN');
    unmount();
    render(<UserMenu user={{ email: 'sam@acme.com', userProfile: { name: 'Sam' } }} />);
    const trigger = screen.getByRole('button', { name: 'User menu for Sam' });
    expect(trigger.querySelectorAll('p')).toHaveLength(1);
  });

  it('takes the email as the name when the profile has none', () => {
    render(<UserMenu user={{ email: 'sam@acme.com', userProfile: null }} />);
    expect(screen.getByRole('button', { name: 'User menu for sam@acme.com' })).toBeInTheDocument();
  });

  it('the chevron turns over while the menu is open', async () => {
    const user = userEvent.setup();
    render(<UserMenu user={USER} />);
    const trigger = screen.getByRole('button', { name: 'User menu for Jane Doe' });
    const chevron = trigger.querySelector('svg:last-of-type')!;
    expect(trigger).toHaveClass('group');
    expect(chevron).toHaveClass('group-aria-expanded:rotate-180', 'transition-transform');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('portal renders the open menu in document.body, outside a clipping parent', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div className="overflow-hidden">
        <UserMenu user={USER} portal />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'User menu for Jane Doe' }));
    const menu = screen.getByRole('menu');
    expect(container.contains(menu)).toBe(false);
    expect(menu).toHaveClass('fixed');
    expect(menu.style.right).not.toBe('');
  });

  it('renders the menu in place without portal', async () => {
    const { container } = render(<UserMenu user={USER} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'User menu for Jane Doe' }));
    expect(container.contains(screen.getByRole('menu'))).toBe(true);
  });

  it('passes className to the root', () => {
    const { container } = render(<UserMenu user={USER} className="ml-auto" />);
    expect(container.firstElementChild).toHaveClass('relative', 'inline-block', 'ml-auto');
  });

  it('wires hrefs, handlers and labels of the built-in items', async () => {
    const onSignOut = vi.fn();
    const user = await openMenu(
      <UserMenu user={USER} profileHref="/me" onSignOut={onSignOut} labels={{ profile: 'Mein Profil', signOut: 'Abmelden' }} />,
    );
    expect(screen.getByRole('menuitem', { name: 'Mein Profil' })).toHaveAttribute('href', '/me');
    await user.click(screen.getByRole('menuitem', { name: 'Abmelden' }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
