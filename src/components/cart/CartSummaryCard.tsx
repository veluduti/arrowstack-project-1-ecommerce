'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const CartSummaryCard: React.FC = () => {
  const { summary } = useCart();
  const { itemsCount, subtotal, shipping, total } = summary;

  const freeShippingThreshold = 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-200">
        Order Summary
      </h3>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
          <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
          {amountNeededForFreeShipping > 0 ? (
            <span>
              Add <strong className="text-blue-700">{formatCurrency(amountNeededForFreeShipping)}</strong> more for{' '}
              <strong className="text-blue-700">FREE Delivery!</strong>
            </span>
          ) : (
            <span className="text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              You unlocked <strong>FREE Express Delivery!</strong>
            </span>
          )}
        </div>
        <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              amountNeededForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-blue-600'
            }`}
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Items Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})</span>
          <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span className="flex items-center gap-1">
            Shipping Charges
            {shipping === 0 && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                FREE
              </span>
            )}
          </span>
          <span className="font-semibold text-slate-900">
            {shipping === 0 ? '₹0' : formatCurrency(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Taxes (GST)</span>
          <span className="text-xs text-slate-500">Included in prices</span>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
          <span className="text-base font-bold text-slate-900">Final Total</span>
          <span data-testid="cart-final-total" className="text-2xl font-black text-slate-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Link
          href="/checkout"
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/products"
          className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 text-sm focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Safety Reassurances */}
      <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted simulated checkout demo</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>Tracked delivery across 25,000+ PIN codes</span>
        </div>
      </div>
    </div>
  );
};
