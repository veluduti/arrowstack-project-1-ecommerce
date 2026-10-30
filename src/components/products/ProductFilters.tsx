'use client';

import React, { useState } from 'react';
import { CATEGORIES } from '@/data/products';
import { SortOption } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { Search, SlidersHorizontal, RotateCcw, X, ArrowUpDown } from 'lucide-react';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  sortBy: SortOption;
  onSortByChange: (value: SortOption) => void;
  onClearFilters: () => void;
  matchingCount: number;
  totalCount: number;
  priceBounds: { min: number; max: number };
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  sortBy,
  onSortByChange,
  onClearFilters,
  matchingCount,
  totalCount,
  priceBounds,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const hasActiveFilters =
    Boolean(search) ||
    category !== 'All' ||
    minPrice > priceBounds.min ||
    maxPrice < priceBounds.max ||
    sortBy !== 'popularity';

  const filterSidebarContent = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Categories
        </label>
        <div className="flex flex-col gap-1.5" role="radiogroup" aria-label="Filter by category">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onCategoryChange(cat)}
                className={`text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-5 border-t border-slate-200">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Price Range (₹)
        </label>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Min Price</span>
              <div className="relative mt-1">
                <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  aria-label="Minimum price"
                  value={minPrice}
                  min={priceBounds.min}
                  max={maxPrice}
                  onChange={(e) => onMinPriceChange(Math.max(priceBounds.min, Number(e.target.value) || 0))}
                  className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-medium">Max Price</span>
              <div className="relative mt-1">
                <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  aria-label="Maximum price"
                  value={maxPrice}
                  min={minPrice}
                  max={priceBounds.max}
                  onChange={(e) => onMaxPriceChange(Math.min(priceBounds.max, Number(e.target.value) || priceBounds.max))}
                  className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Min: {formatCurrency(priceBounds.min)}</span>
            <span>Max: {formatCurrency(priceBounds.max)}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            onClearFilters();
            setIsMobileFilterOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Top Search & Sort Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands, or categories..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            aria-label="Search products by name"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Open filter sidebar"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as SortOption)}
                className="appearance-none bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                aria-label="Sort products"
              >
                <option value="popularity">Popularity / Featured</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
                <option value="alphabetical">Alphabetical (A - Z)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Count & Active Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-600 mb-6">
        <p data-testid="matching-products-count" className="font-medium">
          Showing <span className="font-bold text-slate-900">{matchingCount}</span> of{' '}
          <span className="font-bold text-slate-900">{totalCount}</span> products
          {category !== 'All' && <span> in <strong className="text-blue-600">{category}</strong></span>}
          {search && <span> matching &quot;<strong>{search}</strong>&quot;</span>}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-rose-600 font-semibold hover:underline flex items-center gap-1 focus-visible:ring-1 rounded"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Desktop Sidebar Content rendered when container has sidebar */}
      <div className="hidden md:block">
        {filterSidebarContent}
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm flex justify-end">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
            className="w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-lg">Filters</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {filterSidebarContent}
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-md hover:bg-blue-700"
              >
                Apply Filters ({matchingCount} found)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
