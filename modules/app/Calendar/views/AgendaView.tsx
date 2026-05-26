'use client';
// TODO M5: scrollable agenda list view with search + filters.
// For M1 we ship a labelled placeholder so the view switcher renders.

import { cn } from '@/libs/utils/cn';

type AgendaViewProps = {
  className?: string;
};

export function AgendaView({ className }: AgendaViewProps) {
  return (
    <div
      role="region"
      aria-label="Agenda view"
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-16 px-4 text-center',
        className,
      )}
    >
      <p className="text-sm font-medium text-text-primary">Agenda view</p>
      <p className="text-xs text-text-secondary max-w-sm">
        Scrollable timeline with search + filters lands in M5.
        {/* TODO M5: render groupBy(day) list of events with virtualisation. */}
      </p>
    </div>
  );
}
