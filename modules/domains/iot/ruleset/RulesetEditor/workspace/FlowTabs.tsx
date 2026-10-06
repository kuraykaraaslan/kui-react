'use client';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faArrowRight, faCopy, faDownload, faEllipsis, faLayerGroup, faPen, faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import { TabMenu, type TabMenuItem } from './TabMenu';
import type { FlowKind, TabRef, WorkspaceTab } from './types';

type Props = {
  /** the tabs in the order they are shown */
  flows: WorkspaceTab[];
  subflows: WorkspaceTab[];
  /** the open flow; `id: null` is one that is not saved yet and has a tab of its own */
  active: { id: string | null; kind: FlowKind; name: string; isRule?: boolean };
  dirty: boolean;
  readOnly: boolean;
  /** shows the "+" tab and enables Duplicate */
  canCreate: boolean;
  onOpen: (tab: TabRef) => void;
  onCreate?: () => void;
  onDuplicate?: (tab: TabRef) => void;
  /** only offered for the open tab */
  onRename?: (tab: TabRef) => void;
  onExport?: (tab: TabRef) => void;
  /** put the tab at an index among the tabs of its kind */
  onMove: (kind: FlowKind, id: string, to: number) => void;
};

/**
 * The strip of flows, then subflows: one click to another flow. A dot marks unsaved changes of the open one, a "Rule"
 * badge the flows the host says another editor can open. Drag a tab, or Alt + Left / Right, to reorder within its
 * kind; right-click, Shift + F10 or the "…" button opens the menu. A tab is navigation: the host does the opening.
 */
