'use client';
import { useState } from 'react';
import { CartSummary } from '@/modules/domains/common/cart/CartSummary';
import { DEMO_CART } from '../common.data';
import type { Cart } from '@/modules/domains/common/CartTypes';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

export default function CartPage() {
  const [cart, setCart] = useState<Cart>(DEMO_CART);
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();

  function handleQuantityChange(id: string, qty: number) {
    setCart((prev) => {
      const items = prev.items.map((item) =>
        item.cartItemId === id ? { ...item, quantity: qty } : item,
      );
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const discountTotal = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
      const taxTotal = Math.round((subtotal - discountTotal) * 0.18 * 100) / 100;
      return {
        ...prev,
        items,
        totals: { ...prev.totals, subtotal, discountTotal, taxTotal, total: subtotal - discountTotal + taxTotal + prev.totals.serviceFee },
      };
    });
  }

  function handleRemove(id: string) {
    setCart((prev) => {
      const items = prev.items.filter((i) => i.cartItemId !== id);
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const discountTotal = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
      const taxTotal = Math.round((subtotal - discountTotal) * 0.18 * 100) / 100;
      return {
        ...prev,
        items,
        totals: { ...prev.totals, subtotal, discountTotal, taxTotal, total: subtotal - discountTotal + taxTotal + prev.totals.serviceFee },
      };
    });
  }

  async function handleCouponApply(code: string) {
    await new Promise((r) => setTimeout(r, 700));
    if (code === 'SAVE10') {
      setAppliedCoupon(code);
      setCart((prev) => {
        const discount = Math.round(prev.totals.subtotal * 0.1);
        return { ...prev, totals: { ...prev.totals, discountTotal: discount, total: prev.totals.subtotal - discount + prev.totals.taxTotal + prev.totals.serviceFee } };
      });
      return { success: true, message: '10% discount applied!' };
    }
    return { success: false, message: 'Invalid coupon. Try SAVE10.' };
  }

  function handleCouponRemove() {
    setAppliedCoupon(undefined);
    setCart((prev) => ({
      ...prev,
      totals: { ...prev.totals, discountTotal: 0, total: prev.totals.subtotal + prev.totals.taxTotal + prev.totals.serviceFee },
    }));
  }

  return (
    <>
      <DocumentTitle text="Cart — Common Theme" />
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Shopping Cart</h1>
        {cart.items.length > 0 && (
          <span className="text-sm text-text-secondary">
            {cart.items.reduce((s, i) => s + i.quantity, 0)} items
          </span>
        )}
      </div>

      <CartSummary
        cart={cart}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemove}
        onCouponApply={handleCouponApply}
        onCouponRemove={handleCouponRemove}
        appliedCoupon={appliedCoupon}
        onCheckout={() => { window.location.href = '/theme/common/payment/checkout'; }}
        checkoutLabel="Proceed to Checkout →"
        showTotals
        showCoupon
      />
    </div>
    </>
  );
}
