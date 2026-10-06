import { DEFAULT_SCRIPTS } from '../RulesetEditor/default-scripts';
import { NODE_GROUPS, NODE_VISUALS, type NodeVisual } from '../RulesetEditor/node-meta';
import type { BlockDecl, Catalog } from './types';

function declOf(visual: NodeVisual): BlockDecl {
  const portLabels: Record<string, string> = {};
  for (const port of [...visual.inputs, ...visual.outputs]) portLabels[port.id] = port.label;
  const placeholder = visual.type === 'PLACEHOLDER';
  return {
    type: visual.type,
    title: visual.displayLabel,
    description: visual.description,
    group: visual.group,
    category: visual.group,
    // the script of a built-in node is the one field its form shows; it is stored in node.script
    params: placeholder
      ? {}
      : { script: { type: 'code', lang: 'js', label: 'Script', store: 'script', default: DEFAULT_SCRIPTS[visual.type] } },
    inputs: visual.inputs.length ? 1 : 0,
    outputs: visual.outputs.map((port) => port.id),
    port_labels: portLabels,
    visual: { icon: visual.icon, iconColor: visual.iconColor, headerBg: visual.headerBg },
    internal: visual.internal,
  };
}

/** The ten node types the editor shipped with (plus the internal placeholder), as a catalog. */
export const BUILTIN_CATALOG: Catalog = {
  blocks: Object.fromEntries(Object.values(NODE_VISUALS).map((visual) => [visual.type, declOf(visual)])),
  groups: NODE_GROUPS.map((group) => ({ id: group.id, label: group.label })),
};
