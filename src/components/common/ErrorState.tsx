'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this content. Please try again.',
  onRetry,
  showHomeButton = true,
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center p-8 text-center bg-rose-50 border border-rose-200 rounded-xl max-w-lg mx-auto my-8"
    >
      <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
        <AlertCircle className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-rose-950 mb-2">{title}</h3>
      <p className="text-sm text-rose-700 mb-6 max-w-md">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
        {showHomeButton && (
          <Link
            href="/products"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white border border-rose-300 text-rose-900 font-medium hover:bg-rose-50 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            Browse Products
          </Link>
        )}
      </div>
    </div>
  );
};

