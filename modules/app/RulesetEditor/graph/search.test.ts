import { describe, expect, it } from 'vitest';
import { catalogFromBlocks } from '../catalog';
import { findNodes, foldText } from './search';
import type { GraphNode } from './types';

const catalog = catalogFromBlocks([[
  { type: 'action.wifi_set', title: 'Set Wi-Fi' }, { type: 'trigger.quota', title: 'Data quota' }, { type: 'logic.change', title: 'Change' },
]]);
const node = (nodeId: string, type: string, label: string, extra: Partial<GraphNode> = {}): GraphNode => ({ nodeId, type, label, x: 0, y: 0, ...extra });
const nodes = [
  node('n1', 'trigger.quota', 'Kota aşıldı'),
  node('n2', 'action.wifi_set', 'Gece kapat', { description: 'Misafir ağını kapatır' }),
  node('n3', 'logic.change', 'İşlem'),
  node('abc', 'logic.change', 'Other'),
];

describe('foldText', () => {
  it('drops case, accents and the Turkish dots, and treats - _ and spaces alike', () => {
    expect(foldText('Kota AŞILDI')).toBe('kota asildi');
    expect(foldText('İstanbul ıslak')).toBe('istanbul islak');
    expect(foldText('Crème  brûlée')).toBe('creme brulee');
    expect(foldText('Wi-Fi_set')).toBe('wi fi set');
    expect(foldText('  a  ')).toBe('a');
  });
});

describe('findNodes', () => {
  it('looks into the text of a comment', () => {
    const withNote = [...nodes, node('c1', 'note.comment', 'Comment', { config: { text: 'Remember the Gürültü filter' } })];
    expect(findNodes(withNote, 'gurultu', catalog)).toEqual(['c1']);
  });
  it('finds by label, folded', () => {
    expect(findNodes(nodes, 'asildi', catalog)).toEqual(['n1']);
    expect(findNodes(nodes, 'ISLEM', catalog)).toEqual(['n3']);
  });
  it('finds by type, by block title, by description and by id', () => {
    expect(findNodes(nodes, 'wifi_set', catalog)).toEqual(['n2']);
    expect(findNodes(nodes, 'data quota', catalog)).toEqual(['n1']);
    expect(findNodes(nodes, 'misafir', catalog)).toEqual(['n2']);
    expect(findNodes(nodes, 'abc', catalog)).toEqual(['abc']);
  });
  it('a dash or a space in the query does not matter', () => {
    expect(findNodes(nodes, 'wi-fi', catalog)).toEqual(['n2']);
    expect(findNodes(nodes, 'wi fi', catalog)).toEqual(['n2']);
    expect(findNodes(nodes, 'wifi', catalog)).toEqual(['n2']);
  });
  it('every word must be found, and the result keeps the order of the graph', () => {
    expect(findNodes(nodes, 'wifi gece', catalog)).toEqual(['n2']);
    expect(findNodes(nodes, 'wifi quota', catalog)).toEqual([]);
    expect(findNodes(nodes, 'change', catalog)).toEqual(['n3', 'abc']);
  });
  it('an empty or blank query matches nothing', () => {
    expect(findNodes(nodes, '', catalog)).toEqual([]);
    expect(findNodes(nodes, '   ', catalog)).toEqual([]);
  });
});
