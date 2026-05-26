'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import type { SeatInfo } from '../types';

export function SeatButton({
  info,
  isSelected,
  onToggle,
  isDisabled,
}: {
  info: SeatInfo;
  isSelected: boolean;
  onToggle: () => void;
  isDisabled: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { seat, status } = info;

  const unavailable = status === 'SOLD' || status === 'BLOCKED';
  const held = status === 'HELD';
  const canInteract = !unavailable && !held && !isDisabled;

  const label = seat.label ?? `${seat.row}${seat.number}`;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={unavailable || held || (isDisabled && !isSelected)}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={label}
        aria-pressed={isSelected}
        className={cn(
          'relative flex h-7 w-7 items-center justify-center rounded text-[9px] font-bold border transition-all duration-100',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus',
          isSelected && 'bg-primary border-primary text-primary-fg scale-110 shadow-sm',
          !isSelected && status === 'AVAILABLE' && canInteract &&
            'bg-success-subtle border-success text-success-fg hover:bg-success hover:text-white hover:scale-110 cursor-pointer',
          !isSelected && status === 'AVAILABLE' && !canInteract && !unavailable && !held &&
            'bg-surface-overlay border-border text-text-disabled cursor-not-allowed',
          held && 'bg-warning-subtle border-warning text-warning cursor-not-allowed',
          unavailable && 'bg-surface-sunken border-transparent text-text-disabled opacity-35 cursor-not-allowed',
          seat.accessible && !unavailable && 'ring-1 ring-info ring-offset-1',
        )}
      >
        {seat.number}
        {seat.accessible && (
          <span className="absolute -top-1 -right-1 text-[7px] leading-none">♿</span>
        )}
      </button>

      {hovered && !unavailable && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 pointer-events-none
                     rounded-lg border border-border bg-surface-raised shadow-lg px-2.5 py-1.5
                     whitespace-nowrap text-[11px] text-text-primary"
        >
          <span className="font-semibold">Sıra {seat.row} · Koltuk {seat.number}</span>
          {seat.accessible && <span className="ml-1 text-info">· Engelsiz</span>}
          {seat.companionSeat && <span className="ml-1 text-text-secondary">· Refakatçi</span>}
          {held && <span className="ml-1 text-warning font-semibold">· Rezerve</span>}
        </div>
      )}
    </div>
  );
}
