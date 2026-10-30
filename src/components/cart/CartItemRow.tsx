'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartItem } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { QuantitySelector } from '@/components/common/QuantitySelector';
import { Trash2, PackageOpen } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const { product, quantity } = item;

  return (
    <div
      data-testid="cart-item-row"
      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50 transition-colors"
    >
      {/* Product Image & Title */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
          {!imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="96px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <PackageOpen className="w-8 h-8" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 block">
            {product.category}
          </span>
          <h4 className="text-sm sm:text-base font-semibold text-slate-900 truncate hover:text-blue-600 transition-colors">
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Unit Price: <span className="font-semibold text-slate-800">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="line-through text-slate-400 ml-1.5">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </p>
          {product.stock <= 5 && (
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
              Only {product.stock} left in stock!
            </p>
          )}
        </div>
      </div>

      {/* Quantity & Pricing Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <QuantitySelector
          quantity={quantity}
          max={product.stock}
          min={1}
          onChange={(newQty) => updateQuantity(product.id, newQty)}
          productName={product.name}
          size="sm"
        />

        <div className="text-right min-w-[5rem]">
          <span className="text-xs text-slate-400 block sm:hidden">Item Total</span>
          <span className="text-base font-bold text-slate-900">
            {formatCurrency(product.price * quantity)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(product.id)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
          aria-label={`Remove ${product.name} from shopping cart`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

