'use client';
import { NODE_VISUALS, portColor, portEdgeLabel } from '../node-meta';
import { NODE_W, inputPortY, outputPortY, bezier } from '../geometry';
import type { RuleNode, RuleEdge as RuleEdgeType } from '../../../types';

export function RuleEdge({ edge, nodes, readOnly, onDelete }: {
  edge: RuleEdgeType;
  nodes: RuleNode[];
  readOnly: boolean;
  onDelete: (edgeId: string) => void;
}) {
  const src = nodes.find((n) => n.nodeId === edge.sourceNodeId);
  const tgt = nodes.find((n) => n.nodeId === edge.targetNodeId);
  if (!src || !tgt) return null;
  const srcIdx = NODE_VISUALS[src.type].outputs.findIndex((p) => p.id === edge.sourcePort);
  const tgtIdx = NODE_VISUALS[tgt.type].inputs.findIndex((p)  => p.id === edge.targetPort);
  if (srcIdx < 0 || tgtIdx < 0) return null;
  const sx = src.x + NODE_W, sy = outputPortY(src, srcIdx);
  const tx = tgt.x,          ty = inputPortY(tgt, tgtIdx);
  const color = portColor(edge.sourcePort), label = portEdgeLabel(edge.sourcePort);
  const midX = (sx + tx) / 2, midY = (sy + ty) / 2;
  const lw = label ? label.length * 5.5 + 16 : 0;
  return (
    <g className="group">
      <path d={bezier(sx,sy,tx,ty)} stroke="transparent" strokeWidth={14} fill="none"
        style={{ pointerEvents:'auto', cursor: readOnly ? 'default' : 'pointer' }}
        onClick={() => !readOnly && onDelete(edge.edgeId)} />
      <path d={bezier(sx,sy,tx,ty)} stroke={color} strokeWidth={2} fill="none"
        markerEnd="url(#re-arrow)" className="transition-opacity group-hover:opacity-60" />
      {label && (
        <g style={{ pointerEvents:'none' }}>
          <rect x={midX-lw/2} y={midY-9} width={lw} height={18} rx={9} fill="var(--surface-base)" stroke={color} strokeWidth={1.5} />
          <text x={midX} y={midY+4.5} textAnchor="middle" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="700" fill={color}>{label}</text>
        </g>
      )}
    </g>
  );
}
