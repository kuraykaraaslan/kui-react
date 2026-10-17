import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  UnavailableContribution,
  UNAVAILABLE_REASONS,
  UNAVAILABLE_REASON_IDS,
  type UnavailableContributionSize,
} from './UnavailableContribution';

const SIZES: UnavailableContributionSize[] = ['inline', 'card', 'tab', 'node'];

describe('UnavailableContribution', () => {
  it('knows every reason the extension resolver reports', () => {
    expect(UNAVAILABLE_REASON_IDS).toEqual([
      'disabled', 'unentitled', 'blocked', 'retired', 'banned', 'quarantined', 'failed', 'missing', 'no-access',
    ]);
    for (const id of UNAVAILABLE_REASON_IDS) {
      const meta = UNAVAILABLE_REASONS[id];
      expect(meta.label).toBeTruthy();
      expect(meta.detail).toBeTruthy();
      expect(meta.icon.iconName).toBeTruthy();
    }
  });

  it.each(UNAVAILABLE_REASON_IDS)('reason %s renders its default label and detail', (reason) => {
    render(<UnavailableContribution reason={reason} />);
    const note = screen.getByRole('note');
    expect(note).toHaveAttribute('data-reason', reason);
    expect(note).toHaveTextContent(UNAVAILABLE_REASONS[reason].label);
    expect(note).toHaveTextContent(UNAVAILABLE_REASONS[reason].detail);
  });

  it.each(SIZES)('size %s is marked on the element', (size) => {
    render(<UnavailableContribution reason="disabled" size={size} />);
    expect(screen.getByRole('note')).toHaveAttribute('data-size', size);
  });

  it('defaults to the card size with a dashed frame', () => {
    render(<UnavailableContribution reason="disabled" />);
    const note = screen.getByRole('note');
    expect(note).toHaveAttribute('data-size', 'card');
    expect(note.className).toContain('border-dashed');
  });

  it('framed={false} drops the frame (for hosts that draw their own)', () => {
    render(<UnavailableContribution reason="disabled" framed={false} />);
    expect(screen.getByRole('note').className).not.toContain('border-dashed');
  });

  it('host texts override the defaults (i18n)', () => {
    render(<UnavailableContribution reason="unentitled" label="Nicht im Tarif" detail="Ihr Tarif enthält dies nicht." />);
    const note = screen.getByRole('note');
    expect(note).toHaveTextContent('Nicht im Tarif');
    expect(note).toHaveTextContent('Ihr Tarif enthält dies nicht.');
    expect(note).not.toHaveTextContent(UNAVAILABLE_REASONS.unentitled.label);
  });

  it('detail={null} hides the explanation', () => {
    render(<UnavailableContribution reason="banned" detail={null} />);
    expect(screen.getByRole('note')).not.toHaveTextContent(UNAVAILABLE_REASONS.banned.detail);
  });

  it('a title becomes the heading and the reason moves to a badge', () => {
    render(<UnavailableContribution reason="quarantined" title="Call log" />);
    const note = screen.getByRole('note');
    expect(note).toHaveTextContent('Call log');
    expect(note).toHaveTextContent('Quarantined');
  });

  it('runs the action on click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<UnavailableContribution reason="failed" action={{ label: 'Retry', onClick }} />);
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('an action with href renders as a link', () => {
    render(<UnavailableContribution reason="unentitled" size="node" action={{ label: 'Upgrade', href: '/billing' }} />);
    expect(screen.getByRole('link', { name: 'Upgrade' })).toHaveAttribute('href', '/billing');
  });

  it('inline: the detail is the tooltip and is kept for screen readers', () => {
    render(<UnavailableContribution reason="no-access" size="inline" />);
    const note = screen.getByRole('note');
    expect(note).toHaveAttribute('title', UNAVAILABLE_REASONS['no-access'].detail);
    expect(note.querySelector('.sr-only')).toHaveTextContent(UNAVAILABLE_REASONS['no-access'].detail);
  });

  it('a custom icon replaces the default one', () => {
    render(<UnavailableContribution reason="missing" icon={<span data-testid="custom-icon" />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('passes extra attributes to the root', () => {
    render(<UnavailableContribution reason="retired" data-testid="placeholder" />);
    expect(screen.getByTestId('placeholder')).toHaveAttribute('data-reason', 'retired');
  });
});
