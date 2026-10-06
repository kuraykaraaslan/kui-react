'use client';
import { GROUP_COLORS, type RuleGroup } from '../../graph/types';
import { GROUP_HEADER_H, type Bounds } from '../../graph/groups';

/** token of a group colour; an index outside the eight falls back to the first */
export function groupColorVar(color: number): string {
  return `var(--${GROUP_COLORS[color] ?? GROUP_COLORS[0]})`;
}

/**
 * The frame drawn around the nodes of a group. Only the name tab takes the pointer: dragging it moves the
 * members, a click selects them, a double click renames the group.
 */
export function GroupFrame({ group, bounds, readOnly, onTabPointerDown, onTabDoubleClick }: {
  group: RuleGroup;
  bounds: Bounds;
  readOnly: boolean;
  onTabPointerDown: (e: React.PointerEvent, groupId: string) => void;
  onTabDoubleClick: (groupId: string) => void;
}) {
  const color = groupColorVar(group.color);
  return (
    <div
      data-group-id={group.groupId}
      className="pointer-events-none absolute rounded-xl border-2 border-dashed"
      style={{ left: bounds.x, top: bounds.y, width: bounds.w, height: bounds.h, zIndex: 0, borderColor: color, background: `color-mix(in srgb, ${color} 8%, transparent)` }}>
      <div
        data-group-tab={group.groupId} role="button" tabIndex={0}
        aria-label={`Group ${group.name || 'without a name'}, ${group.nodeIds.length} ${group.nodeIds.length === 1 ? 'node' : 'nodes'}`}
        title={readOnly ? group.name : `${group.name || 'Group'}: click to select, drag to move, double click to edit`}
        onPointerDown={(e) => onTabPointerDown(e, group.groupId)}
        onDoubleClick={() => !readOnly && onTabDoubleClick(group.groupId)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !readOnly) onTabDoubleClick(group.groupId); }}
        className="pointer-events-auto absolute left-3 top-0 max-w-[80%] cursor-pointer truncate rounded-b-md px-2 text-[11px] font-semibold leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        style={{ height: GROUP_HEADER_H, background: color, color: 'var(--surface-base)' }}>
        {group.name || 'Group'}
      </div>
    </div>
  );
}
