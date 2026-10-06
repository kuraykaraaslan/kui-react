'use client';
import { useRef, useState } from 'react';
import { frameMoved, frameToWorld, hitNodes, normalizeFrame, type Frame, type FrameView } from '../../graph/boxselect';
import type { GraphNode } from '../../graph/types';

type Drag = { frame: Frame; add: boolean; moved: boolean; touch: boolean };

/**
 * Box select: Shift, Ctrl or ⌘ and a drag on the empty canvas draws a frame; the blocks it touches become the
 * selection (added to it with those keys). It is no history step. A touch screen has no Shift, so the frame
 * mode (`boxMode`) makes a one-finger drag draw the frame; it switches itself off after a selection made by
 * touch. A plain drag still pans.
 */
export function useBoxSelect({ containerRef, getNodes, heightOf, nodeWidth, getView, onSelect }: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  getNodes: () => Pick<GraphNode, 'nodeId' | 'x' | 'y'>[];
  heightOf: (nodeId: string) => number;
  nodeWidth: number;
  getView: () => FrameView;
  /** the blocks the frame touched; `add` when the selection should grow */
  onSelect: (ids: string[], add: boolean) => void;
}) {
  const [boxMode, setBoxMode] = useState(false);
  /** the frame being drawn in container pixels; null until the pointer has moved */
  const [frame, setFrame] = useState<Frame | null>(null);
  const drag = useRef<Drag | null>(null);

  const local = (e: React.PointerEvent): { x: number; y: number } => {
    const r = containerRef.current?.getBoundingClientRect();
    return { x: e.clientX - (r?.left ?? 0), y: e.clientY - (r?.top ?? 0) };
  };

  /** does this press on the empty canvas draw a frame instead of panning? */
  function wants(e: React.PointerEvent): boolean {
    return e.shiftKey || e.ctrlKey || e.metaKey || boxMode;
  }

  function start(e: React.PointerEvent) {
    const p = local(e);
    drag.current = { frame: { x0: p.x, y0: p.y, x1: p.x, y1: p.y }, add: e.ctrlKey || e.metaKey || e.shiftKey, moved: false, touch: e.pointerType === 'touch' };
    try { containerRef.current?.setPointerCapture(e.pointerId); } catch { /* not every environment can capture */ }
  }

  /** true while a frame is being drawn (the pointer move belongs to it) */
  function move(e: React.PointerEvent): boolean {
    const d = drag.current;
    if (!d) return false;
    const p = local(e);
    d.frame = { ...d.frame, x1: p.x, y1: p.y };
    d.moved ||= frameMoved(d.frame);
    setFrame(d.moved ? normalizeFrame(d.frame) : null);
    return true;
  }

  /** the pointer is up: the frame becomes the selection. True when a frame was being drawn. */
  function end(): boolean {
    const d = drag.current;
    if (!d) return false;
    drag.current = null;
    setFrame(null);
    if (!d.moved) return true;
    if (d.touch && boxMode) setBoxMode(false);
    onSelect(hitNodes(getNodes(), frameToWorld(d.frame, getView()), nodeWidth, (n) => heightOf(n.nodeId)), d.add);
    return true;
  }

  /** the gesture was cancelled: no selection */
  function cancel() {
    drag.current = null;
    setFrame(null);
  }

  return { boxMode, setBoxMode, toggleBoxMode: () => setBoxMode((on) => !on), frame, wants, start, move, end, cancel, active: () => drag.current !== null };
}
