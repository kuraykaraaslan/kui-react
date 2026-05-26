'use client';
import { useMemo } from 'react';
import type { SeatInfo } from '../types';
import { groupByRow } from '../tree';
import { SeatButton } from './SeatButton';

export function SeatGrid({
  seats,
  selectedIds,
  onToggle,
  maxReached,
  angle = 0,
}: {
  seats: SeatInfo[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  maxReached: boolean;
  angle?: number;
}) {
  const rows = useMemo(() => groupByRow(seats), [seats]);

  if (seats.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-secondary">
        Bu bölümde koltuk tanımlanmamış.
      </p>
    );
  }

  const rotated = angle !== 0;

  return (
    <div className={rotated ? 'flex items-center justify-center py-6 px-10' : 'overflow-x-auto pb-2'}>
      <div
        className="inline-flex flex-col gap-1.5 min-w-max"
        style={rotated ? { transform: `rotate(${angle}deg)` } : undefined}
      >
        {[...rows.entries()].map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-1.5">
            <span className="w-5 shrink-0 text-right text-[10px] font-bold text-text-secondary">
              {row}
            </span>
            <div className="flex gap-1">
              {rowSeats.map((info) => (
                <SeatButton
                  key={info.seat.seatId}
                  info={info}
                  isSelected={selectedIds.has(info.seat.seatId)}
                  onToggle={() => onToggle(info.seat.seatId)}
                  isDisabled={maxReached && !selectedIds.has(info.seat.seatId)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
