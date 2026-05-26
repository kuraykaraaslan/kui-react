'use client';
import {
  faBolt, faFilter, faCodeBranch, faGears, faBullseye,
  faClock, faBell, faDatabase, faGlobe, faServer,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { RuleNodeType } from '../../types';

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
};

export function portColor(id: string) { return PORT_META[id]?.color ?? 'var(--primary)'; }
export function portEdgeLabel(id: string) { return PORT_META[id]?.label ?? id; }

/* ─── Node visuals ────────────────────────────────────────────────────────── */

export type PortDef = { id: string; label: string };
export type NodeVisual = {
  type: RuleNodeType; displayLabel: string; description: string;
  icon: IconDefinition; iconColor: string; headerBg: string;
  inputs: PortDef[]; outputs: PortDef[];
};

export const NODE_VISUALS: Record<RuleNodeType, NodeVisual> = {
  TRIGGER:    { type:'TRIGGER',    displayLabel:'Trigger',         description:'Entry point — MQTT / HTTP / Schedule',   icon:faBolt,        iconColor:'text-primary',       headerBg:'bg-primary-subtle',  inputs:[],                                                           outputs:[{id:'out',label:'out'}] },
  FILTER:     { type:'FILTER',     displayLabel:'Filter',          description:'Boolean gate — passes or blocks',         icon:faFilter,      iconColor:'text-warning',       headerBg:'bg-warning-subtle',  inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'true',label:'True'},{id:'false',label:'False'}] },
  SWITCH:     { type:'SWITCH',     displayLabel:'Switch',          description:'Multi-way router by attribute',           icon:faCodeBranch,  iconColor:'text-[#7c3aed]',     headerBg:'bg-[#f5f3ff]',      inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'c1',label:'Case 1'},{id:'c2',label:'Case 2'},{id:'def',label:'Default'}] },
  TRANSFORM:  { type:'TRANSFORM',  displayLabel:'Transform',       description:'Reshape or enrich payload inline',        icon:faGears,       iconColor:'text-success-fg',    headerBg:'bg-success-subtle',  inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'out',label:'out'}] },
  ACTION:     { type:'ACTION',     displayLabel:'Action',          description:'Terminal side-effect (alert, publish)',   icon:faBullseye,    iconColor:'text-error',         headerBg:'bg-error-subtle',    inputs:[{id:'in',label:'in'}],                                        outputs:[] },
  DELAY:      { type:'DELAY',      displayLabel:'Delay',           description:'Hold message for configured duration',    icon:faClock,       iconColor:'text-[#d97706]',     headerBg:'bg-[#fffbeb]',      inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'out',label:'out'},{id:'timeout',label:'Timeout'}] },
  ALARM:      { type:'ALARM',      displayLabel:'Alarm',           description:'Create or clear a device alarm',          icon:faBell,        iconColor:'text-warning',       headerBg:'bg-warning-subtle',  inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'created',label:'Created'},{id:'cleared',label:'Cleared'}] },
  ENRICHMENT: { type:'ENRICHMENT', displayLabel:'Enrichment',      description:'Fetch external context into message',     icon:faDatabase,    iconColor:'text-[#7c3aed]',     headerBg:'bg-[#f5f3ff]',      inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'success',label:'Success'},{id:'failure',label:'Failure'}] },
  REST_API:   { type:'REST_API',   displayLabel:'REST API',        description:'Outbound HTTP call to external service',  icon:faGlobe,       iconColor:'text-info',          headerBg:'bg-info-subtle',     inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'success',label:'Success'},{id:'failure',label:'Failure'}] },
  SAVE_TS:    { type:'SAVE_TS',    displayLabel:'Save Timeseries', description:'Persist telemetry to time-series DB',     icon:faServer,      iconColor:'text-success-fg',    headerBg:'bg-success-subtle',  inputs:[{id:'in',label:'in'}],                                        outputs:[{id:'success',label:'Success'},{id:'failure',label:'Failure'}] },
};
