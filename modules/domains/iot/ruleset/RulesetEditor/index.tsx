'use client';
import { useState, useRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faBug, faClone, faCopy, faPaste, faTrash, faExpand, faPlus } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import type { RuleNode, RuleEdge } from '../../types';
import { DEFAULT_SCRIPTS } from './default-scripts';
import { Palette } from './canvas/Palette';
import { Canvas } from './canvas/Canvas';
import type { RuleNodeStatus } from './canvas/RuleNode';
import { ContextMenu, type ContextMenuItem } from './canvas/ContextMenu';
import { ADDABLE_VISUALS } from './node-meta';
import { NodeEditorPanel } from './panels/NodeEditorPanel';
import { NodeDebugModal } from './modals/NodeDebugModal';
import { RulesetDebugModal } from './modals/RulesetDebugModal';
import { useNodeDrag } from './hooks/useNodeDrag';
import { useEdgeConnect } from './hooks/useEdgeConnect';
import { usePaletteDrop } from './hooks/usePaletteDrop';
import { NODE_W, ZOOM_MIN, ZOOM_MAX, nodeHeight, type View, type Point } from './geometry';
import type { RuleNodeType } from '../../types';

export type { RuleNodeStatus };

/* ─── Public ref API ──────────────────────────────────────────────────────── */

export type RulesetEditorRef = {
  openRulesetDebug: () => void;
  fit: () => void;
  /** the current graph, e.g. to save it */
  getGraph: () => { nodes: RuleNode[]; edges: RuleEdge[] };
};

export type RulesetEditorProps = {
  initialNodes?: RuleNode[];
  initialEdges?: RuleEdge[];
  readOnly?: boolean;
  className?: string;
  chainName?: string;
  /** live state per node id, shown under the node (e.g. from a running chain) */
  nodeStatus?: Record<string, RuleNodeStatus>;
  ref?: React.Ref<RulesetEditorRef>;
};

