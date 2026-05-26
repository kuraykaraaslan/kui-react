'use client';
import { Badge } from '@/modules/ui/Badge';
import { ResultItem } from './ResultItem';
import type { CommandGroup, ScoredCommand } from '../types';

type ResultListProps = {
  listboxId: string;
  itemIdPrefix: string;
  groups: CommandGroup[];
  flat: ScoredCommand[];
  activeIndex: number;
  onSelect: (cmd: ScoredCommand) => void;
  onHover: (index: number) => void;
};

export function ResultList({
  listboxId,
  itemIdPrefix,
  groups,
  flat,
  activeIndex,
  onSelect,
  onHover,
}: ResultListProps) {
  return (
    <div id={listboxId} role="listbox" className="max-h-72 overflow-y-auto space-y-3">
      {groups.map((group) => (
        <div key={group.category}>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" size="sm">{group.category}</Badge>
          </div>
          <div className="space-y-0.5">
            {group.items.map((scored) => {
              const flatIndex = flat.indexOf(scored);
              const itemId = `${itemIdPrefix}-${flatIndex}`;
              return (
                <ResultItem
                  key={(scored.item.id ?? scored.item.label) + '::' + group.category}
                  id={itemId}
                  scored={scored}
                  active={flatIndex === activeIndex}
                  onSelect={() => onSelect(scored)}
                  onHover={() => onHover(flatIndex)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
