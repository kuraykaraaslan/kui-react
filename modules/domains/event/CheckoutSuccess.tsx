'use client';
import Link from 'next/link';
import { Button } from '@/modules/ui/Button';
import { TicketCard } from '@/modules/domains/event/TicketCard';
import type { EventSectionPricing } from '@/modules/domains/event/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const FMT = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });

type CartItem = { pricing: EventSectionPricing; quantity: number };

type CheckoutSuccessProps = {
  orderId: string;
  ticketId: string;
  buyerName: string;
  buyerEmail: string;
  event: {
    eventId: string;
    title: string;
    startAt: Date;
    slug: string;
  };
  venue: { name: string; city: string };
  cartItems: CartItem[];
  total: number;
};

export function CheckoutSuccess({
  orderId,
  ticketId,
  buyerName,
  buyerEmail,
  event,
  venue,
  cartItems,
  total,
}: CheckoutSuccessProps) {
  const ticket = {
    ticketId,
    orderId,
    orderItemId: `OI-${ticketId}`,
    eventId: event.eventId,
    hallId: 'hall-1',
    sectionId: cartItems[0]?.pricing.sectionId ?? 'sec-1',
    seatId: 'seat-auto',
    eventSeatId: 'eseat-auto',
    pricingId: cartItems[0]?.pricing.eventSectionPricingId ?? 'price-1',
    attendeeName: buyerName || null,
    attendeeEmail: buyerEmail || null,
    qrCode: `QR-${ticketId}-${event.eventId}`.toUpperCase(),
    barcode: null,
    status: 'VALID' as const,
    checkedInAt: null,
    checkedInBy: null,
    transferredToUserId: null,
    transferredAt: null,
    createdAt: new Date(),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 space-y-6">
      <div className="text-center space-y-3">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-success-subtle mx-auto">
          <FontAwesomeIcon icon={faCheck} className="w-10 h-10 text-success" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-black text-text-primary">Ödeme Başarılı!</h1>
        <p className="text-text-secondary">
          Biletiniz oluşturuldu. Sipariş numaranız: <strong>{orderId}</strong>
        </p>
        {buyerEmail && (
          <p className="text-xs text-text-secondary">
            Bilet detayları <strong>{buyerEmail}</strong> adresine gönderildi.
          </p>
        )}
      </div>

      <TicketCard
        ticket={ticket}
        event={{
          title: event.title,
          startAt: event.startAt,
          venueName: venue.name,
          venueCity: venue.city,
        }}
        section={cartItems[0] ? { sectionName: cartItems[0].pricing.name } : undefined}
      />

      <div className="rounded-xl border border-border bg-surface-raised p-4 space-y-2 text-sm">
        <p className="font-semibold text-text-primary">Sipariş özeti</p>
        {cartItems.map((item) => (
          <div key={item.pricing.eventSectionPricingId} className="flex justify-between text-text-secondary">
            <span>{item.pricing.name} × {item.quantity}</span>
            <span className="font-mono">{FMT.format(item.pricing.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-border pt-2 flex justify-between font-bold text-text-primary">
          <span>Toplam</span>
          <span className="font-mono">{FMT.format(total)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" fullWidth onClick={() => window.print()}>
          Yazdır / PDF
        </Button>
        <Link
          href="/theme/event/orders"
          className="flex flex-1 items-center justify-center rounded-md border border-border bg-surface-raised hover:bg-surface-overlay px-4 py-2 text-sm font-medium text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          Siparişlerim
        </Link>
        <Link
          href={`/theme/event/events/${event.slug}`}
          className="flex flex-1 items-center justify-center rounded-md bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          Etkinliğe Dön
        </Link>
      </div>
    </div>
  );
}
