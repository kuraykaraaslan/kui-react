import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

// The tooltip element is always in the DOM (role="tooltip" never
// unmounts) — visibility is purely an opacity-0/opacity-100 class swap, so
// tests assert on that class rather than presence/absence in the document.

describe('Tooltip', () => {
  it('renders the trigger content and a hidden (opacity-0) tooltip by default', () => {
    render(
      <Tooltip content="Helpful text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful text');
    expect(screen.getByRole('tooltip').className).toContain('opacity-0');
  });

  it('the trigger is wired to the tooltip via aria-describedby', () => {
    render(
      <Tooltip content="Helpful text">
        <button>Hover me</button>
      </Tooltip>,
    );
    const wrapper = screen.getByRole('button').parentElement as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-describedby', screen.getByRole('tooltip').id);
  });

  it('shows on mouse enter and hides on mouse leave', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helpful text">
        <button>Hover me</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip');
    await user.hover(screen.getByRole('button'));
    expect(tooltip.className).toContain('opacity-100');
    await user.unhover(screen.getByRole('button'));
    expect(tooltip.className).toContain('opacity-0');
  });

  it('shows on focus and hides on blur', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helpful text">
        <button>Hover me</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip');
    await user.tab(); // focuses the button
    expect(tooltip.className).toContain('opacity-100');
    await user.tab(); // moves focus away
    expect(tooltip.className).toContain('opacity-0');
  });

  it('renders an arrow element only when arrow is true', async () => {
    const user = userEvent.setup();
    const { rerender, container } = render(
      <Tooltip content="Text">
        <button>Hover me</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();

    rerender(
      <Tooltip content="Text" arrow>
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  describe('delay', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('delays becoming visible by the given number of milliseconds', () => {
      // fireEvent, not userEvent.hover: userEvent's pointer simulation has
      // its own internal async delays that deadlock against fake timers
      // unless painstakingly wired together — fireEvent dispatches the DOM
      // event synchronously, which is all this component's onMouseEnter
      // handler actually needs.
      render(
        <Tooltip content="Text" delay={300}>
          <button>Hover me</button>
        </Tooltip>,
      );
      const tooltip = screen.getByRole('tooltip');
      fireEvent.mouseEnter(screen.getByRole('button').parentElement as HTMLElement);
      expect(tooltip.className).toContain('opacity-0');
      // The state update happens inside the setTimeout callback, outside
      // React's own event handling, so it needs an explicit act() to flush
      // before the DOM reflects it.
      act(() => vi.advanceTimersByTime(299));
      expect(tooltip.className).toContain('opacity-0');
      act(() => vi.advanceTimersByTime(1));
      expect(tooltip.className).toContain('opacity-100');
    });
  });
});
