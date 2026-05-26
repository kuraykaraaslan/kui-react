'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells } from '@fortawesome/free-solid-svg-icons';

export function MapHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface-overlay text-text-secondary">
        <FontAwesomeIcon icon={faTableCells} className="w-3.5 h-3.5" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary">Koltuk Haritası</p>
        <p className="text-[11px] text-text-secondary">Bölüme tıklayın → koltuk seçin</p>
      </div>
    </div>
  );
}
