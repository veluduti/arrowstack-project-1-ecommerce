'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { EmptyState } from '@/components/common/EmptyState';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const { items, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-96 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title & Back to Cart */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Complete your shipping details to place your simulated demo order.
          </p>
        </div>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Cannot proceed with an empty cart"
          description="You do not have any items in your shopping cart. Please select items from our catalog before proceeding to checkout."
          icon={ShoppingBag}
          actionLabel="Browse Products"
          actionHref="/products"
        />
      ) : (
        <CheckoutForm />
      )}
    </div>
  );
}
