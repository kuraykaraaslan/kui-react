'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { OrderTrackingTimeline } from '@/modules/domains/food/order/OrderTrackingTimeline';
import { CourierCard } from '@/modules/domains/food/order/CourierCard';
import { EtaCountdownCard } from '@/modules/domains/food/order/EtaCountdownCard';
import { OrderStatusBadge } from '@/modules/domains/food/order/OrderStatusBadge';
import { DeliveryStatusBadge } from '@/modules/domains/food/order/DeliveryStatusBadge';
import { ORDER_TRACKINGS, SAMPLE_ORDERS } from '../../food.data';

function currency(amount: number, code: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(amount);
}

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const tracking = ORDER_TRACKINGS[orderId];
  const order = SAMPLE_ORDERS.find((o) => o.orderId === orderId);

  if (!tracking || !order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <a
        href="/theme/food/orders"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back to orders
      </a>

      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Order #{order.orderNumber}
          </h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            from <span className="font-medium text-text-primary">{order.restaurantName}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <DeliveryStatusBadge status={order.deliveryStatus} />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Main column: timeline */}
        <OrderTrackingTimeline steps={tracking.steps} />

        {/* Sidebar */}
        <aside className="space-y-5">
          <EtaCountdownCard
            estimatedArrival={tracking.estimatedArrival}
            destinationLabel={tracking.destinationLabel}
          />
          <CourierCard
            courier={tracking.courier}
            onCall={() => undefined}
            onMessage={() => undefined}
          />

          <section className="rounded-xl border border-border bg-surface-raised p-4 shadow-sm">
            <header className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <FontAwesomeIcon icon={faReceipt} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
              Receipt
            </header>
            <ul className="mb-3 flex flex-col gap-1.5 text-sm">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-baseline justify-between gap-2">
                  <span className="text-text-secondary">
                    {item.quantity}× {item.name}
                  </span>
                  <span className="text-text-primary tabular-nums">
                    {currency(item.unitPrice * item.quantity, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">Subtotal</dt>
                <dd className="tabular-nums">{currency(order.subtotal, order.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Delivery fee</dt>
                <dd className="tabular-nums">{currency(order.deliveryFee, order.currency)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{currency(order.total, order.currency)}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
