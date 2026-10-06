'use client';
import {
  faBolt, faFilter, faCodeBranch, faGears, faBullseye,
  faClock, faBell, faDatabase, faGlobe, faServer, faPuzzlePiece,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { RuleNode, RuleNodeType } from '../../types';

/* ─── Port meta ───────────────────────────────────────────────────────────── */

export const PORT_META: Record<string, { color: string; label: string }> = {
  out:     { color: 'var(--primary)',        label: '' },
  in:      { color: 'var(--border-strong)',  label: '' },
  true:    { color: 'var(--success)',        label: 'True' },
  false:   { color: 'var(--error)',          label: 'False' },
  success: { color: 'var(--success)',        label: 'Success' },
  failure: { color: 'var(--error)',          label: 'Failure' },
  timeout: { color: 'var(--warning)',        label: 'Timeout' },
  created: { color: 'var(--warning)',        label: 'Created' },
  cleared: { color: 'var(--text-secondary)', label: 'Cleared' },
  c1:      { color: 'var(--info)',           label: 'Case 1' },
  c2:      { color: 'var(--info)',           label: 'Case 2' },
  c3:      { color: 'var(--info)',           label: 'Case 3' },
  def:     { color: 'var(--text-secondary)', label: 'Default' },
  /* ports of roltek-automation-1 blocks */
  yes:     { color: 'var(--success)',        label: 'True' },
  no:      { color: 'var(--error)',          label: 'False' },
  else:    { color: 'var(--text-secondary)', label: 'Otherwise' },
  error:   { color: 'var(--error)',          label: 'Error' },
  ok:      { color: 'var(--success)',        label: 'OK' },
  dropped: { color: 'var(--warning)',        label: 'Dropped' },
  start:   { color: 'var(--info)',           label: 'Start' },
  end:     { color: 'var(--info)',           label: 'End' },
  reached: { color: 'var(--info)',           label: 'Reached' },
};

/** generated ports (o0, o1 …) are info coloured */
const GENERATED_PORT = /^o\d+$/;

export function portColor(id: string) {
  return PORT_META[id]?.color ?? (GENERATED_PORT.test(id) ? 'var(--info)' : 'var(--primary)');
}
export function portEdgeLabel(id: string) { return PORT_META[id]?.label ?? id; }

/* ─── Node visuals ────────────────────────────────────────────────────────── */

export type PortDef = { id: string; label: string };
export type NodeGroup = 'input' | 'routing' | 'processing' | 'output';
export type NodeVisual = {
  type: RuleNodeType; group: NodeGroup; displayLabel: string; description: string;
  icon: IconDefinition; iconColor: string; headerBg: string;
  inputs: PortDef[]; outputs: PortDef[];
  /** not offered in the palette (placeholder) */
  internal?: boolean;
};

export const NODE_VISUALS: Record<RuleNodeType, NodeVisual> = {
  TRIGGER:    { type:'TRIGGER', group:'input',    displayLabel:'Trigger',         description:'Entry point — MQTT / HTTP / Schedule',   icon:faBolt,        iconColor:'text-primary',       headerBg:'bg-primary-subtle',  inputs:[],                                                           outputs:[{id:'out',label:'out'}] },
  FILTER:     { type:'FILTER', group:'routing',     displayLabel:'Filter',          description:'Boolean gate — passes or blocks',         icon:faFilter,      iconColor:'text-warning',       headerBg:'bg-warning-subtle',  inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'true',label:'True'},{id:'false',label:'False'}] },
  SWITCH:     { type:'SWITCH', group:'routing',     displayLabel:'Switch',          description:'Multi-way router by attribute',           icon:faCodeBranch,  iconColor:'text-[#7c3aed]',     headerBg:'bg-[#f5f3ff]',      inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'c1',label:'Case 1'},{id:'c2',label:'Case 2'},{id:'def',label:'Default'}] },
  TRANSFORM:  { type:'TRANSFORM', group:'processing',  displayLabel:'Transform',       description:'Reshape or enrich payload inline',        icon:faGears,       iconColor:'text-success-fg',    headerBg:'bg-success-subtle',  inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'out',label:'out'}] },
  ACTION:     { type:'ACTION', group:'output',     displayLabel:'Action',          description:'Terminal side-effect (alert, publish)',   icon:faBullseye,    iconColor:'text-error',         headerBg:'bg-error-subtle',    inputs:[{id:'in',label:'in'}],                                        outputs:[] },
  DELAY:      { type:'DELAY', group:'processing',      displayLabel:'Delay',           description:'Hold message for configured duration',    icon:faClock,       iconColor:'text-[#d97706]',     headerBg:'bg-[#fffbeb]',      inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'out',label:'out'},{id:'timeout',label:'Timeout'}] },
  ALARM:      { type:'ALARM', group:'output',      displayLabel:'Alarm',           description:'Create or clear a device alarm',          icon:faBell,        iconColor:'text-warning',       headerBg:'bg-warning-subtle',  inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'created',label:'Created'},{id:'cleared',label:'Cleared'}] },
  ENRICHMENT: { type:'ENRICHMENT', group:'processing', displayLabel:'Enrichment',      description:'Fetch external context into message',     icon:faDatabase,    iconColor:'text-[#7c3aed]',     headerBg:'bg-[#f5f3ff]',      inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'success',label:'Success'},{id:'failure',label:'Failure'}] },
  REST_API:   { type:'REST_API', group:'output',   displayLabel:'REST API',        description:'Outbound HTTP call to external service',  icon:faGlobe,       iconColor:'text-info',          headerBg:'bg-info-subtle',     inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'success',label:'Success'},{id:'failure',label:'Failure'}] },
  SAVE_TS:    { type:'SAVE_TS', group:'output',    displayLabel:'Save Timeseries', description:'Persist telemetry to time-series DB',     icon:faServer,      iconColor:'text-success-fg',    headerBg:'bg-success-subtle',  inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'success',label:'Success'},{id:'failure',label:'Failure'}] },
  PLACEHOLDER:{ type:'PLACEHOLDER', group:'processing', displayLabel:'Not available', description:'Imported node whose type does not exist here. It keeps its wires but does nothing.', icon:faPuzzlePiece, iconColor:'text-text-secondary', headerBg:'bg-surface-overlay', inputs:[{id:'in',label:'in'}], outputs:[], internal:true },
};

