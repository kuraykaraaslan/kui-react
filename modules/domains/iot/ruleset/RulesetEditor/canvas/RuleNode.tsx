'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NODE_VISUALS, portColor } from '../node-meta';
import { NODE_W, NODE_HEADER_H, PORT_TOP_OFFSET, PORT_STEP, nodeHeight } from '../geometry';
import type { RuleNode as RuleNodeType } from '../../../types';

export function RuleNode({ node, isSelected, isEditing, isDragging, onMouseDown, onMouseUp }: {
  node: RuleNodeType;
  isSelected: boolean;
  isEditing: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}) {
  const v = NODE_VISUALS[node.type];
  return (
    <div
      className={cn('absolute rounded-xl border-2 bg-surface-base transition-shadow',
        isEditing ? 'border-primary shadow-lg ring-2 ring-primary/30'
          : isSelected ? 'border-primary/70 shadow-md'
          : 'border-border shadow-sm hover:border-border-strong hover:shadow-md',
        isDragging ? 'cursor-grabbing shadow-xl' : 'cursor-pointer')}
      style={{ left:node.x, top:node.y, width:NODE_W, height:nodeHeight(node.type), zIndex: isSelected||isEditing ? 20 : 5 }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}>
      <div className={cn('flex items-center gap-2 rounded-t-[10px] border-b border-border px-3', v.headerBg)} style={{ height:NODE_HEADER_H }}>
        <FontAwesomeIcon icon={v.icon} className={cn('h-3.5 w-3.5 shrink-0', v.iconColor)} aria-hidden="true" />
        <span className="flex-1 truncate text-xs font-semibold leading-tight text-text-primary">{node.label}</span>
      </div>
      <div className="flex justify-between px-5" style={{ paddingTop:PORT_TOP_OFFSET }}>
        <div className="flex flex-col" style={{ gap:PORT_STEP-14 }}>
          {v.inputs.map((p) => <span key={p.id} className="text-[10px] leading-none text-text-secondary">{p.label}</span>)}
        </div>
        <div className="flex flex-col items-end" style={{ gap:PORT_STEP-14 }}>
          {v.outputs.map((p) => <span key={p.id} style={{ color:portColor(p.id) }} className="text-[10px] font-medium leading-none">{p.label}</span>)}
        </div>
      </div>
    </div>
  );
}
