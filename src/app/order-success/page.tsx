'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Order } from '@/types/order';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { formatCurrency } from '@/lib/utils';
import {
  CheckCircle,
  ShoppingBag,
  Truck,
  Copy,
  Check,
  Package,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedOrder = getFromStorage<Order | null>(STORAGE_KEYS.LAST_ORDER, null);
    if (savedOrder && (!orderIdParam || savedOrder.id === orderIdParam)) {
      setOrder(savedOrder);
    }
  }, [orderIdParam]);

  const handleCopyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Success Celebration Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Simulated Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Your simulated order has been registered in local demonstration state. A simulated confirmation receipt has been generated.
          </p>
        </div>

        {/* Order ID display box */}
        {order && (
          <div className="inline-flex items-center gap-3 p-3 px-5 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-800">
            <span>Order ID:</span>
            <span data-testid="order-id-display" className="font-mono font-bold text-blue-600">
              {order.id}
            </span>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors focus-visible:ring-1"
              aria-label="Copy order ID to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {order ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Order Details & Items */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Purchased Products ({order.items.length})</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity} × {formatCurrency(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 flex-shrink-0">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline font-bold text-base text-slate-900">
                <span>Total Amount Paid</span>
                <span className="text-xl font-black text-blue-600">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Destination Information */}
          <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <Truck className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Delivery Information</h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div>
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">Customer Name</span>
                <span className="font-bold text-slate-900 text-sm">{order.customer.fullName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate">{order.customer.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>+91 {order.customer.phone}</span>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{order.customer.address}</p>
                  <p className="text-slate-500">
                    {order.customer.city}, {order.customer.state} - {order.customer.postalCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Continue Shopping CTA */}
            <div className="pt-4 border-t border-slate-200">
              <Link
                href="/products"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Start Shopping</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-center text-slate-500">Loading order summary...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
