'use client';
import { useId, useMemo, useRef, useState } from 'react';
import { Modal } from '@/modules/ui/Modal';
import { Badge } from '@/modules/ui/Badge';
import { Button } from '@/modules/ui/Button';
import { AlertBanner } from '@/modules/ui/AlertBanner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faFolder,
  faUsers,
  faGear,
  faChartBar,
  faPlus,
  faEnvelope,
  faFileExport,
  faLock,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

import type {
  CommandGroup,
  CommandItem,
  CommandPaletteProps,
  ScoredCommand,
} from './types';
import { useFuzzySearch } from './hooks/useFuzzySearch';
import { useMergedCommands } from './hooks/useCommandStore';
import { useShortcuts } from './hooks/useShortcuts';
import { CommandPaletteInput } from './parts/Input';
import { ResultList } from './parts/ResultList';
import { EmptyState } from './parts/EmptyState';
import { Footer } from './parts/Footer';

export type { CommandItem, CommandPaletteProps, CommandGroup, ScoredCommand } from './types';
export { useRegisterCommand, registerCommand, useCommandStore } from './hooks/useCommandStore';
export { scoreCommand, highlightMatches } from './hooks/useFuzzySearch';

const DEFAULT_COMMANDS: CommandItem[] = [
  { id: 'nav-dashboard', icon: <FontAwesomeIcon icon={faHouse} className="w-3.5 h-3.5" aria-hidden="true" />,      label: 'Go to Dashboard',  shortcut: 'G D', category: 'Navigation' },
  { id: 'nav-projects',  icon: <FontAwesomeIcon icon={faFolder} className="w-3.5 h-3.5" aria-hidden="true" />,     label: 'Go to Projects',   shortcut: 'G P', category: 'Navigation' },
  { id: 'nav-team',      icon: <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5" aria-hidden="true" />,      label: 'Go to Team',       shortcut: 'G T', category: 'Navigation' },
  { id: 'nav-settings',  icon: <FontAwesomeIcon icon={faGear} className="w-3.5 h-3.5" aria-hidden="true" />,       label: 'Go to Settings',   shortcut: 'G S', category: 'Navigation' },
  { id: 'nav-analytics', icon: <FontAwesomeIcon icon={faChartBar} className="w-3.5 h-3.5" aria-hidden="true" />,   label: 'Go to Analytics',  shortcut: 'G A', category: 'Navigation' },
  { id: 'act-new-project', icon: <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" aria-hidden="true" />,     label: 'New Project',      shortcut: '⌘N',  category: 'Actions' },
  { id: 'act-invite',    icon: <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5" aria-hidden="true" />,   label: 'Send Invite',      shortcut: '⌘I',  category: 'Actions' },
  { id: 'act-export',    icon: <FontAwesomeIcon icon={faFileExport} className="w-3.5 h-3.5" aria-hidden="true" />, label: 'Export Data',      shortcut: '⌘E',  category: 'Actions' },
  { id: 'act-lock',      icon: <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5" aria-hidden="true" />,       label: 'Lock Screen',      shortcut: '⌘L',  category: 'Actions' },
  { id: 'rec-alpha',     icon: <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" aria-hidden="true" />,      label: 'Project Alpha',                     category: 'Recent' },
  { id: 'rec-q3',        icon: <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" aria-hidden="true" />,      label: 'Q3 Report',                         category: 'Recent' },
  { id: 'rec-review',    icon: <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" aria-hidden="true" />,      label: 'Design Review',                     category: 'Recent' },
];

function groupByCategory(scored: ScoredCommand[]): CommandGroup[] {
  const order: string[] = [];
  const map = new Map<string, ScoredCommand[]>();
  for (const s of scored) {
    if (!map.has(s.item.category)) {
      order.push(s.item.category);
      map.set(s.item.category, []);
    }
    map.get(s.item.category)!.push(s);
  }
  return order.map((category) => ({ category, items: map.get(category)! }));
}

export function CommandPalette({
  items = DEFAULT_COMMANDS,
  onSelect,
  trigger,
  placeholder = 'Type a command or search…',
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const reactId = useId();
  const listboxId = `${reactId}-list`;
  const itemIdPrefix = `${reactId}-opt`;
  const inputId = `${reactId}-input`;

  const merged = useMergedCommands(items);
  const scored = useFuzzySearch(merged, query);
  const groups = useMemo(() => groupByCategory(scored), [scored]);

  const flat = scored;
  const hasResults = flat.length > 0;

  const activeDescendantId = hasResults ? `${itemIdPrefix}-${activeIndex}` : undefined;

  useShortcuts({
    isOpen: open,
    onOpen: () => setOpen(true),
    onClose: () => {
      setOpen(false);
      setQuery('');
      setActiveIndex(0);
    },
  });

  function handleSelect(cmd: CommandItem) {
    cmd.onClick?.();
    onSelect?.(cmd);
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
    // TODO M2: push to useRecent.
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!hasResults) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(flat.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const picked = flat[activeIndex];
      if (picked) handleSelect(picked.item);
    }
  }

  function handleQueryChange(next: string) {
    setQuery(next);
    setActiveIndex(0);
  }

  // Suggestions for the empty state: the first 4 items of the (unfiltered) merged set.
  const suggestions = useMemo(() => merged.slice(0, 4), [merged]);

  return (
    <>
      <div role="none" onClick={() => setOpen(true)}>
        {trigger ?? (
          <Button
            variant="outline"
            size="sm"
            iconRight={<Badge variant="neutral" size="sm">⌘K</Badge>}
          >
            Quick actions…
          </Button>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setQuery('');
          setActiveIndex(0);
        }}
        title="Command Palette"
        description="Search for actions, navigate, or run recent commands."
        size="lg"
        scrollable
      >
        <div className="space-y-4">
          <CommandPaletteInput
            ref={inputRef}
            id={inputId}
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            listboxId={listboxId}
            activeDescendantId={activeDescendantId}
          />

          <AlertBanner
            variant="info"
            message="Pro tip: Press ⌘K from anywhere to open this palette."
          />

          {hasResults ? (
            <ResultList
              listboxId={listboxId}
              itemIdPrefix={itemIdPrefix}
              groups={groups}
              flat={flat}
              activeIndex={activeIndex}
              onSelect={(s) => handleSelect(s.item)}
              onHover={(i) => setActiveIndex(i)}
            />
          ) : (
            <EmptyState
              query={query}
              suggestions={suggestions}
              onSelect={handleSelect}
            />
          )}

          <Footer />
        </div>
      </Modal>
    </>
  );
}

/**
 * Backwards-compatible alias for existing imports:
 *   import { AppCommandBar } from '@/modules/app/AppCommandBar';
 *   import { AppCommandBar } from '@/modules/app/CommandPalette';
 */
export const AppCommandBar = CommandPalette;
