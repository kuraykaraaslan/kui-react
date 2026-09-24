'use client';
import Link from 'next/link';
import { Button } from '@/modules/ui/Button';
import { cn } from '@/libs/utils/cn';
import type { EventSectionPricing } from '@/modules/domains/event/types';

type TicketPurchaseBoxProps = {
  priceLabel: string;
  pricings: EventSectionPricing[];
  canBuy: boolean;
  isSoldOut: boolean;
  isCancelled: boolean;
  eventSlug: string;
  remainingCapacity?: number | null;
  className?: string;
};

export function TicketPurchaseBox({
  priceLabel,
  pricings,
  canBuy,
  isSoldOut,
  isCancelled,
  eventSlug,
  remainingCapacity,
  className,
}: TicketPurchaseBoxProps) {
  return (
    <div className={cn('rounded-2xl border border-border bg-surface-raised overflow-hidden shadow-sm', className)}>
      <div className="bg-primary px-5 py-4">
        <p className="text-primary-fg/80 text-xs font-medium">Bilet fiyatları</p>
        <p className="text-primary-fg font-black text-2xl mt-0.5">{priceLabel}</p>
      </div>

      <div className="p-5 space-y-4">
        {pricings.length > 0 ? (
          <div className="space-y-2">
            {pricings.map((p) => {
              const remaining = p.capacity != null ? p.capacity - p.soldCount : null;
              const soldOut = remaining != null && remaining <= 0;
              return (
                <div
                  key={p.eventSectionPricingId}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{p.name}</p>
                    {remaining != null && remaining <= 20 && remaining > 0 && (
                      <p className="text-xs text-warning font-medium">Son {remaining} koltuk</p>
                    )}
                    {soldOut && <p className="text-xs text-error font-medium">Tükendi</p>}
                  </div>
                  <span className="text-sm font-bold text-text-primary tabular-nums">
                    {p.price === 0 ? 'Ücretsiz' : `₺${p.price.toLocaleString('tr-TR')}`}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Bilet bilgisi yakında.</p>
        )}

        {canBuy ? (
          <Link
            href={`/theme/event/events/${eventSlug}/checkout`}
            className="flex w-full items-center justify-center rounded-md bg-primary text-primary-fg hover:bg-primary-hover px-5 py-2.5 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            Bilet Satın Al
          </Link>
        ) : (
          <Button fullWidth size="lg" disabled>
            {isSoldOut ? 'Biletler Tükendi' : isCancelled ? 'İptal Edildi' : 'Mevcut Değil'}
          </Button>
        )}

        {remainingCapacity != null && remainingCapacity < 1000 && !isSoldOut && (
          <p className="text-center text-xs text-warning font-medium">
            ⚡ Hızlı sat — sadece {remainingCapacity.toLocaleString('tr-TR')} bilet kaldı!
          </p>
        )}

        <p className="text-center text-xs text-text-secondary">
          🔒 Güvenli ödeme · İade garantisi
        </p>
      </div>
    </div>
  );
}
