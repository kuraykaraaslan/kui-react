import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { MY_ORDERS } from '@/app/theme/event/event.data';
import { cn } from '@/libs/utils/cn';
import { EventOrderStatusBadge } from '@/modules/domains/event/EventOrderStatusBadge';

export const metadata: Metadata = {
  title: buildPageTitle('Orders', THEME_TITLES.event),
};

const FMT_CURRENCY = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
const FMT_DATE = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function OrdersPage() {
  const totalSpend = MY_ORDERS
    .filter((o) => o.status === 'PAID')
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="bg-surface-base min-h-screen">

      {/* hero */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border px-6 py-10">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-text-primary">Siparişlerim</h1>
            <p className="text-text-secondary text-sm mt-1">{MY_ORDERS.length} sipariş</p>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Toplam Sipariş', value: MY_ORDERS.length },
              { label: 'Toplam Harcama', value: FMT_CURRENCY.format(totalSpend) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-center min-w-[100px]">
                <p className="text-base font-black text-text-primary tabular-nums">{s.value}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* list */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-4">
        {MY_ORDERS.map((order) => (
          <a
            key={order.orderId}
            href={`/theme/event/orders/${order.orderId}`}
            className={cn(
              'group flex gap-4 rounded-2xl border border-border bg-surface-raised p-4 transition-all',
              'hover:shadow-md hover:border-border-strong',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            )}
          >
            {/* event thumbnail */}
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden shrink-0 bg-surface-overlay">
              {order.event.image && (
                <img src={order.event.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>

            {/* info */}
            <div className="flex-1 min-w-0 space-y-1">
              <p className="font-bold text-text-primary text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {order.event.title}
              </p>
              <p className="text-xs text-text-secondary">
                {FMT_DATE.format(order.event.startAt)}
              </p>
              <p className="text-xs text-text-disabled font-mono">{order.orderId}</p>
              {order.tickets.length > 0 && (
                <p className="text-xs text-text-secondary">
                  {order.tickets.length} bilet
                </p>
              )}
            </div>

            {/* right: status + total */}
            <div className="flex flex-col items-end justify-between shrink-0 gap-2">
              <EventOrderStatusBadge status={order.status} size="sm" />
              <p className="text-sm font-black text-text-primary tabular-nums">
                {FMT_CURRENCY.format(order.total)}
              </p>
            </div>
          </a>
        ))}
      </div>

    </div>
  );
}
