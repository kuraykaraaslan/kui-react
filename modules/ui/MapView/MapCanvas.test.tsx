import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MapCanvas } from './MapCanvas';

describe('MapCanvas', () => {
  it('is a labelled card-less region with an English loading label by default', () => {
    render(<MapCanvas markers={[]} />);
    expect(screen.getByRole('region', { name: 'Map' })).toBeInTheDocument();
    expect(screen.getByText('Loading map…')).toBeInTheDocument();
  });
  it('accepts custom loading and aria labels', () => {
    render(<MapCanvas markers={[]} loadingLabel="Karte wird geladen…" ariaLabel="Devices" tiles={{ url: 'https://tiles.example/{z}/{x}/{y}.png', attribution: 'Example' }} />);
    expect(screen.getByRole('region', { name: 'Devices' })).toBeInTheDocument();
    expect(screen.getByText('Karte wird geladen…')).toBeInTheDocument();
  });
});