export function FlowTabs({ flows, subflows, active, dirty, readOnly, canCreate, onOpen, onCreate, onDuplicate, onRename, onExport, onMove }: Props) {
  const [menu, setMenu] = useState<{ tab: WorkspaceTab; anchor: HTMLElement } | null>(null);
  const [dragging, setDragging] = useState<TabRef | null>(null);
  const [dropId, setDropId] = useState<string | null>(null);
  const focusId = useRef<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  /* a reordered tab is moved in the DOM, which can drop the focus: put it back */
  useEffect(() => {
    if (!focusId.current) return;
    const id = focusId.current;
    focusId.current = null;
    Array.from(stripRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []).find((el) => el.dataset.tabId === id)?.focus();
  });

  const isActive = (t: WorkspaceTab) => t.id === active.id && t.kind === active.kind;
  const kindList = (kind: FlowKind) => (kind === 'subflow' ? subflows : flows);

  function move(kind: FlowKind, id: string, delta: number) {
    const ids = kindList(kind).map((t) => t.id);
    const i = ids.indexOf(id);
    if (i < 0 || i + delta < 0 || i + delta >= ids.length) return;
    focusId.current = id;
    onMove(kind, id, i + delta);
  }

  function openMenu(tab: WorkspaceTab, anchor: HTMLElement) {
    setMenu({ tab, anchor });
  }

  function menuItems(tab: WorkspaceTab): TabMenuItem[] {
    const cur = isActive(tab);
    const ids = kindList(tab.kind).map((t) => t.id);
    const i = ids.indexOf(tab.id);
    const tabRef: TabRef = { kind: tab.kind, id: tab.id };
    const canRename = cur && !readOnly && !!onRename;
    return [
      ...(cur ? [] : [{ key: 'open', label: 'Open', icon: faArrowRight, onSelect: () => onOpen(tabRef) } as TabMenuItem]),
      { key: 'rename', label: 'Rename…', icon: faPen, disabled: !canRename, title: !cur ? 'Open the tab first' : undefined, onSelect: () => onRename?.(tabRef) },
      { key: 'copy', label: 'Duplicate', icon: faCopy, disabled: !canCreate || !onDuplicate, onSelect: () => onDuplicate?.(tabRef) },
      { key: 'export', label: 'Export as a file', icon: faDownload, disabled: !onExport, onSelect: () => onExport?.(tabRef) },
      { key: 'sep', separator: true },
      // eslint-disable-next-line react-hooks/refs -- the callback runs on select, not during render
      { key: 'left', label: 'Move left', icon: faArrowLeft, disabled: i <= 0, onSelect: () => move(tab.kind, tab.id, -1) },
      { key: 'right', label: 'Move right', icon: faArrowRight, disabled: !(i >= 0 && i < ids.length - 1), onSelect: () => move(tab.kind, tab.id, 1) },
    ];
  }

  function renderTab(tab: WorkspaceTab, pos: number) {
    const cur = isActive(tab);
    const name = cur ? active.name || tab.name || tab.id : tab.name || tab.id;
    const rule = cur ? (active.isRule ?? tab.isRule) : tab.isRule;
    return (
      <button
        key={`${tab.kind}:${tab.id}`} type="button" role="tab" aria-selected={cur} title={name} draggable
        data-testid={`flow-ftab-${tab.id}`} data-tab-id={tab.id}
        onClick={() => { if (!cur) onOpen({ kind: tab.kind, id: tab.id }); }}
        onContextMenu={(e) => { e.preventDefault(); openMenu(tab, e.currentTarget); }}
        onDragStart={(e) => {
          setDragging({ kind: tab.kind, id: tab.id });
          try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', tab.id); } catch { /* no data transfer */ }
        }}
        onDragOver={(e) => {
          if (dragging && dragging.kind === tab.kind && dragging.id !== tab.id) { e.preventDefault(); setDropId(tab.id); }
        }}
        onDragLeave={() => setDropId((d) => (d === tab.id ? null : d))}
        onDrop={(e) => {
          const d = dragging;
          setDropId(null);
          setDragging(null);
          if (!d || d.kind !== tab.kind || d.id === tab.id) return;
          e.preventDefault();
          onMove(tab.kind, d.id, pos);
        }}
        onDragEnd={() => { setDragging(null); setDropId(null); }}
        onKeyDown={(e) => {
          if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); move(tab.kind, tab.id, e.key === 'ArrowLeft' ? -1 : 1); }
          else if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) { e.preventDefault(); openMenu(tab, e.currentTarget); }
        }}
        className={cn(
          '-mb-px inline-flex max-w-56 shrink-0 cursor-grab items-center gap-1.5 rounded-t-md border border-transparent px-3 py-1.5 text-xs font-semibold transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus',
          cur ? 'border-border border-b-surface-base bg-surface-base text-primary' : 'text-text-secondary hover:text-text-primary',
          dropId === tab.id && 'border-l-primary',
        )}>
        {tab.kind === 'subflow' && <FontAwesomeIcon icon={faLayerGroup} className="h-3 w-3 shrink-0" aria-hidden="true" />}
        <span className={cn('truncate', tab.enabled === false && 'italic opacity-60')}>{name}</span>
        {rule && (
          <span data-testid="flow-ftab-rule" title="A rule form can open this flow"
            className="shrink-0 rounded-full bg-primary-subtle px-1.5 text-[10px] font-bold leading-[1.1rem] text-primary">Rule</span>
        )}
        {cur && dirty && <span title="Unsaved changes" role="img" aria-label="Unsaved changes" className="shrink-0 text-[10px] text-warning">●</span>}
      </button>
    );
  }

  const shown = [...flows, ...subflows];
  const open = shown.find(isActive);
  const fresh = active.id === null && (
    <button key="new" type="button" role="tab" aria-selected data-testid="flow-ftab-new"
      className="-mb-px inline-flex max-w-56 shrink-0 items-center gap-1.5 rounded-t-md border border-border border-b-surface-base bg-surface-base px-3 py-1.5 text-xs font-semibold text-primary">
      <span className="truncate">{active.name || 'New flow'}</span>
      {dirty && <span title="Unsaved changes" role="img" aria-label="Unsaved changes" className="shrink-0 text-[10px] text-warning">●</span>}
    </button>
  );
  const flowTabs = flows.map((t, i) => renderTab(t, i));
  const subTabs = subflows.map((t, i) => renderTab(t, i));

  return (
    <div ref={stripRef} className="flex shrink-0 items-end gap-1 overflow-x-auto border-b border-border bg-surface-raised px-2 pt-1">
      <div role="tablist" aria-label="Flows" className="flex items-end gap-1">
        {active.kind === 'subflow' ? flowTabs : [...flowTabs, fresh]}
        {active.kind === 'subflow' ? [...subTabs, fresh] : subTabs}
      </div>
      {canCreate && onCreate && (
        <button type="button" onClick={onCreate} title="New flow" aria-label="New flow" data-testid="flow-ftab-add"
          className="-mb-px inline-flex shrink-0 items-center rounded-t-md px-2.5 py-2 text-text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus">
          <FontAwesomeIcon icon={faPlus} className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
      {open && (
        <button type="button" title="Menu of this tab" aria-label="Menu of this tab" aria-haspopup="menu" data-testid="flow-ftab-more"
          onClick={(e) => openMenu(open, e.currentTarget)}
          className="mb-0.5 inline-flex shrink-0 items-center self-center rounded-md px-2 py-1 text-text-secondary transition-colors hover:bg-primary-subtle hover:text-primary focus-visible:bg-primary-subtle focus-visible:text-primary focus-visible:outline-none">
          <FontAwesomeIcon icon={faEllipsis} className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
      {menu && <TabMenu anchor={menu.anchor} items={menuItems(menu.tab)} onClose={() => setMenu(null)} />}
    </div>
  );
}
