'use client';
// TODO M5: sidebar mini calendar that jumps the main view to the picked date.
// For M1 we ship a placeholder export so future imports compile.

type MiniCalendarProps = {
  date: Date;
  onDatePick?: (d: Date) => void;
  className?: string;
};

export function MiniCalendar(_props: MiniCalendarProps) {
  // TODO M5: monthly mini-grid with current month highlighted + click handler.
  return null;
}
