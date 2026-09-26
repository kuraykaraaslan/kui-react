'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassMinus, faMagnifyingGlassPlus, faExpand, faTrash } from '@fortawesome/free-solid-svg-icons';
import { nodePorts, portColor } from '../node-meta';
import { NODE_W, PORT_R, GRID_SIZE, inputPortY, outputPortY, bezier, type View } from '../geometry';
import { RuleNode, type RuleNodeStatus } from './RuleNode';
import { RuleEdge } from './RuleEdge';
import type { RuleNode as RuleNodeT, RuleEdge as RuleEdgeT } from '../../../types';

const zoomBtn = 'inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';

export function Canvas({
  containerRef, nodes, edges, view,
  selectedId, selectedEdgeId, editingNodeId, dragNodeId, connecting, mouse, readOnly, nodeStatus,
  onPointerDown, onPointerDownCapture, onPointerMove, onPointerUp, onContextMenu, onWheel, onKeyDown, onDrop, onDragOver, children,
  onNodePointerDown, onOutputPortDown, onInputPortUp, onSelectEdge, onDeleteSelectedEdge,
  onZoomIn, onZoomOut, onFit,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  nodes: RuleNodeT[];
  edges: RuleEdgeT[];
  view: View;
  selectedId: string | null;
  selectedEdgeId: string | null;
  editingNodeId: string | null;
  dragNodeId: string | null;
  connecting: { nodeId: string; portIdx: number; x: number; y: number } | null;
  mouse: { x: number; y: number };
  readOnly: boolean;
  nodeStatus?: Record<string, RuleNodeStatus>;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerDownCapture: (e: React.PointerEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  /** overlays inside the canvas (context menu, palette button) */
  children?: React.ReactNode;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onWheel: (e: React.WheelEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onOutputPortDown: (e: React.PointerEvent, nodeId: string, portIdx: number) => void;
  onInputPortUp: (e: React.PointerEvent, nodeId: string, portIdx: number) => void;
  onSelectEdge: (edgeId: string) => void;
  onDeleteSelectedEdge: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}) {
  const liveStart = connecting
    ? (() => { const n = nodes.find((x) => x.nodeId === connecting.nodeId); return n ? { x: n.x + NODE_W, y: outputPortY(n, connecting.portIdx) } : null; })()
    : null;

  return (
    <div ref={containerRef}
      tabIndex={0} aria-label="Rule chain canvas"
      className="relative min-h-0 flex-1 overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus"
      style={{
        backgroundImage:'radial-gradient(circle, var(--border) 1.5px, transparent 1.5px)',
        backgroundSize:`${GRID_SIZE * view.k}px ${GRID_SIZE * view.k}px`,
        backgroundPosition:`${view.x}px ${view.y}px`,
        backgroundColor:'var(--surface-base)', cursor: connecting ? 'crosshair' : 'default', touchAction:'none',
      }}
      onDrop={onDrop} onDragOver={onDragOver} onWheel={onWheel} onKeyDown={onKeyDown}
      onPointerDown={onPointerDown} onPointerDownCapture={onPointerDownCapture} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp} onContextMenu={onContextMenu}>

      {/* the world: everything below moves and scales with the view */}
      <div className="absolute left-0 top-0" style={{ transform:`translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin:'0 0' }}>
        <svg className="absolute left-0 top-0 h-px w-px overflow-visible" style={{ zIndex:10, pointerEvents:'none' }}>
          <defs>
            <marker id="re-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill="context-stroke" />
            </marker>
          </defs>
          {edges.map((edge) => (
            <RuleEdge key={edge.edgeId} edge={edge} nodes={nodes} readOnly={readOnly}
              selected={selectedEdgeId === edge.edgeId} onSelect={onSelectEdge} />
          ))}
          {liveStart && (
            <path d={bezier(liveStart.x, liveStart.y, mouse.x, mouse.y)}
              stroke="var(--border-strong)" strokeWidth={2} fill="none" strokeDasharray="6 3" />
          )}
          {nodes.map((node) => {
            const v = nodePorts(node);
            return (
              <g key={`ports-${node.nodeId}`}>
                {v.inputs.map((port, i) => (
                  <circle key={`in-${port.id}`} cx={node.x} cy={inputPortY(node, i)} r={PORT_R}
                    data-in-node={node.nodeId} data-in-idx={i}
                    fill="var(--surface-base)" stroke="var(--border-strong)" strokeWidth={2}
                    style={{ pointerEvents:'auto', cursor:'crosshair' }}
                    className="transition-colors hover:fill-primary-subtle hover:stroke-primary"
                    onPointerUp={(e) => onInputPortUp(e, node.nodeId, i)} />
                ))}
                {v.outputs.map((port, i) => {
                  const c = portColor(port.id);
                  return (
                    <circle key={`out-${port.id}`} cx={node.x + NODE_W} cy={outputPortY(node, i)} r={PORT_R}
                      fill={c} stroke={c} strokeWidth={1.5}
                      style={{ pointerEvents:'auto', cursor:'crosshair', opacity:0.9 }}
                      className="transition-opacity hover:opacity-100"
                      onPointerDown={(e) => { e.stopPropagation(); onOutputPortDown(e, node.nodeId, i); }} />
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
            status={nodeStatus?.[node.nodeId]}
            onPointerDown={(e) => onNodePointerDown(e, node.nodeId)}
          />
        ))}
      </div>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex select-none flex-col items-center justify-center gap-1">
          <p className="text-sm font-medium text-text-secondary">Drag nodes from the palette to start</p>
          <p className="text-xs text-text-secondary">
            Connect <span className="font-bold text-primary">●</span> output ports to <span className="font-bold">○</span> input ports
          </p>
        </div>
      )}

      {children}

      {/* zoom and selection controls */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1 rounded-lg border border-border bg-surface-base p-1 shadow-sm"
        onPointerDown={(e) => e.stopPropagation()}>
        {!readOnly && selectedEdgeId && (
          <button type="button" onClick={onDeleteSelectedEdge}
            className="mr-1 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-error transition-colors hover:bg-error-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
            <FontAwesomeIcon icon={faTrash} className="h-3 w-3" aria-hidden="true" /> Delete connection
          </button>
        )}
        <button type="button" onClick={onZoomOut} aria-label="Zoom out" title="Zoom out" className={zoomBtn}>
          <FontAwesomeIcon icon={faMagnifyingGlassMinus} className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <span className="min-w-12 text-center text-xs tabular-nums text-text-secondary" aria-live="polite">{Math.round(view.k * 100)}%</span>
        <button type="button" onClick={onZoomIn} aria-label="Zoom in" title="Zoom in" className={zoomBtn}>
          <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button type="button" onClick={onFit} aria-label="Fit to screen" title="Fit to screen" className={zoomBtn}>
          <FontAwesomeIcon icon={faExpand} className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
