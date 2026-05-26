'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import type { SectionNode } from '../types';
import { SeatGrid } from './SeatGrid';

export function SectionView({
  node,
  selectedIds,
  onToggle,
  maxReached,
  gridAngle = 0,
  depth = 0,
}: {
  node: SectionNode;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  maxReached: boolean;
  gridAngle?: number;
  depth?: number;
}) {
  const [activeSubIdx, setActiveSubIdx] = useState(0);

  const availableCount = node.seats.filter((s) => s.status === 'AVAILABLE').length;

  if (node.subsections.length > 0) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {node.subsections.map((sub, i) => {
            const subAvail = sub.seats.filter((s) => s.status === 'AVAILABLE').length;
            return (
              <button
                key={sub.section.sectionId}
                type="button"
                onClick={() => setActiveSubIdx(i)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors border',
                  i === activeSubIdx
                    ? 'bg-primary text-primary-fg border-primary'
                    : 'border-border bg-surface-raised text-text-secondary hover:bg-surface-overlay hover:text-text-primary',
                )}
              >
                {sub.section.label ?? sub.section.name}
                {sub.section.capacity != null && (
                  <span className="ml-1.5 text-[10px] opacity-60">
                    {subAvail}/{sub.section.capacity}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <SectionView
          node={node.subsections[activeSubIdx]}
          selectedIds={selectedIds}
          onToggle={onToggle}
          maxReached={maxReached}
          gridAngle={gridAngle}
          depth={depth + 1}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">
          {availableCount} koltuk müsait
          {node.section.capacity != null && (
            <span className="text-text-disabled"> / {node.section.capacity}</span>
          )}
        </span>
        {node.pricing && (
          <span className="font-bold text-text-primary">
            {node.pricing.price === 0
              ? 'Ücretsiz'
              : `₺${node.pricing.price.toLocaleString('tr-TR')}`}
          </span>
        )}
      </div>
      <SeatGrid
        seats={node.seats}
        selectedIds={selectedIds}
        onToggle={onToggle}
        maxReached={maxReached}
        angle={gridAngle}
      />
    </div>
  );
}
