import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { DEFAULT_MESSAGES, fillTemplate } from './messages';

describe('fillTemplate', () => {
  it('puts the parts where the marks are, and leaves a mark with no part as written', () => {
    const { container } = render(<p>{fillTemplate('a {x} b {y} c {x}', { x: <b>X</b> })}</p>);
    expect(container.textContent).toBe('a X b {y} c X');
    expect(container.querySelectorAll('b')).toHaveLength(2);
  });
  it('is just the text when there is no mark', () => {
    const { container } = render(<p>{fillTemplate('plain', {})}</p>);
    expect(container.textContent).toBe('plain');
  });
});

describe('the default messages', () => {
  it('have eight group colour names and the marks every template part needs', () => {
    expect(DEFAULT_MESSAGES.groupColours).toHaveLength(8);
    expect(DEFAULT_MESSAGES.paletteHelpWire).toContain('{out}');
    expect(DEFAULT_MESSAGES.paletteHelpWire).toContain('{in}');
    expect(DEFAULT_MESSAGES.panelPlaceholderBody).toContain('{source}');
    expect(DEFAULT_MESSAGES.panelPlaceholderBody).toContain('{type}');
  });
});
