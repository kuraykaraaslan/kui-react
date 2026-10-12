import { describe, expect, it } from 'vitest';
import { nodeName } from './names';

describe('nodeName', () => {
  it('is the label, else the block title, else the type', () => {
    expect(nodeName({ label: 'Gate', type: 'FILTER' }, { title: 'Filter' })).toBe('Gate');
    expect(nodeName({ label: '', type: 'FILTER' }, { title: 'Filter' })).toBe('Filter');
    expect(nodeName({ label: '   ', type: 'FILTER' }, { title: 'Filter' })).toBe('Filter');
    expect(nodeName({ label: '', type: 'x.y' }, null)).toBe('x.y');
    expect(nodeName({ label: '', type: 'x.y' }, { title: '' })).toBe('x.y');
    expect(nodeName({ label: '', type: 'x.y' })).toBe('x.y');
  });
});
