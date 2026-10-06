import { describe, expect, it } from 'vitest';
import { addGroup, groupBounds, groupOf, pruneGroups, ungroup, updateGroup, GROUP_HEADER_H } from './groups';
import { newEdgeId, newGroupId, newId, newNodeId, slug, clone } from './ids';
import type { RuleGroup } from './types';

const g = (groupId: string, nodeIds: string[], name = groupId, color = 0): RuleGroup => ({ groupId, name, color, nodeIds });

describe('ids', () => {
  it('makes slugs without accents or odd characters', () => {
    expect(slug('Kota Aşımı / Misafir', 'x')).toBe('kota-asimi-misafir');
    expect(slug('!!!', 'fallback')).toBe('fallback');
    expect(slug('a'.repeat(40), 'x')).toHaveLength(28);
  });
  it('makes ids unique among the used ones', () => {
    expect(newId(['kota', 'kota-2'], 'Kota', 'f')).toBe('kota-3');
    expect(newId(new Set(), undefined, 'flow')).toBe('flow');
    expect(newId(['a'.repeat(28)], 'a'.repeat(40))).toBe('a'.repeat(27) + '-2');
  });
  it('finds the next free node, edge and group id, also around imported ids', () => {
    expect(newNodeId([])).toBe('n1');
    expect(newNodeId([{ nodeId: 'n1' }, { nodeId: 'n3' }])).toBe('n4');
    expect(newNodeId([{ nodeId: 'n3' }, { nodeId: 'x' }])).toBe('n4');
    expect(newNodeId([{ nodeId: 'n1' }], 'pin')).toBe('pin2');
    expect(newEdgeId([{ edgeId: 'e2' }])).toBe('e3');
    expect(newGroupId([g('g1', ['a']), g('g2', ['b'])])).toBe('g3');
  });
  it('clones deeply and keeps undefined', () => {
    const a = { x: { y: [1] } };
    const b = clone(a);
    b.x.y.push(2);
    expect(a.x.y).toEqual([1]);
    expect(clone(undefined)).toBeUndefined();
  });
});

describe('groups', () => {
  it('adds a group and takes the nodes out of other groups', () => {
    const { groups, group } = addGroup([g('g1', ['a', 'b']), g('g2', ['c'])], ['b', 'c'], 'New', 3);
    expect(group).toEqual({ groupId: 'g2', name: 'New', color: 3, nodeIds: ['b', 'c'] });
    expect(groups.map((x) => [x.groupId, x.nodeIds])).toEqual([['g1', ['a']], ['g2', ['b', 'c']]]);
  });
  it('does not change the groups it was given', () => {
    const before = [g('g1', ['a', 'b'])];
    addGroup(before, ['a'], 'x');
    expect(before[0].nodeIds).toEqual(['a', 'b']);
  });
  it('removes, renames and recolours a group', () => {
    const groups = [g('g1', ['a']), g('g2', ['b'])];
    expect(ungroup(groups, 'g1').map((x) => x.groupId)).toEqual(['g2']);
    expect(updateGroup(groups, 'g2', { name: 'Zone', color: 5 })[1]).toMatchObject({ name: 'Zone', color: 5 });
    expect(updateGroup(groups, 'g2', { name: 'Zone' })[0]).toBe(groups[0]);
  });
  it('drops members that are gone and groups that became empty', () => {
    const groups = pruneGroups([g('g1', ['a', 'x']), g('g2', ['y'])], [{ nodeId: 'a' }, { nodeId: 'b' }]);
    expect(groups).toEqual([g('g1', ['a'])]);
  });
  it('finds the group of a node', () => {
    expect(groupOf([g('g1', ['a']), g('g2', ['b'])], 'b')?.groupId).toBe('g2');
    expect(groupOf([g('g1', ['a'])], 'z')).toBeUndefined();
  });
  it('computes the frame around the members, with room for the name tab', () => {
    const nodes = [{ nodeId: 'a', x: 100, y: 50 }, { nodeId: 'b', x: 400, y: 200 }, { nodeId: 'c', x: 0, y: 0 }];
    const box = groupBounds(nodes, g('g1', ['a', 'b']), 184, () => 80);
    expect(box).toEqual({ x: 84, y: 50 - 16 - GROUP_HEADER_H, w: 400 + 184 - 100 + 32, h: 200 + 80 - 50 + 32 + GROUP_HEADER_H });
    expect(groupBounds(nodes, g('g9', ['zzz']), 184, () => 80)).toBeNull();
    expect(groupBounds(nodes, g('g1', ['a']), 100, () => 40, 0)).toEqual({ x: 100, y: 50 - GROUP_HEADER_H, w: 100, h: 40 + GROUP_HEADER_H });
  });
});
