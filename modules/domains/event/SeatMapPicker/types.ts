import type { VenueSection, VenueSeat, EventSectionPricing, SeatStatus } from '../types';

export type { SeatStatus };

/* ─────────────────────────────────────────────
   Public types
───────────────────────────────────────────── */

export type SeatInfo = {
  seat: VenueSeat;
  status: SeatStatus;
  pricingId?: string | null;
};

/** Recursive tree node that mirrors the parentSectionId hierarchy. */
export type SectionNode = {
  section: VenueSection;
  pricing: EventSectionPricing | null;
  seats: SeatInfo[];          // non-empty only for leaf sections
  subsections: SectionNode[];  // non-empty only for non-leaf sections
};

/**
 * Describes how a top-level section is drawn on the venue SVG map.
 * Provide either `points` (polygon) or `path` (arbitrary SVG path).
 */
export type SectionMapShape = {
  sectionId: string;
  /** SVG polygon points string, e.g. "100,200 300,200 350,400 50,400" */
  points?: string;
  /** SVG path d attribute (alternative to points) */
  path?: string;
  /** Center X coordinate for the text label */
  labelX: number;
  /** Center Y coordinate for the text label */
  labelY: number;
  /** Optional rotation angle in degrees for the SVG label */
  labelRotate?: number;
  /**
   * Rotation angle (degrees, clockwise) applied to the seat grid when this
   * section is active. Use positive values for left-side sections facing the
   * stage, negative for right-side sections. Typical range: ±10–20°.
   */
  seatGridAngle?: number;
};

export type SeatMapPickerProps = {
  sections: SectionNode[];
  selectedSeatIds: string[];
  onSeatToggle: (seatId: string) => void;
  maxSelectable?: number;
  showStage?: boolean;
  className?: string;
  /**
   * When provided, renders a full SVG venue map instead of the tab bar.
   * Each entry links a SectionNode (by sectionId) to its polygon/path on the map.
   */
  mapShapes?: SectionMapShape[];
  /** SVG viewBox attribute. Default: "0 0 800 560" */
  mapViewBox?: string;
  /** Max pixel width of the venue map. Default: 540 */
  mapMaxWidth?: number;
  /** SVG polygon points for the stage/pitch shape */
  stagePoints?: string;
  /** SVG path d attribute for the stage/pitch shape */
  stagePath?: string;
  /** Label shown inside the stage shape. Default: "SAHNE / SAHA" */
  stageLabel?: string;
  /** X coordinate for stage label */
  stageLabelX?: number;
  /** Y coordinate for stage label */
  stageLabelY?: number;
};
