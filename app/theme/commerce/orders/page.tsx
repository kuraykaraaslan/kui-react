import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { OrderCard } from '@/modules/domains/commerce/order/OrderCard';
import { OrderStatusBadge } from '@/modules/domains/commerce/order/OrderStatusBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { ORDERS } from '../commerce.data';
import type { OrderStatus } from '@/modules/domains/commerce/types';

export const metadata: Metadata = {
  title: buildPageTitle('Orders', THEME_TITLES['commerce']),
};

const ALL_STATUSES: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
];

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Orders</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {ORDERS.length} {ORDERS.length === 1 ? 'order' : 'orders'} placed
          </p>
        </div>
      </div>

      {/* Status filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-primary bg-primary-subtle text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          All
        </button>
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-surface-raised text-text-secondary hover:border-border-focus hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <OrderStatusBadge status={status} size="sm" />
          </button>
        ))}
      </div>

      {/* Orders list */}
      {ORDERS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FontAwesomeIcon icon={faClipboardList} className="w-16 h-16 text-text-disabled mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">No orders yet</h2>
          <p className="text-sm text-text-secondary">
            When you place an order, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ORDERS.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              href={`/theme/commerce/orders/${order.orderId}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
