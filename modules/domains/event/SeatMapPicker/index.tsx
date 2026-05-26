'use client';
import { useMemo } from 'react';
import { cn } from '@/libs/utils/cn';
import type { SeatMapPickerProps } from './types';
import { useSectionNavigation } from './hooks/useSectionNavigation';
import { MapHeader } from './parts/MapHeader';
import { SectionDetailHeader } from './parts/SectionDetailHeader';
import { SectionView } from './parts/SectionView';
import { Legend } from './parts/Legend';
import { VenueMapView } from './venue/VenueMapView';

/* ─────────────────────────────────────────────
   Public surface re-exports
───────────────────────────────────────────── */
export type { SeatInfo, SectionNode, SectionMapShape, SeatStatus, SeatMapPickerProps } from './types';
export { buildSectionTree } from './tree';

/* ─────────────────────────────────────────────
   SeatMapPicker — main export
───────────────────────────────────────────── */

export function SeatMapPicker({
  sections,
  selectedSeatIds,
  onSeatToggle,
  maxSelectable,
  showStage = true,
  className,
  mapShapes,
  mapViewBox = '0 0 800 560',
  mapMaxWidth = 540,
  stagePoints,
  stagePath,
  stageLabel,
  stageLabelX,
  stageLabelY,
}: SeatMapPickerProps) {
  const {
    activeSectionIdx,
    activeNode,
    setActiveByIdx,
    setActiveBySection,
    goUp,
  } = useSectionNavigation(sections);

  const selectedIds = useMemo(() => new Set(selectedSeatIds), [selectedSeatIds]);
  const maxReached = maxSelectable != null && selectedIds.size >= maxSelectable;

  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-surface-raised p-8 text-sm text-text-secondary">
        Koltuk verisi bulunamadı.
      </div>
    );
  }

  /* ── MAP MODE (mapShapes provided) ── */
  if (mapShapes) {
    const activeShape = activeNode ? mapShapes.find((s) => s.sectionId === activeNode.section.sectionId) : undefined;
    const gridAngle = activeShape?.seatGridAngle ?? 0;

    return (
      <div className={cn('rounded-xl border border-border bg-surface-raised overflow-hidden', className)}>
        {activeNode
          ? <SectionDetailHeader node={activeNode} onBack={goUp} />
          : <MapHeader />
        }

        {activeNode ? (
          <div className="p-4">
            <SectionView
              node={activeNode}
              selectedIds={selectedIds}
              onToggle={onSeatToggle}
              maxReached={maxReached}
              gridAngle={gridAngle}
            />
          </div>
        ) : (
          <VenueMapView
            sections={sections}
            shapes={mapShapes}
            viewBox={mapViewBox}
            stagePoints={stagePoints}
            stagePath={stagePath}
            stageLabel={stageLabel}
            stageLabelX={stageLabelX}
            stageLabelY={stageLabelY}
            maxWidth={mapMaxWidth}
            selectedIds={selectedIds}
            onSectionClick={setActiveBySection}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <Legend />
          <p className="text-sm font-semibold text-text-primary">
            {selectedIds.size} koltuk seçili
            {maxSelectable != null && (
              <span className="font-normal text-text-secondary"> / {maxSelectable} max</span>
            )}
          </p>
        </div>
      </div>
    );
  }

  /* ── TAB MODE (fallback when no mapShapes) ── */
  const activeSection = sections[activeSectionIdx];

  return (
    <div className={cn('rounded-xl border border-border bg-surface-raised overflow-hidden', className)}>
      {showStage && (
        <div className="relative px-6 pt-5 pb-1">
          <div
            className="mx-auto h-7 rounded-t-full border border-b-0 border-border bg-surface-overlay flex items-center justify-center"
            style={{ maxWidth: 240 }}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-disabled">
              Sahne / Saha
            </span>
          </div>
          <div
            className="mx-auto mt-0 h-4 border-l border-r border-border opacity-30"
            style={{ maxWidth: 240 }}
          />
        </div>
      )}

      {sections.length > 1 && (
        <div className="flex gap-0.5 border-b border-border px-4 pt-3 overflow-x-auto">
          {sections.map((node, i) => (
            <button
              key={node.section.sectionId}
              type="button"
              onClick={() => setActiveByIdx(i)}
              className={cn(
                'shrink-0 rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px',
                i === activeSectionIdx
                  ? 'border-primary text-primary bg-primary-subtle'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
              )}
            >
              {node.section.label ?? node.section.name}
              {node.pricing && (
                <span className="ml-1.5 text-xs font-normal opacity-70">
                  {node.pricing.price === 0
                    ? 'Ücretsiz'
                    : `₺${node.pricing.price.toLocaleString('tr-TR')}`}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 space-y-4">
        <SectionView
          node={activeSection}
          selectedIds={selectedIds}
          onToggle={onSeatToggle}
          maxReached={maxReached}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <Legend />
          <p className="text-sm font-semibold text-text-primary">
            {selectedIds.size} koltuk seçili
            {maxSelectable != null && (
              <span className="font-normal text-text-secondary"> / {maxSelectable} max</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
