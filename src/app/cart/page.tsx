'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummaryCard } from '@/components/cart/CartSummaryCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, clearCart, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review your chosen items and proceed to secure simulated checkout.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline p-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Shopping Cart</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your shopping cart is currently empty"
          description="Looks like you haven't added anything to your cart yet. Explore our curated collections of electronics, apparel, and lifestyle products to get started!"
          icon={ShoppingCart}
          actionLabel="Explore All Products"
          actionHref="/products"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
            <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Product Details</span>
              <span className="hidden sm:inline">Quantity & Price</span>
            </div>

            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}

            <div className="p-4 sm:p-5 bg-slate-50/50 flex items-center justify-between">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-4 sticky top-24">
            <CartSummaryCard />
          </div>
        </div>
      )}
    </div>
  );
}
