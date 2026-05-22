import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { Card } from '@/modules/ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faStore, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { OrderStatusBadge } from '@/modules/domains/food/order/OrderStatusBadge';
import { DeliveryStatusBadge } from '@/modules/domains/food/order/DeliveryStatusBadge';
import { SAMPLE_ORDERS } from '../food.data';

export const metadata: Metadata = {
  title: buildPageTitle('Orders', THEME_TITLES['food']),
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export default function OrdersPage() {
  return (
    <div className="bg-surface-base text-text-primary">
      {/* Sub-header */}
      <div className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Breadcrumb
            items={[
              { label: 'Home',   href: '/theme/food' },
              { label: 'Orders' },
            ]}
          />
          <div className="mt-3">
            <h1 className="text-2xl font-bold text-text-primary">My Orders</h1>
            <p className="text-sm text-text-secondary mt-0.5">{SAMPLE_ORDERS.length} orders in history</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10 space-y-4">
        {SAMPLE_ORDERS.length > 0 ? (
          SAMPLE_ORDERS.map((order) => (
            <Card key={order.orderId} variant="raised" className="overflow-hidden">
              <div className="p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-0.5">
                    <p className="text-xs text-text-secondary font-mono">{order.orderNumber}</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                      <FontAwesomeIcon icon={faStore} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
                      {order.restaurantName}
                    </div>
                    <p className="text-xs text-text-secondary">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <OrderStatusBadge status={order.orderStatus} size="sm" />
                    <DeliveryStatusBadge status={order.deliveryStatus} size="sm" />
                  </div>
                </div>

                {/* Items */}
                <ul className="divide-y divide-border border-t border-border -mx-5 px-5">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                      <span className="text-text-primary flex-1 min-w-0 truncate">
                        <span className="text-text-secondary mr-1">×{item.quantity}</span>
                        {item.name}
                      </span>
                      <span className="text-text-secondary shrink-0">
                        {formatPrice(item.unitPrice * item.quantity, order.currency)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                  <div className="space-y-0.5 text-text-secondary">
                    <p>Subtotal: {formatPrice(order.subtotal, order.currency)}</p>
                    <p>Delivery: {order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee, order.currency)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary">Total</p>
                    <p className="text-base font-bold text-text-primary">
                      {formatPrice(order.total, order.currency)}
                    </p>
                  </div>
                </div>

                {/* Action */}
                {order.orderStatus === 'DELIVERED' && (
                  <a
                    href={`/theme/food/restaurants/${order.restaurantId}`}
                    className="inline-flex items-center gap-2 self-start text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
                  >
                    <FontAwesomeIcon icon={faUtensils} className="w-3.5 h-3.5" aria-hidden="true" />
                    Reorder
                  </a>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <FontAwesomeIcon icon={faClipboardList} className="w-12 h-12 text-text-disabled" aria-hidden="true" />
            <div>
              <p className="font-medium text-text-primary">No orders yet</p>
              <p className="text-sm text-text-secondary mt-1">Your order history will appear here.</p>
            </div>
            <a
              href="/theme/food/restaurants"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-fg text-sm font-medium hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              Browse Restaurants
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
