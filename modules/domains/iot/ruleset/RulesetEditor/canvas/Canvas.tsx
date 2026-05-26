'use client';
import { NODE_VISUALS, portColor } from '../node-meta';
import { NODE_W, PORT_R, inputPortY, outputPortY, bezier } from '../geometry';
import { RuleNode } from './RuleNode';
import { RuleEdge } from './RuleEdge';
import type { RuleNode as RuleNodeT, RuleEdge as RuleEdgeT } from '../../../types';

export function Canvas({
  containerRef, nodes, edges,
  selectedId, editingNodeId, dragNodeId, connecting, mouse, readOnly,
  onCanvasMouseDown, onMouseMove, onMouseUp, onDrop, onDragOver,
  onNodeMouseDown, onNodeMouseUp, onOutputPortDown, onInputPortUp, onDeleteEdge,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  nodes: RuleNodeT[];
  edges: RuleEdgeT[];
  selectedId: string | null;
  editingNodeId: string | null;
  dragNodeId: string | null;
  connecting: { nodeId: string; portIdx: number; x: number; y: number } | null;
  mouse: { x: number; y: number };
  readOnly: boolean;
  onCanvasMouseDown: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onNodeMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onNodeMouseUp: (nodeId: string) => void;
  onOutputPortDown: (e: React.MouseEvent, nodeId: string, portIdx: number) => void;
  onInputPortUp: (e: React.MouseEvent, nodeId: string, portIdx: number) => void;
  onDeleteEdge: (edgeId: string) => void;
}) {
  const liveStart = connecting
    ? (() => { const n = nodes.find((x) => x.nodeId === connecting.nodeId); return n ? { x: n.x + NODE_W, y: outputPortY(n, connecting.portIdx) } : null; })()
    : null;

  return (
    <div ref={containerRef}
      className="relative min-h-0 flex-1 overflow-hidden select-none"
      style={{ backgroundImage:'radial-gradient(circle, var(--border) 1.5px, transparent 1.5px)', backgroundSize:'24px 24px', backgroundColor:'var(--surface-base)', cursor: connecting ? 'crosshair' : 'default' }}
      onDrop={onDrop} onDragOver={onDragOver}
      onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseDown={onCanvasMouseDown}>

      <svg className="absolute inset-0 h-full w-full overflow-visible" style={{ zIndex:10, pointerEvents:'none' }}>
        <defs>
          <marker id="re-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill="context-stroke" />
          </marker>
        </defs>
        {edges.map((edge) => (
          <RuleEdge key={edge.edgeId} edge={edge} nodes={nodes} readOnly={readOnly} onDelete={onDeleteEdge} />
        ))}
        {liveStart && (
          <path d={bezier(liveStart.x, liveStart.y, mouse.x, mouse.y)}
            stroke="var(--border-strong)" strokeWidth={2} fill="none" strokeDasharray="6 3" />
        )}
        {nodes.map((node) => {
          const v = NODE_VISUALS[node.type];
          return (
            <g key={`ports-${node.nodeId}`}>
              {v.inputs.map((port, i) => (
                <circle key={`in-${port.id}`} cx={node.x} cy={inputPortY(node, i)} r={PORT_R}
                  fill="var(--surface-base)" stroke="var(--border-strong)" strokeWidth={2}
                  style={{ pointerEvents:'auto', cursor:'crosshair' }}
                  className="transition-colors hover:fill-primary-subtle hover:stroke-primary"
                  onMouseUp={(e) => onInputPortUp(e as unknown as React.MouseEvent, node.nodeId, i)} />
              ))}
              {v.outputs.map((port, i) => {
                const c = portColor(port.id);
                return (
                  <circle key={`out-${port.id}`} cx={node.x + NODE_W} cy={outputPortY(node, i)} r={PORT_R}
                    fill={c} stroke={c} strokeWidth={1.5}
                    style={{ pointerEvents:'auto', cursor:'crosshair', opacity:0.9 }}
                    className="transition-opacity hover:opacity-100"
                    onMouseDown={(e) => { e.stopPropagation(); onOutputPortDown(e as unknown as React.MouseEvent, node.nodeId, i); }} />
                );
              })}
            </g>
          );
        })}
      </svg>

      {nodes.map((node) => (
        <RuleNode
          key={node.nodeId}
          node={node}
          isEditing={editingNodeId === node.nodeId}
          isSelected={selectedId === node.nodeId}
          isDragging={dragNodeId === node.nodeId}
          onMouseDown={(e) => onNodeMouseDown(e, node.nodeId)}
          onMouseUp={() => onNodeMouseUp(node.nodeId)}
        />
      ))}

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex select-none flex-col items-center justify-center gap-1">
          <p className="text-sm font-medium text-text-secondary">Drag nodes from the palette to start</p>
          <p className="text-xs text-text-secondary">
            Connect <span className="font-bold text-primary">●</span> output ports to <span className="font-bold">○</span> input ports
          </p>
        </div>
      )}
    </div>
  );
}
