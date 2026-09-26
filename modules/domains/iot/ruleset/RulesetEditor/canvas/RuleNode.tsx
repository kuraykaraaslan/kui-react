'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NODE_VISUALS, nodePorts, portColor } from '../node-meta';
import { NODE_W, NODE_HEADER_H, PORT_TOP_OFFSET, PORT_STEP, PLACEHOLDER_EXTRA_H, nodeHeight } from '../geometry';
import type { RuleNode as RuleNodeType } from '../../../types';

/** Live state shown under a node (e.g. "3 waiting", "connected", last error). */
export type RuleNodeStatus = { tone: 'success' | 'error' | 'warning' | 'info' | 'neutral'; text: string; ring?: boolean };

const TONE: Record<RuleNodeStatus['tone'], string> = {
  success: 'var(--success)', error: 'var(--error)', warning: 'var(--warning)', info: 'var(--info)', neutral: 'var(--text-secondary)',
};

export function RuleNode({ node, isSelected, isEditing, isDragging, status, onPointerDown }: {
  node: RuleNodeType;
  isSelected: boolean;
  isEditing: boolean;
  isDragging: boolean;
  status?: RuleNodeStatus;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const v = NODE_VISUALS[node.type];
  const ports = nodePorts(node);
  const placeholder = node.type === 'PLACEHOLDER';
  const originalType = node.original?.type ?? 'unknown';
  return (
    <div
      data-node-id={node.nodeId}
      role="button" tabIndex={0}
      aria-label={placeholder ? `${node.label} (Not available: ${originalType})` : `${node.label} (${v.displayLabel})`}
      aria-pressed={isSelected}
      className={cn('absolute rounded-xl border-2 bg-surface-base transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        placeholder && 'border-dashed',
        isEditing ? 'border-primary shadow-lg ring-2 ring-primary/30'
          : isSelected ? 'border-primary/70 shadow-md'
          : placeholder ? 'border-border-strong shadow-sm hover:shadow-md'
          : 'border-border shadow-sm hover:border-border-strong hover:shadow-md',
        isDragging ? 'cursor-grabbing shadow-xl' : 'cursor-pointer')}
      style={{ left:node.x, top:node.y, width:NODE_W, height:nodeHeight(node), zIndex: isSelected||isEditing ? 20 : 5 }}
      onPointerDown={onPointerDown}>
      <div className={cn('flex items-center gap-2 rounded-t-[10px] border-b border-border px-3', placeholder && 'border-dashed', v.headerBg)} style={{ height:NODE_HEADER_H }}>
        <FontAwesomeIcon icon={v.icon} className={cn('h-3.5 w-3.5 shrink-0', v.iconColor)} aria-hidden="true" />
        <span className={cn('flex-1 truncate text-xs font-semibold leading-tight', placeholder ? 'text-text-secondary' : 'text-text-primary')}>{node.label}</span>
      </div>
      {placeholder && (
        <p className="truncate px-3 pt-1 text-[10px] leading-none text-text-secondary" style={{ height:PLACEHOLDER_EXTRA_H }} title={originalType}>
          <span className="font-semibold">Not available</span> · <span className="font-mono">{originalType}</span>
        </p>
      )}
      <div className="flex justify-between px-5" style={{ paddingTop:PORT_TOP_OFFSET }}>
        <div className="flex flex-col" style={{ gap:PORT_STEP-14 }}>
          {ports.inputs.map((p) => <span key={p.id} className="text-[10px] leading-none text-text-secondary">{p.label}</span>)}
        </div>
        <div className="flex flex-col items-end" style={{ gap:PORT_STEP-14 }}>
          {ports.outputs.map((p) => <span key={p.id} style={{ color:portColor(p.id) }} className="text-[10px] font-medium leading-none">{p.label}</span>)}
        </div>
      </div>
      {status && (
        <div className="pointer-events-none absolute left-1 top-full mt-1.5 flex max-w-full items-center gap-1.5 truncate text-[11px] text-text-secondary">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full"
            style={status.ring ? { border:`2px solid ${TONE[status.tone]}` } : { background:TONE[status.tone] }} />
          <span className="truncate">{status.text}</span>
        </div>
      )}
    </div>
  );
}
