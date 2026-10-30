'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormSchema, CheckoutFormData } from '@/lib/validation';
import { useCart } from '@/context/CartContext';
import { formatCurrency, generateOrderId } from '@/lib/utils';
import { saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import { Order } from '@/types/order';
import {
  ShieldAlert,
  CreditCard,
  Lock,
  CheckCircle,
  Truck,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export const CheckoutForm: React.FC = () => {
  const router = useRouter();
  const { items, summary, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      setSubmitError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate network latency for a realistic checkout experience
      await new Promise((resolve) => setTimeout(resolve, 800));

      const orderId = generateOrderId();
      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: data,
        items: [...items],
        subtotal: summary.subtotal,
        shipping: summary.shipping,
        total: summary.total,
        paymentMethod: 'Simulated Cash On Delivery / Demo Pay',
        status: 'confirmed',
      };

      // Save order to localStorage
      saveToStorage(STORAGE_KEYS.LAST_ORDER, newOrder);

      // Clear cart upon successful order creation
      clearCart();

      // Navigate to order success page
      router.push(`/order-success?orderId=${orderId}`);
    } catch (err) {
      console.error('Order creation failed:', err);
      setSubmitError('Failed to process your simulated order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Checkout Shipping Form */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
        {/* Simulated Demo Disclaimer Banner */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold uppercase tracking-wide">Simulated Checkout Demonstration</p>
            <p className="leading-relaxed">
              This is a frontend demonstration for the Arrowstack Frontend Internship. No actual charges will be made. Please enter test details.
            </p>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Shipping Information</h2>
            <p className="text-xs text-slate-500 mt-1">
              Where should we deliver your simulated order?
            </p>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="e.g. Rahul Sharma"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                {...register('fullName')}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                    : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="e.g. rahul@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number (10 digits) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="e.g. 9876543210"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  {...register('phone')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="address"
                type="text"
                autoComplete="street-address"
                placeholder="House / Flat No., Apartment / Street, Landmark"
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? 'address-error' : undefined}
                {...register('address')}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                  errors.address
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                    : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.address && (
                <p id="address-error" className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* City, State & Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="e.g. Hyderabad"
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  {...register('city')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.city
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {errors.city && (
                  <p id="city-error" className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State <span className="text-rose-500">*</span>
                </label>
                <input
                  id="state"
                  type="text"
                  autoComplete="address-level1"
                  placeholder="e.g. Telangana"
                  aria-invalid={Boolean(errors.state)}
                  aria-describedby={errors.state ? 'state-error' : undefined}
                  {...register('state')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.state
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {errors.state && (
                  <p id="state-error" className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  PIN Code <span className="text-rose-500">*</span>
                </label>
                <input
                  id="postalCode"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="e.g. 500081"
                  maxLength={6}
                  aria-invalid={Boolean(errors.postalCode)}
                  aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
                  {...register('postalCode')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.postalCode
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {errors.postalCode && (
                  <p id="postalCode-error" className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Simulated Payment Option */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Simulated Payment Mode</h3>
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-white" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Demo Instant Confirmation (Simulated)</p>
                  <p className="text-xs text-slate-500">Test orders are recorded in local memory without real payment</p>
                </div>
              </div>
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Place Order CTA Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Demo Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Place Order • {formatCurrency(summary.total)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-sm sticky top-24 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-200">
          Order Summary ({summary.itemsCount} {summary.itemsCount === 1 ? 'item' : 'items'})
        </h3>

        {/* Compact Item List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between gap-3 text-sm py-1">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{item.product.name}</p>
                <p className="text-xs text-slate-500">
                  Qty: {item.quantity} × {formatCurrency(item.product.price)}
                </p>
              </div>
              <span className="font-semibold text-slate-900 flex-shrink-0">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2.5 pt-4 border-t border-slate-200 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">{formatCurrency(summary.subtotal)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-semibold text-slate-900">
              {summary.shipping === 0 ? (
                <span className="text-emerald-600 font-bold">FREE</span>
              ) : (
                formatCurrency(summary.shipping)
              )}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-base font-bold text-slate-900">Total Payable</span>
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(summary.total)}
            </span>
          </div>
        </div>

        {/* Guarantee Points */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Fast door-to-door delivery across India</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Verified Arrowstack Internship Frontend Demonstration</span>
          </div>
        </div>
      </div>
    </div>
  );
};
