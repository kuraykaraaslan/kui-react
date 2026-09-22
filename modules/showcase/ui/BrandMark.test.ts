import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ARMS, FORK } from '@/brand/geometry.mjs';

// Brand_Positioning_Rules/logo-system.md: arms at exactly 45 degrees, and the
// in-app mark colors from theme tokens — never hex.
describe('BrandMark', () => {
  it('forks both arms at exactly 45 degrees (dx === dy)', () => {
    for (const tip of ARMS) expect(Math.abs(tip.x - FORK.x)).toBe(Math.abs(tip.y - FORK.y));
  });

  it('colors from theme tokens only', () => {
    const source = readFileSync(path.join(__dirname, 'BrandMark.tsx'), 'utf8');
    expect(source).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(source).toContain('var(--brand-tone-two)');
  });
});
