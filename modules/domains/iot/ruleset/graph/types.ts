import type { RuleEdge, RuleGroup, RuleNode, RuleSubflow } from '../../types';

/**
 * The graph the editor works on. A node has any string type: one of the built-in types, or a block
 * type of the catalog the editor was given.
 */

export type GraphNode = RuleNode;
export type GraphEdge = RuleEdge;
export type { RuleGroup, RuleSubflow };

/** token names of the eight group colours, by `RuleGroup.color` */
export const GROUP_COLORS = ['primary', 'success', 'warning', 'error', 'info', 'secondary', 'text-secondary', 'border-strong'] as const;

export type Graph<N extends GraphNode = GraphNode, E extends GraphEdge = GraphEdge> = {
  nodes: N[];
  edges: E[];
  groups: RuleGroup[];
};

/** id of the node type that is an instance of a subflow */
export const SUBFLOW_PREFIX = 'subflow.';

/** `subflow.<id>` to `<id>`, or null for any other type */
export function subflowIdOf(type: string): string | null {
  const m = /^subflow\.([a-z0-9_-]{1,32})$/.exec(type);
  return m ? m[1] : null;
}

/** ids of subflows and flows: lower case letters, digits, `_` and `-` */
export const ID_RE = /^[a-z0-9_-]{1,32}$/;
/** names of subflow output ports */
export const PORT_RE = /^[a-z][a-z0-9_]{0,15}$/;
