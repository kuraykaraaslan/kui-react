import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
  it('a bar with colour, track, thickness and an accessible value', () => {
    render(<Progress value={140} color="#ff0000" trackColor="#000000" thickness={12} label="Sales" />);
    const bar = screen.getByRole('progressbar', { name: 'Sales' });
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(bar.style.height).toBe('12px');
    expect(bar.style.background).toBe('rgb(0, 0, 0)');
    expect((bar.lastElementChild as HTMLElement).style.background).toBe('rgb(255, 0, 0)');
  });
  it('gradient fill, segments on the track and marks', () => {
    const { container } = render(<Progress value={50} gradient={['#0000ff', '#00ff00']} segments={[{ from: 0, to: 30, color: '#ff0000' }]} segmentOpacity={0.5} marks={[{ at: 75, label: 'Pace' }]} />);
    const fill = screen.getByRole('progressbar').lastElementChild as HTMLElement;
    expect(fill.style.backgroundImage).toContain('linear-gradient');
    expect(fill.style.backgroundSize).toBe('200% 100%');
    const seg = container.querySelector('[data-part="segment"]') as HTMLElement;
    expect(seg.style.width).toBe('30%');
    expect(seg.style.opacity).toBe('0.5');
    expect((container.querySelector('[data-part="mark"]') as HTMLElement).style.left).toBe('75%');
  });
  it('a ring and a half ring, fixed or filling their parent', () => {
    const { container, rerender } = render(<Progress shape="circle" value={25} diameter={120} showLabel />);
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('120');
    expect(container.querySelector('[data-part="fill"]')?.getAttribute('stroke-dasharray')).toBe('25 100');
    expect(screen.getByText('25%')).toBeInTheDocument();
    rerender(<Progress shape="semicircle" value={25} diameter="fill" gradient={['#000000', '#ffffff']} />);
    expect(container.querySelector('[data-shape="semicircle"]')).toBeTruthy();
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('100%');
    expect(container.querySelector('linearGradient')).toBeTruthy();
    expect((container.querySelector('[data-part="fill"]') as SVGElement).style.stroke).toMatch(/^url\(/);
  });
});
