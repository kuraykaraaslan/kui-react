'use client';
import { useState, useCallback } from 'react';
import type { SectionNode } from '../types';

/**
 * Coordinates section navigation state for both modes:
 * - Tab mode: `activeSectionIdx` selects from top-level `sections[]`.
 * - Map mode: `activeSectionId` selects a section drilled into from the map.
 */
export function useSectionNavigation(sections: SectionNode[]) {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const setActiveByIdx = useCallback((idx: number) => {
    setActiveSectionIdx(idx);
  }, []);

  const setActiveBySection = useCallback((sectionId: string | null) => {
    setActiveSectionId(sectionId);
  }, []);

  const goUp = useCallback(() => {
    setActiveSectionId(null);
  }, []);

  const activeNode = activeSectionId
    ? (sections.find((n) => n.section.sectionId === activeSectionId) ?? null)
    : null;

  return {
    activeSectionIdx,
    activeSectionId,
    activeNode,
    setActiveByIdx,
    setActiveBySection,
    goUp,
  };
}
