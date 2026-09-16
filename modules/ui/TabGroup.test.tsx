import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabGroup, type Tab } from './TabGroup';

const TABS: Tab[] = [
  { id: 'a', label: 'Alpha', content: 'Alpha content' },
  { id: 'b', label: 'Beta', content: 'Beta content' },
  { id: 'c', label: 'Gamma', content: 'Gamma content', disabled: true },
  { id: 'd', label: 'Delta', content: 'Delta content' },
];

describe('TabGroup', () => {
  it('renders every tab and activates the first one by default', () => {
    render(<TabGroup tabs={TABS} />);
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Alpha' })).not.toHaveAttribute('hidden');
  });

  it('defaultTab picks the initially active tab', () => {
    render(<TabGroup tabs={TABS} defaultTab="b" />);
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
  });

  it('clicking a tab activates it and shows its panel', async () => {
    const user = userEvent.setup();
    render(<TabGroup tabs={TABS} />);
    await user.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Beta content')).toBeVisible();
  });

  it('a disabled tab cannot be activated by click', async () => {
    const user = userEvent.setup();
    render(<TabGroup tabs={TABS} />);
    await user.click(screen.getByRole('tab', { name: 'Gamma' }));
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
  });

  it('ArrowRight moves to the next tab, skipping a disabled one', async () => {
    const user = userEvent.setup();
    render(<TabGroup tabs={TABS} defaultTab="b" />);
    screen.getByRole('tab', { name: 'Beta' }).focus();
    await user.keyboard('{ArrowRight}');
    // Gamma (index 2) is disabled — should land on Delta.
    expect(screen.getByRole('tab', { name: 'Delta' })).toHaveAttribute('aria-selected', 'true');
  });

  it('ArrowLeft wraps around from the first tab to the last', async () => {
    const user = userEvent.setup();
    render(<TabGroup tabs={TABS} />);
    screen.getByRole('tab', { name: 'Alpha' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Delta' })).toHaveAttribute('aria-selected', 'true');
  });

  it('Home jumps to the first enabled tab, End to the last enabled tab', async () => {
    const user = userEvent.setup();
    render(<TabGroup tabs={TABS} defaultTab="b" />);
    screen.getByRole('tab', { name: 'Beta' }).focus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Delta' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
  });

  it('only the active tab is in the roving tab order (tabIndex 0), the rest are -1', () => {
    render(<TabGroup tabs={TABS} />);
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('tabindex', '-1');
  });

  it('lazy: a tab panel that has never been active renders nothing until first activated', async () => {
    const user = userEvent.setup();
    render(<TabGroup tabs={TABS} lazy />);
    expect(screen.queryByText('Beta content')).not.toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(screen.getByText('Beta content')).toBeInTheDocument();
  });

  it('without lazy, every panel is rendered upfront (just hidden)', () => {
    render(<TabGroup tabs={TABS} />);
    // A panel with the native `hidden` attribute drops out of the
    // accessibility tree entirely (jsdom/dom-accessibility-api won't expose
    // its role even with Testing Library's `hidden: true` query option) —
    // query by id instead of by role to check it's still in the DOM.
    expect(screen.getByText('Beta content')).toBeInTheDocument();
    expect(document.getElementById('tabpanel-b')).toHaveAttribute('hidden');
  });

  it('the tablist has the given accessible label', () => {
    render(<TabGroup tabs={TABS} label="Settings sections" />);
    expect(screen.getByRole('tablist', { name: 'Settings sections' })).toBeInTheDocument();
  });
});
