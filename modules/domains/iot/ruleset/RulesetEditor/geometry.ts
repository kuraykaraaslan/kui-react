'use client';
import type { RuleNode, RuleNodeType } from '../../types';
import { NODE_VISUALS } from './node-meta';

/* ─── Geometry constants ──────────────────────────────────────────────────── */

export const NODE_W          = 160;
export const NODE_HEADER_H   = 36;
export const PORT_R          = 6;
export const PORT_STEP       = 24;
export const PORT_TOP_OFFSET = 18;
export const GRID_SIZE       = 24;
export const ZOOM_MIN        = 0.4;
export const ZOOM_MAX        = 2;

export type Point = { x: number; y: number };
/** canvas pan (x, y in screen px) and zoom (k) */
export type View  = { x: number; y: number; k: number };

/* ─── Geometry helpers ────────────────────────────────────────────────────── */

export function inputPortY(node: RuleNode, idx: number)  { return node.y + NODE_HEADER_H + PORT_TOP_OFFSET + idx * PORT_STEP; }
export function outputPortY(node: RuleNode, idx: number) { return node.y + NODE_HEADER_H + PORT_TOP_OFFSET + idx * PORT_STEP; }

export function nodeHeight(type: RuleNodeType) {
  const v = NODE_VISUALS[type];
  return NODE_HEADER_H + PORT_TOP_OFFSET + Math.max(v.inputs.length, v.outputs.length, 1) * PORT_STEP + 8;
}

export function bezier(sx: number, sy: number, tx: number, ty: number) {
  const dx = Math.max(Math.abs(tx - sx) * 0.55, 70);
  return `M${sx},${sy} C${sx+dx},${sy} ${tx-dx},${ty} ${tx},${ty}`;
}
