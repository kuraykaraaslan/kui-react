'use client';
import { useState, useMemo } from 'react';
import type { SectionNode, SectionMapShape } from '../types';
import { StageShape } from './StageShape';
import { SectionShape } from './SectionShape';

export function VenueMapView({
  sections,
  shapes,
  viewBox,
  stagePoints,
  stagePath,
  stageLabel = 'SAHNE / SAHA',
  stageLabelX,
  stageLabelY,
  maxWidth,
  selectedIds,
  onSectionClick,
}: {
  sections: SectionNode[];
  shapes: SectionMapShape[];
  viewBox: string;
  stagePoints?: string;
  stagePath?: string;
  stageLabel?: string;
  stageLabelX?: number;
  stageLabelY?: number;
  maxWidth: number;
  selectedIds: Set<string>;
  onSectionClick: (sectionId: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const nodeById = useMemo(
    () => new Map(sections.map((n) => [n.section.sectionId, n])),
    [sections],
  );

  return (
    <div className="w-full" style={{ maxWidth: maxWidth }}>
      <svg
        viewBox={viewBox}
        className="w-full h-auto select-none"
        xmlns="http://www.w3.org/2000/svg"
        role="group"
        aria-label="Mekan koltuk haritası"
      >
        <defs>
          <pattern id="smp-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1" style={{ fill: 'var(--border)', opacity: 0.5 }} />
          </pattern>
        </defs>

        {/* Blueprint background */}
        <rect width="100%" height="100%" style={{ fill: 'var(--surface-raised)' }} />
        <rect width="100%" height="100%" fill="url(#smp-dots)" />

        {/* Stage / pitch */}
        <StageShape
          stagePoints={stagePoints}
          stagePath={stagePath}
          stageLabel={stageLabel}
          stageLabelX={stageLabelX}
          stageLabelY={stageLabelY}
        />

        {/* Section shapes */}
        {shapes.map((shape) => {
          const node = nodeById.get(shape.sectionId);
          if (!node) return null;

          return (
            <SectionShape
              key={shape.sectionId}
              shape={shape}
              node={node}
              selectedIds={selectedIds}
              hovered={hoveredId === shape.sectionId}
              onHover={setHoveredId}
              onClick={onSectionClick}
            />
          );
        })}
      </svg>
    </div>
  );
}
