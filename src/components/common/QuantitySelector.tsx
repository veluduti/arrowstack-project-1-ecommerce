'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  max: number;
  min?: number;
  onChange: (newQuantity: number) => void;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  max,
  min = 1,
  onChange,
  productName = 'product',
  size = 'md',
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (quantity > min && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max && !disabled) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    const clamped = Math.max(min, Math.min(val, max));
    onChange(clamped);
  };

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  const btnPadding = {
    sm: 'w-8',
    md: 'w-10',
    lg: 'w-12',
  };

  return (
    <div
      className={`inline-flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm ${sizeClasses[size]} ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      role="group"
      aria-label={`Quantity selector for ${productName}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        className={`flex items-center justify-center h-full ${btnPadding[size]} text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus-visible:ring-1 focus-visible:ring-blue-600`}
        aria-label={`Decrease quantity of ${productName}. Current: ${quantity}`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="w-12 h-full text-center font-semibold text-slate-800 border-x border-slate-200 focus:outline-none focus:bg-blue-50/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label={`Quantity of ${productName}`}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        className={`flex items-center justify-center h-full ${btnPadding[size]} text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus-visible:ring-1 focus-visible:ring-blue-600`}
        aria-label={`Increase quantity of ${productName}. Current: ${quantity}, Maximum: ${max}`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

