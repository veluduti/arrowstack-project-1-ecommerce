'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Star, ShoppingBag, Eye, Check, PackageOpen, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) return;

    setIsAdding(true);
    const result = addToCart(product, 1);

    if (result.success) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
      }, 1500);
    }
    setIsAdding(false);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article
      data-testid="product-card"
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        {/* Discount Badge */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
            {product.discountPercentage}% OFF
          </span>
        )}

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 z-10 bg-slate-800 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Only {product.stock} left
          </span>
        ) : null}

        <Link
          href={`/products/${product.id}`}
          className="block w-full h-full focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
          aria-label={`View details for ${product.name}`}
        >
          {!imageError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-400">
              <PackageOpen className="w-12 h-12 mb-2 text-slate-300" />
              <span className="text-xs font-medium text-slate-500 text-center">{product.name}</span>
            </div>
          )}
        </Link>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              {product.category}
            </span>
            {product.brand && <span className="text-slate-400">{product.brand}</span>}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-slate-900 text-base line-clamp-2 hover:text-blue-600 transition-colors">
            <Link href={`/products/${product.id}`} className="focus-visible:ring-1 rounded">
              {product.name}
            </Link>
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2" aria-label={`Rating: ${product.rating} out of 5 stars`}>
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200 fill-slate-200'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Buttons: View Details & Add to Cart */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.id}`}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label={`View details of ${product.name}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : justAdded
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow'
              }`}
              aria-label={
                isOutOfStock
                  ? `${product.name} is out of stock`
                  : `Add ${product.name} to cart`
              }
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

