'use client';
import { useState, useRef, useImperativeHandle } from 'react';
import { cn } from '@/libs/utils/cn';
import type { RuleNode, RuleEdge } from '../../types';
import { DEFAULT_SCRIPTS } from './default-scripts';
import { Palette } from './canvas/Palette';
import { Canvas } from './canvas/Canvas';
import { NodeEditorPanel } from './panels/NodeEditorPanel';
import { NodeDebugModal } from './modals/NodeDebugModal';
import { RulesetDebugModal } from './modals/RulesetDebugModal';
import { useNodeDrag } from './hooks/useNodeDrag';
import { useEdgeConnect } from './hooks/useEdgeConnect';
import { usePaletteDrop } from './hooks/usePaletteDrop';

/* ─── Public ref API ──────────────────────────────────────────────────────── */

export type RulesetEditorRef = { openRulesetDebug: () => void };

export type RulesetEditorProps = {
  initialNodes?: RuleNode[];
  initialEdges?: RuleEdge[];
  readOnly?: boolean;
  className?: string;
  chainName?: string;
  ref?: React.Ref<RulesetEditorRef>;
};

export function RulesetEditor({
  initialNodes = [], initialEdges = [],
  readOnly = false, className,
  chainName = 'Rule Chain', ref,
}: RulesetEditorProps) {
  const [nodes, setNodes]         = useState<RuleNode[]>(initialNodes);
  const [edges, setEdges]         = useState<RuleEdge[]>(initialEdges);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  useImperativeHandle(ref, () => ({ openRulesetDebug: () => setRulesetDebugOpen(true) }), []);

  const edgeConnect  = useEdgeConnect({ nodes, setEdges, edgeSeq, readOnly, setMouse });
  const nodeDrag     = useNodeDrag({ nodes, setNodes, containerRef, readOnly, connecting: edgeConnect.connecting });
  const paletteDrop  = usePaletteDrop({ setNodes, nodeSeq, containerRef });

  function openEditor(nodeId: string) {
    const node = nodes.find((n) => n.nodeId === nodeId);
    if (!node) return;
    setEditingNodeId(nodeId);
    setDraftLabel(node.label);
    setDraftScript(node.script ?? DEFAULT_SCRIPTS[node.type]);
  }

  function onNodeMouseDown(e: React.MouseEvent, nodeId: string) {
    setSelectedId(nodeId);
    nodeDrag.onNodeMouseDown(e, nodeId);
  }

  function onNodeMouseUp(nodeId: string) {
    if (!nodeDrag.dragMoved.current && !edgeConnect.connecting) openEditor(nodeId);
  }

  function onMouseMove(e: React.MouseEvent) {
    const r = containerRef.current?.getBoundingClientRect();
    if (r) setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
    nodeDrag.applyMouseMove(e);
  }

  function onMouseUp() { nodeDrag.endDrag(); edgeConnect.clearConnecting(); }
  function onCanvasMouseDown() { setSelectedId(null); edgeConnect.clearConnecting(); }

  function deleteNode(nodeId: string) {
    setNodes((p) => p.filter((n) => n.nodeId !== nodeId));
    setEdges((p) => p.filter((ed) => ed.sourceNodeId !== nodeId && ed.targetNodeId !== nodeId));
    setSelectedId(null);
    if (editingNodeId === nodeId) setEditingNodeId(null);
    if (debugNodeId === nodeId) setDebugNodeId(null);
  }

  function deleteEdge(edgeId: string) { setEdges((p) => p.filter((ed) => ed.edgeId !== edgeId)); }

  function applyEdit() {
    if (!editingNodeId) return;
    setNodes((p) => p.map((n) => n.nodeId === editingNodeId ? { ...n, label: draftLabel.trim() || n.label, script: draftScript } : n));
  }

  const editingNode = editingNodeId ? nodes.find((n) => n.nodeId === editingNodeId) ?? null : null;
  const debugNode   = debugNodeId   ? nodes.find((n) => n.nodeId === debugNodeId)   ?? null : null;

  return (
    <div className={cn('flex h-full min-h-0 overflow-hidden', className)}>
      {!readOnly && (
        <Palette
          onDragStart={paletteDrop.onPaletteDragStart}
          onDragEnd={paletteDrop.onPaletteDragEnd}
          onDebugChain={() => setRulesetDebugOpen(true)}
        />
      )}

      <Canvas
        containerRef={containerRef}
        nodes={nodes}
        edges={edges}
        selectedId={selectedId}
        editingNodeId={editingNodeId}
        dragNodeId={nodeDrag.dragNodeId}
        connecting={edgeConnect.connecting}
        mouse={mouse}
        readOnly={readOnly}
        onCanvasMouseDown={onCanvasMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDrop={paletteDrop.onDrop}
        onDragOver={(e) => e.preventDefault()}
        onNodeMouseDown={onNodeMouseDown}
        onNodeMouseUp={onNodeMouseUp}
        onOutputPortDown={edgeConnect.onOutputPortDown}
        onInputPortUp={edgeConnect.onInputPortUp}
        onDeleteEdge={deleteEdge}
      />

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
