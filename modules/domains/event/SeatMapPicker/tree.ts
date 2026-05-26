import type { VenueSection, EventSectionPricing } from '../types';
import type { SeatInfo, SectionNode } from './types';

/* ─────────────────────────────────────────────
   buildSectionTree — flat data → SectionNode[]
───────────────────────────────────────────── */

export function buildSectionTree(
  sections: VenueSection[],
  seatInfos: SeatInfo[],
  pricings: EventSectionPricing[],
): SectionNode[] {
  const pricingBySectionId = new Map(pricings.map((p) => [p.sectionId, p]));
  const seatsBySection = new Map<string, SeatInfo[]>();
  for (const info of seatInfos) {
    const list = seatsBySection.get(info.seat.sectionId) ?? [];
    list.push(info);
    seatsBySection.set(info.seat.sectionId, list);
  }

  function buildNode(section: VenueSection): SectionNode {
    const children = sections
      .filter((s) => s.parentSectionId === section.sectionId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return {
      section,
      pricing: pricingBySectionId.get(section.sectionId) ?? null,
      seats: seatsBySection.get(section.sectionId) ?? [],
      subsections: children.map(buildNode),
    };
  }

  return sections
    .filter((s) => !s.parentSectionId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(buildNode);
}

/* ─────────────────────────────────────────────
   Seat counting helpers (recursive)
───────────────────────────────────────────── */

export function countAllSeats(node: SectionNode): number {
  return (
    node.seats.length +
    node.subsections.reduce((acc, sub) => acc + countAllSeats(sub), 0)
  );
}

export function countAvailSeats(node: SectionNode): number {
  return (
    node.seats.filter((s) => s.status === 'AVAILABLE').length +
    node.subsections.reduce((acc, sub) => acc + countAvailSeats(sub), 0)
  );
}

export function collectSeatIds(node: SectionNode): string[] {
  return [
    ...node.seats.map((s) => s.seat.seatId),
    ...node.subsections.flatMap(collectSeatIds),
  ];
}

/* ─────────────────────────────────────────────
   Internal helpers — seat grid
───────────────────────────────────────────── */

export function groupByRow(seats: SeatInfo[]): Map<string, SeatInfo[]> {
  const map = new Map<string, SeatInfo[]>();
  const sorted = [...seats].sort((a, b) => {
    const rc = a.seat.row.localeCompare(b.seat.row, undefined, { numeric: true });
    if (rc !== 0) return rc;
    return (
      (parseInt(a.seat.number) || 0) - (parseInt(b.seat.number) || 0) ||
      a.seat.number.localeCompare(b.seat.number, undefined, { numeric: true })
    );
  });
  for (const info of sorted) {
    const row = info.seat.row;
    const list = map.get(row) ?? [];
    list.push(info);
    map.set(row, list);
  }
  return map;
}
