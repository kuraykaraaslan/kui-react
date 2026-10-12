import { newGroupId } from './ids';
import type { GraphNode, RuleGroup } from './types';

/** height of the name tab above a group frame */
export const GROUP_HEADER_H = 20;
export const GROUP_PAD = 16;

/** Frame the nodes in a new group. A node belongs to one group, so the ids leave the other groups first. */
export function addGroup(groups: RuleGroup[], nodeIds: string[], name = '', color = 0): { groups: RuleGroup[]; group: RuleGroup } {
  const taken = new Set(nodeIds);
  const rest = groups
    .map((g) => ({ ...g, nodeIds: g.nodeIds.filter((id) => !taken.has(id)) }))
    .filter((g) => g.nodeIds.length);
  const group: RuleGroup = { groupId: newGroupId(rest), name, color, nodeIds: [...nodeIds] };
  return { groups: [...rest, group], group };
}

export function ungroup(groups: RuleGroup[], groupId: string): RuleGroup[] {
  return groups.filter((g) => g.groupId !== groupId);
}

export function updateGroup(groups: RuleGroup[], groupId: string, patch: Partial<Pick<RuleGroup, 'name' | 'color'>>): RuleGroup[] {
  return groups.map((g) => (g.groupId === groupId ? { ...g, ...patch } : g));
}

/** After nodes were deleted: members that are gone leave, empty groups go. */
export function pruneGroups(groups: RuleGroup[], nodes: Pick<GraphNode, 'nodeId'>[]): RuleGroup[] {
  const have = new Set(nodes.map((n) => n.nodeId));
  return groups.map((g) => ({ ...g, nodeIds: g.nodeIds.filter((id) => have.has(id)) })).filter((g) => g.nodeIds.length);
}

/** The group a node is in, if any. */
export function groupOf(groups: RuleGroup[], nodeId: string): RuleGroup | undefined {
  return groups.find((g) => g.nodeIds.includes(nodeId));
}

export type Bounds = { x: number; y: number; w: number; h: number };

/** The frame of a group around its nodes, with room for the name tab on top. `nodeHeight` gives the height of a node. */
export function groupBounds(
  nodes: Pick<GraphNode, 'nodeId' | 'x' | 'y'>[],
  group: RuleGroup,
  nodeWidth: number,
  nodeHeight: (node: Pick<GraphNode, 'nodeId' | 'x' | 'y'>) => number,
  pad = GROUP_PAD,
): Bounds | null {
  const members = nodes.filter((n) => group.nodeIds.includes(n.nodeId));
  if (!members.length) return null;
  const x0 = Math.min(...members.map((n) => n.x));
  const y0 = Math.min(...members.map((n) => n.y));
  const x1 = Math.max(...members.map((n) => n.x + nodeWidth));
  const y1 = Math.max(...members.map((n) => n.y + nodeHeight(n)));
  return { x: x0 - pad, y: y0 - pad - GROUP_HEADER_H, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad + GROUP_HEADER_H };
}
