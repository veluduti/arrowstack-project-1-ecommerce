'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/data/products';
import { Product, SortOption } from '@/types/product';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductGridSkeleton } from '@/components/common/LoadingSkeleton';
import { PackageSearch } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();

  // Calculate global min and max prices from dataset
  const priceBounds = useMemo(() => {
    const prices = SAMPLE_PRODUCTS.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, []);

  // Filter and sort state initialized with URL params if available
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(priceBounds.min);
  const [maxPrice, setMaxPrice] = useState<number>(priceBounds.max);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [isLoading, setIsLoading] = useState(true);

  // Sync with URL query parameters on initial render or change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    const urlSort = searchParams.get('sort');

    if (urlCategory && CATEGORIES.includes(urlCategory as any)) {
      setCategory(urlCategory);
    }
    if (urlSearch) {
      setSearch(urlSearch);
    }
    if (urlSort && ['price-low-to-high', 'price-high-to-low', 'alphabetical', 'popularity', 'rating'].includes(urlSort)) {
      setSortBy(urlSort as SortOption);
    }

    // Simulate quick initial loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Combined search, category, and price filtering logic
  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((product) => {
      // 1. Search filter (product name, description, brand)
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesBrand = product.brand?.toLowerCase().includes(query) || false;
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesCategory) {
          return false;
        }
      }

      // 2. Category filter
      if (category !== 'All' && product.category !== category) {
        return false;
      }

      // 3. Price range filter
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // 4. Sorting logic
      switch (sortBy) {
        case 'price-low-to-high':
          return a.price - b.price;
        case 'price-high-to-low':
          return b.price - a.price;
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });
  }, [search, category, minPrice, maxPrice, sortBy]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
    setSortBy('popularity');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Heading */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Shop All Products
        </h1>
        <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
          Browse our complete catalog of consumer electronics, apparel, home goods, and wellness products with transparent pricing and fast delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Sidebar & Top Filters */}
        <aside className="col-span-1 md:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm md:sticky md:top-24">
          <ProductFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onClearFilters={handleClearFilters}
            matchingCount={filteredProducts.length}
            totalCount={SAMPLE_PRODUCTS.length}
            priceBounds={priceBounds}
          />
        </aside>

        {/* Products Grid Area */}
        <main className="col-span-1 md:col-span-3">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : filteredProducts.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-testid="product-grid"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching products found"
              description="We could not find any products matching your current search query or filter selection. Try adjusting your search keywords or resetting price and category filters."
              icon={PackageSearch}
              actionLabel="Clear All Filters"
              onAction={handleClearFilters}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8"><ProductGridSkeleton count={8} /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
