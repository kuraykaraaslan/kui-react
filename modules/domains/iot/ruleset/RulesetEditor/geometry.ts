'use client';
import type { RuleNode } from '../../types';
import { nodePortsOf } from '../catalog/ports';
import { summaryOf } from '../catalog/summary';
import type { Catalog, PortDef } from '../catalog/types';

/* ─── Geometry constants ──────────────────────────────────────────────────── */

export const NODE_W          = 160;
export const NODE_HEADER_H   = 36;
export const PORT_R          = 6;
export const PORT_STEP       = 24;
export const PORT_TOP_OFFSET = 18;
export const GRID_SIZE       = 24;
export const ZOOM_MIN        = 0.4;
export const ZOOM_MAX        = 2;
/** the line under the header: a summary of the params, or what a placeholder was */
export const SUMMARY_H       = 18;
/** room under a node for the error port, which sits at the bottom centre */
export const ERROR_H         = 10;

export type Point = { x: number; y: number };
/** canvas pan (x, y in screen px) and zoom (k) */
export type View  = { x: number; y: number; k: number };

/* ─── Layout of one node ──────────────────────────────────────────────────── */

export type NodeLayout = {
  inputs: PortDef[];
  /** the outputs on the right side (the error port is not among them) */
  outputs: PortDef[];
  hasError: boolean;
  /** text of the line under the header, null when the node has no such line */
  summary: string | null;
  placeholder: boolean;
  height: number;
};

type LayoutNode = Pick<RuleNode, 'type' | 'label' | 'config' | 'original'>;

/** Ports, summary line and height of a node, for a catalog. */
export function layoutOf(node: LayoutNode, catalog: Catalog): NodeLayout {
  const ports = nodePortsOf(catalog, node);
  const decl = catalog.blocks[node.type];
  const placeholder = node.type === 'PLACEHOLDER' || node.type === 'unsupported';
  const text = placeholder ? '' : summaryOf(decl, node.config) || (decl && node.label && node.label !== decl.title ? decl.title : '');
  const hasRow = placeholder || !!text;
  const outputs = ports.outputs.filter((p) => p.id !== 'error');
  const hasError = ports.outputs.some((p) => p.id === 'error');
  const rows = Math.max(ports.inputs.length, outputs.length, 1);
  const height = NODE_HEADER_H + (hasRow ? SUMMARY_H : 0) + PORT_TOP_OFFSET + rows * PORT_STEP + 8 + (hasError ? ERROR_H : 0);
  return { inputs: ports.inputs, outputs, hasError, summary: hasRow ? text : null, placeholder, height };
}

export type Anchor = Point & { down?: boolean };

function bodyTop(node: Pick<RuleNode, 'y'>, layout: NodeLayout): number {
  return node.y + NODE_HEADER_H + (layout.summary !== null ? SUMMARY_H : 0);
}

export function inputAnchor(node: Pick<RuleNode, 'x' | 'y'>, layout: NodeLayout, index: number): Point {
  return { x: node.x, y: bodyTop(node, layout) + PORT_TOP_OFFSET + index * PORT_STEP };
}

/** Where a connection leaves a node: the right edge, or for the error port the bottom centre. Null for an unknown port. */
export function outputAnchor(node: Pick<RuleNode, 'x' | 'y'>, layout: NodeLayout, portId: string): Anchor | null {
  if (portId === 'error') return layout.hasError ? { x: node.x + NODE_W / 2, y: node.y + layout.height, down: true } : null;
  const index = layout.outputs.findIndex((p) => p.id === portId);
  return index < 0 ? null : { x: node.x + NODE_W, y: bodyTop(node, layout) + PORT_TOP_OFFSET + index * PORT_STEP };
}

/* ─── Curves ──────────────────────────────────────────────────────────────── */

export function bezier(sx: number, sy: number, tx: number, ty: number) {
  const dx = Math.max(Math.abs(tx - sx) * 0.55, 70);
  return `M${sx},${sy} C${sx+dx},${sy} ${tx-dx},${ty} ${tx},${ty}`;
}

/** The curve of a connection; one that leaves the error port starts downward. */
export function edgePath(from: Anchor, to: Point): string {
  if (!from.down) return bezier(from.x, from.y, to.x, to.y);
  const dx = Math.max(Math.abs(to.x - from.x) * 0.55, 70);
  return `M${from.x},${from.y} C${from.x},${from.y + 70} ${to.x - dx},${to.y} ${to.x},${to.y}`;
}

/* ─── View ────────────────────────────────────────────────────────────────── */

/**
 * The view that brings boxes (world coordinates) into sight, or null when they are all inside already (with a
 * margin). The zoom stays unless the boxes are bigger than the canvas; then it shrinks to fit them.
 */
export function revealView(boxes: { x: number; y: number; w: number; h: number }[], view: View, size: { w: number; h: number }, margin = 24): View | null {
  if (!boxes.length || size.w <= 0 || size.h <= 0) return null;
  const x0 = Math.min(...boxes.map((b) => b.x)), y0 = Math.min(...boxes.map((b) => b.y));
  const x1 = Math.max(...boxes.map((b) => b.x + b.w)), y1 = Math.max(...boxes.map((b) => b.y + b.h));
  const inside = x0 * view.k + view.x >= margin && y0 * view.k + view.y >= margin
    && x1 * view.k + view.x <= size.w - margin && y1 * view.k + view.y <= size.h - margin;
  if (inside) return null;
  const k = Math.min(view.k, Math.max(ZOOM_MIN, Math.min((size.w - 2 * margin) / (x1 - x0), (size.h - 2 * margin) / (y1 - y0))));
  return { k, x: size.w / 2 - ((x0 + x1) / 2) * k, y: size.h / 2 - ((y0 + y1) / 2) * k };
}
