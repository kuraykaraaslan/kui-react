import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toggle } from './Toggle';

describe('Toggle async states', () => {
  it('pending disables the input and sets aria-busy', () => {
    render(<Toggle id="t" label="Heater" checked onChange={() => {}} pending />);
    const sw = screen.getByRole('switch');
    expect(sw).toBeDisabled();
    expect(sw).toHaveAttribute('aria-busy', 'true');
  });
  it('mismatch marks the switch invalid and links the hint', () => {
    render(<><Toggle id="t" label="Heater" checked onChange={() => {}} mismatch describedBy="hint" /><p id="hint">Device says off</p></>);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-invalid', 'true');
    expect(sw).toHaveAccessibleDescription('Device says off');
  });
});