export function RulesetEditor({
  initialNodes = [], initialEdges = [],
  readOnly = false, className,
  chainName = 'Rule Chain', nodeStatus, ref,
}: RulesetEditorProps) {
  const [nodes, setNodes]         = useState<RuleNode[]>(initialNodes);
  const [edges, setEdges]         = useState<RuleEdge[]>(initialEdges);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [view, setView]           = useState<View>({ x: 0, y: 0, k: 1 });
  const [mouse, setMouse]         = useState({ x: 0, y: 0 });
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel]       = useState('');
  const [draftScript, setDraftScript]     = useState('');
  const [debugNodeId, setDebugNodeId]     = useState<string | null>(null);
  const [rulesetDebugOpen, setRulesetDebugOpen] = useState(false);
  const [dbgMsg,     setDbgMsg]     = useState('{\n  "temperature": 92,\n  "humidity": 65\n}');
  const [dbgMeta,    setDbgMeta]    = useState('{\n  "deviceId": "dev-001",\n  "zone": "A"\n}');
  const [dbgMsgType, setDbgMsgType] = useState('POST_TELEMETRY_REQUEST');

  const containerRef  = useRef<HTMLDivElement>(null);
  const nodeSeq       = useRef(initialNodes.length);
  const edgeSeq       = useRef(initialEdges.length);
  const pan           = useRef<{ cx: number; cy: number; vx: number; vy: number; moved: boolean } | null>(null);
  /* context menu (right click, long press), clipboard, phone palette sheet, pinch */
  const [menu, setMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);
  const [clip, setClip] = useState<RuleNode | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const longPress     = useRef<{ timer: number; x: number; y: number } | null>(null);
  const pointers      = useRef(new Map<number, Point>());
  const pinch         = useRef<{ d0: number; k0: number; vx: number; vy: number; cx: number; cy: number } | null>(null);

  /* screen → world (pan and zoom) */
  function toWorld(clientX: number, clientY: number) {
    const r = containerRef.current?.getBoundingClientRect();
    return r ? { x: (clientX - r.left - view.x) / view.k, y: (clientY - r.top - view.y) / view.k } : { x: 0, y: 0 };
  }

  function zoomAt(factor: number, cx?: number, cy?: number) {
    const r = containerRef.current?.getBoundingClientRect();
    const px = cx ?? (r ? r.width / 2 : 0), py = cy ?? (r ? r.height / 2 : 0);
    setView((v) => {
      const k = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, v.k * factor));
      return { k, x: px - (px - v.x) * k / v.k, y: py - (py - v.y) * k / v.k };
    });
  }

  function fit() {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r || !nodes.length) { setView({ x: 0, y: 0, k: 1 }); return; }
    const x0 = Math.min(...nodes.map((n) => n.x)), y0 = Math.min(...nodes.map((n) => n.y));
    const x1 = Math.max(...nodes.map((n) => n.x + NODE_W)), y1 = Math.max(...nodes.map((n) => n.y + nodeHeight(n)));
    const k = Math.min(1.2, Math.max(ZOOM_MIN, Math.min((r.width - 80) / (x1 - x0), (r.height - 80) / (y1 - y0))));
    setView({ k, x: (r.width - (x1 - x0) * k) / 2 - x0 * k, y: (r.height - (y1 - y0) * k) / 2 - y0 * k });
  }

  useImperativeHandle(ref, () => ({ openRulesetDebug: () => setRulesetDebugOpen(true), fit, getGraph: () => ({ nodes, edges }) }));

  const edgeConnect  = useEdgeConnect({ nodes, setEdges, edgeSeq, readOnly, setMouse });
  const nodeDrag     = useNodeDrag({ nodes, setNodes, toWorld, readOnly, connecting: edgeConnect.connecting });
  const paletteDrop  = usePaletteDrop({ setNodes, nodeSeq, toWorld });

  function openEditor(nodeId: string) {
    const node = nodes.find((n) => n.nodeId === nodeId);
    if (!node) return;
    setEditingNodeId(nodeId);
    setDraftLabel(node.label);
    setDraftScript(node.script ?? DEFAULT_SCRIPTS[node.type]);
  }

  function onNodePointerDown(e: React.PointerEvent, nodeId: string) {
    setSelectedId(nodeId);
    setSelectedEdgeId(null);
    nodeDrag.onNodePointerDown(e, nodeId);
  }

  /* empty canvas: start panning (a click without moving clears the selection) */
  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    containerRef.current?.focus({ preventScroll: true });
    pan.current = { cx: e.clientX, cy: e.clientY, vx: view.x, vy: view.y, moved: false };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const lp = longPress.current;
    if (lp && Math.abs(e.clientX - lp.x) + Math.abs(e.clientY - lp.y) > 8) cancelLongPress();
    const pz = pinch.current;
    if (pz) {
      const [a, b] = Array.from(pointers.current.values());
      if (!a || !b) return;
      const k = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, pz.k0 * Math.hypot(a.x - b.x, a.y - b.y) / pz.d0));
      setView({ k, x: pz.cx - (pz.cx - pz.vx) * k / pz.k0, y: pz.cy - (pz.cy - pz.vy) * k / pz.k0 });
      return;
    }
    if (edgeConnect.connecting) setMouse(toWorld(e.clientX, e.clientY));
    const p = pan.current;
    if (p && !nodeDrag.dragNodeId && !edgeConnect.connecting) {
      p.moved ||= Math.abs(e.clientX - p.cx) + Math.abs(e.clientY - p.cy) > 3;
      setView((v) => ({ ...v, x: p.vx + e.clientX - p.cx, y: p.vy + e.clientY - p.cy }));
      return;
    }
    nodeDrag.applyPointerMove(e);
  }

  function onPointerUp(e: React.PointerEvent) {
    cancelLongPress();
    pointers.current.delete(e.pointerId);
    if (pinch.current) {
      if (!pointers.current.size) pinch.current = null;
      return;
    }
    const dragged = nodeDrag.dragNodeId;
    if (edgeConnect.connecting) edgeConnect.finishAt(e.clientX, e.clientY);
    else if (dragged && !nodeDrag.dragMoved.current) openEditor(dragged);
    else if (!dragged && pan.current && !pan.current.moved) { setSelectedId(null); setSelectedEdgeId(null); }
    nodeDrag.endDrag();
    pan.current = null;
  }

  function cancelLongPress() {
    if (longPress.current) { window.clearTimeout(longPress.current.timer); longPress.current = null; }
  }

  /* every pointer (nodes and ports too): two fingers pinch, a touch held still opens the menu */
  function onPointerDownCapture(e: React.PointerEvent) {
    setMenu(null);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      cancelLongPress();
      nodeDrag.endDrag();
      edgeConnect.clearConnecting();
      pan.current = null;
      const [a, b] = Array.from(pointers.current.values());
      const r = containerRef.current?.getBoundingClientRect();
      pinch.current = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, k0: view.k, vx: view.x, vy: view.y,
        cx: (a.x + b.x) / 2 - (r?.left ?? 0), cy: (a.y + b.y) / 2 - (r?.top ?? 0) };
      return;
    }
    if (e.pointerType === 'touch') {
      const x = e.clientX, y = e.clientY, target = e.target as Element;
      cancelLongPress();
      longPress.current = { x, y, timer: window.setTimeout(() => {
        longPress.current = null;
        nodeDrag.endDrag();
        edgeConnect.clearConnecting();
        pan.current = null;
        openMenu(x, y, target);
      }, 550) };
    }
  }

  function onContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    openMenu(e.clientX, e.clientY, e.target as Element);
  }

  function duplicate(n: RuleNode, at: Point) {
    nodeSeq.current++;
    const nodeId = `n${nodeSeq.current}`;
    setNodes((p) => [...p, { ...n, nodeId, x: Math.round(at.x), y: Math.round(at.y) }]);
    setSelectedId(nodeId);
  }

  /* the menu for what is under the pointer: a node, a connection or the canvas */
  function openMenu(clientX: number, clientY: number, target: Element) {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const at = toWorld(clientX, clientY);
    const nodeId = target.closest<HTMLElement>('[data-node-id]')?.dataset.nodeId;
    const edgeId = target.closest<SVGElement>('[data-edge-id]')?.dataset.edgeId;
    let items: ContextMenuItem[];
    if (nodeId) {
      const n = nodes.find((x) => x.nodeId === nodeId);
      if (!n) return;
      setSelectedId(nodeId);
      setSelectedEdgeId(null);
      items = [
        { kind: 'item', label: readOnly ? 'View' : 'Edit', icon: faPenToSquare, onSelect: () => openEditor(nodeId) },
        { kind: 'item', label: 'Debug node', icon: faBug, onSelect: () => setDebugNodeId(nodeId) },
        { kind: 'separator' },
        { kind: 'item', label: 'Copy', icon: faCopy, onSelect: () => setClip(n) },
        ...(readOnly ? [] : [
          { kind: 'item', label: 'Duplicate', icon: faClone, onSelect: () => duplicate(n, { x: n.x + 32, y: n.y + 32 }) },
          { kind: 'separator' },
          { kind: 'item', label: 'Delete', icon: faTrash, danger: true, onSelect: () => deleteNode(nodeId) },
        ] as ContextMenuItem[]),
      ];
    }
    else if (edgeId) {
      setSelectedEdgeId(edgeId);
      setSelectedId(null);
      if (readOnly) return;
      items = [{ kind: 'item', label: 'Delete connection', icon: faTrash, danger: true, onSelect: () => deleteEdge(edgeId) }];
    }
    else {
      items = [
        ...(readOnly ? [] : [
          ...ADDABLE_VISUALS.map((v): ContextMenuItem => ({ kind: 'item', label: `Add ${v.displayLabel}`, icon: v.icon,
            onSelect: () => setSelectedId(paletteDrop.addAt(v.type, at)) })),
          { kind: 'separator' },
          { kind: 'item', label: 'Paste', icon: faPaste, disabled: !clip, onSelect: () => clip && duplicate(clip, { x: at.x - NODE_W / 2, y: at.y - 18 }) },
        ] as ContextMenuItem[]),
        { kind: 'item', label: 'Fit to screen', icon: faExpand, onSelect: fit },
        { kind: 'item', label: 'Debug chain', icon: faBug, onSelect: () => setRulesetDebugOpen(true) },
      ];
    }
    setMenu({ x: clientX - r.left, y: clientY - r.top, items });
  }

  /* wheel pans; with Ctrl / ⌘ it zooms around the pointer */
  function onWheel(e: React.WheelEvent) {
    const r = containerRef.current?.getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) zoomAt(e.deltaY < 0 ? 1.1 : 1 / 1.1, r ? e.clientX - r.left : undefined, r ? e.clientY - r.top : undefined);
    else setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.target as HTMLElement).closest('input,textarea,select')) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && !readOnly) {
      if (selectedEdgeId) { deleteEdge(selectedEdgeId); e.preventDefault(); }
      else if (selectedId) { deleteNode(selectedId); e.preventDefault(); }
    }
    else if (e.key === 'Enter' && selectedId) openEditor(selectedId);
    else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedId) setClip(nodes.find((n) => n.nodeId === selectedId) ?? null);
    else if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clip && !readOnly) {
      const r = containerRef.current?.getBoundingClientRect();
      if (r) duplicate(clip, toWorld(r.left + r.width / 2 - NODE_W / 2, r.top + r.height / 2));
      e.preventDefault();
    }
    else if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      const el = selectedId ? containerRef.current?.querySelector(`[data-node-id="${selectedId}"]`) : null;
      const r = (el ?? containerRef.current)?.getBoundingClientRect();
      if (r) openMenu(r.left + 24, r.top + 24, el ?? containerRef.current!);
      e.preventDefault();
    }
    else if (e.key === 'Escape') { edgeConnect.clearConnecting(); setSelectedEdgeId(null); }
  }

  /* palette click: in the middle of what is visible, a little offset per node */
  function addAtCenter(type: RuleNodeType) {
    if (readOnly) return;
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const off = (nodes.length % 5) * 16;
    const id = paletteDrop.addAt(type, toWorld(r.left + r.width / 2 + off, r.top + r.height / 2 + off));
    setSelectedId(id);
  }

  function deleteNode(nodeId: string) {
    setNodes((p) => p.filter((n) => n.nodeId !== nodeId));
    setEdges((p) => p.filter((ed) => ed.sourceNodeId !== nodeId && ed.targetNodeId !== nodeId));
    setSelectedId(null);
    if (editingNodeId === nodeId) setEditingNodeId(null);
    if (debugNodeId === nodeId) setDebugNodeId(null);
  }

  function deleteEdge(edgeId: string) {
    setEdges((p) => p.filter((ed) => ed.edgeId !== edgeId));
    setSelectedEdgeId(null);
  }

  function applyEdit() {
    if (!editingNodeId) return;
    setNodes((p) => p.map((n) => n.nodeId === editingNodeId ? { ...n, label: draftLabel.trim() || n.label, script: draftScript } : n));
  }

  const editingNode = editingNodeId ? nodes.find((n) => n.nodeId === editingNodeId) ?? null : null;
  const debugNode   = debugNodeId   ? nodes.find((n) => n.nodeId === debugNodeId)   ?? null : null;

  return (
    <div className={cn('relative flex h-full min-h-0 overflow-hidden', className)}>
      {!readOnly && (
        <Palette
          onDragStart={paletteDrop.onPaletteDragStart}
          onDragEnd={paletteDrop.onPaletteDragEnd}
          onAdd={(t) => { addAtCenter(t); setSheetOpen(false); }}
          onDebugChain={() => setRulesetDebugOpen(true)}
          sheetOpen={sheetOpen}
          onCloseSheet={() => setSheetOpen(false)}
        />
      )}

      <Canvas
        containerRef={containerRef}
        nodes={nodes}
        edges={edges}
        view={view}
        selectedId={selectedId}
        selectedEdgeId={selectedEdgeId}
        editingNodeId={editingNodeId}
        dragNodeId={nodeDrag.dragNodeId}
        connecting={edgeConnect.connecting}
        mouse={mouse}
        readOnly={readOnly}
        nodeStatus={nodeStatus}
        onPointerDown={onPointerDown}
        onPointerDownCapture={onPointerDownCapture}
        onContextMenu={onContextMenu}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        onDrop={paletteDrop.onDrop}
        onDragOver={(e) => e.preventDefault()}
        onNodePointerDown={onNodePointerDown}
        onOutputPortDown={edgeConnect.onOutputPortDown}
        onInputPortUp={edgeConnect.onInputPortUp}
        onSelectEdge={(id) => { setSelectedEdgeId(id); setSelectedId(null); }}
        onDeleteSelectedEdge={() => selectedEdgeId && deleteEdge(selectedEdgeId)}
        onZoomIn={() => zoomAt(1.2)}
        onZoomOut={() => zoomAt(1 / 1.2)}
        onFit={fit}
      >
        {menu && <ContextMenu x={menu.x} y={menu.y} items={menu.items} onClose={() => setMenu(null)} />}
        {!readOnly && (
          <button type="button" onClick={() => setSheetOpen((o) => !o)} aria-label="Add a node"
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute bottom-3 left-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-fg shadow-lg transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus md:hidden">
            <FontAwesomeIcon icon={faPlus} className="h-3 w-3" aria-hidden="true" /> Nodes
          </button>
        )}
      </Canvas>

      {editingNode && (
        <NodeEditorPanel
          node={editingNode} readOnly={readOnly}
          draftLabel={draftLabel} draftScript={draftScript}
          onLabelChange={setDraftLabel} onScriptChange={setDraftScript}
          onApply={applyEdit} onClose={() => setEditingNodeId(null)}
          onDelete={() => deleteNode(editingNode.nodeId)}
          onReset={() => setDraftScript(DEFAULT_SCRIPTS[editingNode.type])}
          onDebug={() => setDebugNodeId(editingNode.nodeId)}
        />
      )}

      {debugNode && (
        <NodeDebugModal node={debugNode}
          msg={dbgMsg} onMsgChange={setDbgMsg}
          metadata={dbgMeta} onMetadataChange={setDbgMeta}
          messageType={dbgMsgType} onMessageTypeChange={setDbgMsgType}
          onClose={() => setDebugNodeId(null)} />
      )}

      {rulesetDebugOpen && (
        <RulesetDebugModal nodes={nodes} edges={edges} chainName={chainName}
          msg={dbgMsg} onMsgChange={setDbgMsg}
          metadata={dbgMeta} onMetadataChange={setDbgMeta}
          messageType={dbgMsgType} onMessageTypeChange={setDbgMsgType}
          onClose={() => setRulesetDebugOpen(false)} />
      )}
    </div>
  );
}
