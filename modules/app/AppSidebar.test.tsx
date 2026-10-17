import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppSidebar } from './AppSidebar';

const ITEMS = [
  { id: 'inbox', label: 'Inbox', badge: 3 },
  { id: 'zero', label: 'Zero', badge: 0 },
  { id: 'status', label: 'Status', badge: <span data-testid="dot">live</span> },
];

// jsdom has no matchMedia; report a desktop viewport (min-width: 1024px).
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

describe('AppSidebar', () => {
  it('renders a number badge above 0 and hides 0', () => {
    render(<AppSidebar navItems={ITEMS} searchable={false} />);
    expect(screen.getByRole('button', { name: /Inbox/ })).toHaveTextContent('3');
    expect(screen.getByRole('button', { name: /Zero/ })).not.toHaveTextContent('0');
  });

  it('renders a node badge as given', () => {
    render(<AppSidebar navItems={ITEMS} searchable={false} />);
    expect(screen.getByTestId('dot')).toHaveTextContent('live');
  });

  it('renders the header above the nav groups', () => {
    const { container } = render(<AppSidebar navItems={ITEMS} header={<div>Workspace switcher</div>} />);
    const header = screen.getByText('Workspace switcher');
    const nav = screen.getByRole('navigation', { name: 'Sidebar navigation' });
    expect(header.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelector('nav')!.contains(header)).toBe(false);
  });

  it('a header function receives the collapsed state', () => {
    render(<AppSidebar navItems={ITEMS} collapsed header={({ collapsed }) => <span>{collapsed ? 'narrow' : 'wide'}</span>} />);
    expect(screen.getByText('narrow')).toBeInTheDocument();
  });

  it('renders no header wrapper without a header', () => {
    render(<AppSidebar navItems={ITEMS} searchable={false} />);
    expect(screen.queryByText('Workspace switcher')).not.toBeInTheDocument();
  });
});
