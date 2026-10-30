'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SAMPLE_PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { QuantitySelector } from '@/components/common/QuantitySelector';
import { ProductCard } from '@/components/products/ProductCard';
import { ErrorState } from '@/components/common/ErrorState';
import {
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  PackageOpen,
  AlertTriangle,
  User,
  Clock,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const productId = params?.id as string;

  // Find product from dataset
  const product = useMemo(() => {
    return SAMPLE_PRODUCTS.find((p) => p.id === productId);
  }, [productId]);

  // Related products from the same category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return SAMPLE_PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id
    ).slice(0, 4);
  }, [product]);

  // Simulated customer reviews
  const simulatedReviews = useMemo(() => {
    return [
      {
        id: 'rev-1',
        author: 'Priya Sharma',
        rating: 5,
        date: '2 days ago',
        verified: true,
        comment:
          'Absolute top-notch quality! Fast delivery and packaged securely. Exceeded my expectations.',
      },
      {
        id: 'rev-2',
        author: 'Arun Verma',
        rating: 5,
        date: '1 week ago',
        verified: true,
        comment:
          'Incredible build craftsmanship and performance. Highly recommend this for anyone looking for authentic value.',
      },
      {
        id: 'rev-3',
        author: 'Neha Joshi',
        rating: 4,
        date: '2 weeks ago',
        verified: true,
        comment:
          'Very solid product for this price bracket. Customer support was also helpful with delivery queries.',
      },
    ];
  }, []);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ErrorState
          title="Product Not Found"
          message={`We couldn't locate any product with ID "${productId}". It might have been moved or removed from our catalog.`}
          showHomeButton={true}
        />
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const result = addToCart(product, quantity);
    if (result.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 sm:space-y-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/products" className="hover:text-blue-600 transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-blue-600 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" aria-label="Product Details">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100">
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {product.discountPercentage}% OFF
              </span>
            )}

            {!imageError ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-slate-400">
                <PackageOpen className="w-20 h-20 mb-3 text-slate-300" />
                <span className="text-sm font-medium">{product.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Buying Actions and Details */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              <span>{product.category}</span>
              {product.brand && <span className="text-slate-500 font-medium">Brand: {product.brand}</span>}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings Bar */}
            <div className="flex items-center gap-2 mt-3" aria-label={`Rating: ${product.rating} out of 5 stars`}>
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-slate-500">
                ({product.reviewCount} verified ratings)
              </span>
            </div>
          </div>

          {/* Pricing & Discounts */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 flex items-baseline gap-4">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full">
                  Save {formatCurrency(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Stock Availability */}
          <div>
            {isOutOfStock ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Currently Out of Stock</span>
              </div>
            ) : isLowStock ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Hurry! Only {product.stock} items left in stock</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>In Stock ({product.stock} units available)</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications Table (if present) */}
          {product.specs && (
            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Specifications
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs sm:text-sm">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50 transition-colors">
                    <span className="font-semibold text-slate-500">{key}</span>
                    <span className="col-span-2 text-slate-900 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart Action Area */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="pdp-quantity" className="text-sm font-bold text-slate-700">
                Quantity:
              </label>
              <QuantitySelector
                quantity={quantity}
                max={product.stock}
                min={1}
                onChange={setQuantity}
                productName={product.name}
                disabled={isOutOfStock}
                size="md"
              />
              <span className="text-xs text-slate-500">
                Max {product.stock} per customer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Cart'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isOutOfStock) {
                    addToCart(product, quantity);
                    router.push('/cart');
                  }
                }}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Delivery & Trust Badges */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Free Delivery above ₹999</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <RotateCcw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>7-Day Return Guarantee</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>100% Genuine Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Simulated Customer Reviews Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Customer Reviews</h2>
            <p className="text-xs text-slate-500 mt-0.5">Verified simulated customer feedback</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400 block">out of 5 stars</span>
          </div>
        </div>

        <div className="space-y-4">
          {simulatedReviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {rev.author[0]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{rev.author}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Verified Buyer
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Related {product.category} Products
            </h2>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
            >
              View more in {product.category}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

