import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { TicketCard } from '@/modules/domains/event/TicketCard';
import { EventOrderStatusBadge } from '@/modules/domains/event/EventOrderStatusBadge';
import {
  MY_ORDERS,
  getOrderById,
  getVenueByEventId,
} from '@/app/theme/event/event.data';

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return MY_ORDERS.map((o) => ({ id: o.orderId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const order = getOrderById(id);
  return { title: buildPageTitle(order ? `Order ${order.orderId}` : id, THEME_TITLES.event) };
}

const FMT_CURRENCY = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
const FMT_DATE = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const FMT_DATETIME = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });


export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) notFound();

  const venue = getVenueByEventId(order.event.eventId);

  return (
    <div className="bg-surface-base min-h-screen">

      {/* banner */}
      <div className="relative h-40 overflow-hidden">
        {order.event.image ? (
          <img src={order.event.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-black/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-6 relative z-10 pb-16 space-y-8">

        <Breadcrumb
          items={[
            { label: 'Ana Sayfa',   href: '/theme/event' },
            { label: 'Siparişlerim', href: '/theme/event/orders' },
            { label: order.orderId },
          ]}
        />

        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-text-primary">{order.event.title}</h1>
            <p className="text-sm text-text-secondary mt-1">
              {FMT_DATE.format(order.event.startAt)}
              {venue && ` · ${venue.name}, ${venue.city}`}
            </p>
          </div>
          <EventOrderStatusBadge status={order.status} size="md" className="self-start shrink-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* tickets */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">
              Biletler ({order.tickets.length})
            </h2>
            {order.tickets.map((entry) => (
              <div key={entry.ticket.ticketId} className="space-y-2">
                <TicketCard
                  ticket={entry.ticket}
                  event={entry.event}
                  section={entry.section}
                  orientation="horizontal"
                />
                <div className="flex justify-end">
                  <a
                    href={`/shared-ticket/${entry.ticket.ticketId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary-hover transition-colors"
                  >
                    Bileti paylaş →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* order summary */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface-raised p-5 space-y-4">
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">Sipariş Özeti</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Ara toplam</span>
                  <span className="font-mono">{FMT_CURRENCY.format(order.subtotal)}</span>
                </div>
                {order.serviceFee > 0 && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Hizmet bedeli</span>
                    <span className="font-mono">{FMT_CURRENCY.format(order.serviceFee)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-border flex justify-between font-black text-text-primary">
                  <span>Toplam</span>
                  <span className="font-mono">{FMT_CURRENCY.format(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-raised p-5 space-y-3 text-sm">
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">Sipariş Bilgileri</h2>
              <div className="space-y-2 text-text-secondary">
                <div className="flex justify-between gap-2">
                  <span>Sipariş No</span>
                  <span className="font-mono text-text-primary text-xs">{order.orderId}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Sipariş Tarihi</span>
                  <span className="text-text-primary text-xs text-right">{FMT_DATETIME.format(order.createdAt)}</span>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between gap-2">
                    <span>Ödeme Tarihi</span>
                    <span className="text-text-primary text-xs text-right">{FMT_DATETIME.format(order.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <a
              href={`/theme/event/events/${order.event.slug}`}
              className="flex w-full items-center justify-center rounded-xl border border-border bg-surface-raised hover:bg-surface-overlay px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              Etkinlik Sayfasına Git →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