/** The look of a node type; a type this table does not know (a block of another catalog) looks like a placeholder. */
export function visualFor(type: string): NodeVisual {
  return NODE_VISUALS[type as RuleNodeType] ?? NODE_VISUALS.PLACEHOLDER;
}

/** node types a user can add from the palette / context menu */
export const ADDABLE_VISUALS: NodeVisual[] = Object.values(NODE_VISUALS).filter((v) => !v.internal);

/** A node's ports: fixed per type, except a placeholder, which keeps the ports its wires use. */
export function nodePorts(node: Pick<RuleNode, 'type' | 'original'>): { inputs: PortDef[]; outputs: PortDef[] } {
  const v = visualFor(node.type);
  if (node.type !== 'PLACEHOLDER' || !node.original) return { inputs: v.inputs, outputs: v.outputs };
  const toDef = (id: string): PortDef => ({ id, label: PORT_META[id]?.label || id });
  return {
    inputs: (node.original.inputs ?? ['in']).map(toDef),
    outputs: (node.original.outputs ?? []).map(toDef),
  };
}

/* ─── Palette groups (in display order) ──────────────────────────────────── */

export const NODE_GROUPS: { id: NodeGroup; label: string }[] = [
  { id: 'input',      label: 'Input' },
  { id: 'routing',    label: 'Routing' },
  { id: 'processing', label: 'Processing' },
  { id: 'output',     label: 'Output' },
];
