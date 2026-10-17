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
