import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Loading product"
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-pulse flex flex-col"
    >
      <div className="w-full aspect-square bg-slate-200" />
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-5 bg-slate-200 rounded w-4/5" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-9 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 animate-pulse" role="status" aria-label="Loading product details">
      <div className="w-full aspect-square bg-slate-200 rounded-xl" />
      <div className="space-y-4">
        <div className="h-5 bg-slate-200 rounded w-28" />
        <div className="h-9 bg-slate-200 rounded w-4/5" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-24 bg-slate-200 rounded w-full" />
        <div className="h-12 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
  );
};
