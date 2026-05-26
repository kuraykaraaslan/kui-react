'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { SectionNode } from '../types';
import { countAllSeats, countAvailSeats } from '../tree';

export function SectionDetailHeader({
  node,
  onBack,
}: {
  node: SectionNode;
  onBack: () => void;
}) {
  const avail = countAvailSeats(node);
  const total = countAllSeats(node);

  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3">
      <button
        type="button"
        onClick={onBack}
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border',
          'bg-surface-overlay text-text-secondary',
          'hover:bg-surface-sunken hover:text-text-primary transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus',
        )}
        aria-label="Haritaya dön"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" aria-hidden />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary truncate">
          {node.section.label ?? node.section.name}
        </p>
        <p className="text-[11px] text-text-secondary">
          {avail} / {total} koltuk müsait
        </p>
      </div>

      {node.pricing && (
        <div className="shrink-0 text-right">
          <p className="text-sm font-black text-text-primary">
            {node.pricing.price === 0
              ? 'Ücretsiz'
              : `₺${node.pricing.price.toLocaleString('tr-TR')}`}
          </p>
          <p className="text-[10px] text-text-secondary">koltuk başı</p>
        </div>
      )}
    </div>
  );
}
