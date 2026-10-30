'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Product } from '@/types/product';
import { CartItem, CartSummaryData } from '@/types/cart';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';

export interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  summary: CartSummaryData;
  toasts: ToastInfo[];
  removeToast: (id: string) => void;
  showToast: (message: string, type?: ToastInfo['type']) => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Hydrate cart from localStorage on mount (client-side only to prevent hydration mismatch)
  useEffect(() => {
    const saved = getFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
    if (Array.isArray(saved)) {
      setItems(saved);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever items change, after initial hydration
  useEffect(() => {
    if (isHydrated) {
      saveToStorage(STORAGE_KEYS.CART, items);
    }
  }, [items, isHydrated]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastInfo['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]); // Keep at most 4 active toasts

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1): { success: boolean; message: string } => {
      if (product.stock <= 0) {
        showToast(`Sorry, "${product.name}" is currently out of stock.`, 'error');
        return { success: false, message: 'Product is out of stock' };
      }

      let addedQty = quantity;
      let finalMsg = '';

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);

        if (existingIndex > -1) {
          const currentQty = prevItems[existingIndex].quantity;
          const maxAvailable = product.stock;

          if (currentQty >= maxAvailable) {
            finalMsg = `Maximum available stock (${maxAvailable}) already in cart.`;
            return prevItems;
          }

          const newQty = Math.min(currentQty + quantity, maxAvailable);
          addedQty = newQty - currentQty;

          finalMsg = addedQty < quantity
            ? `Added ${addedQty} items. Maximum available stock reached.`
            : `Added ${quantity} more "${product.name}" to cart.`;

          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          };
          return updated;
        } else {
          const safeQty = Math.min(quantity, product.stock);
          finalMsg = `Added "${product.name}" to your cart.`;
          return [...prevItems, { product, quantity: safeQty }];
        }
      });

      if (finalMsg.includes('already in cart')) {
        showToast(finalMsg, 'warning');
        return { success: false, message: finalMsg };
      }

      showToast(finalMsg, 'success');
      return { success: true, message: finalMsg };
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number): { success: boolean; message?: string } => {
      let result = { success: true, message: '' };

      setItems((prevItems) => {
        const existing = prevItems.find((item) => item.product.id === productId);
        if (!existing) return prevItems;

        if (quantity <= 0) {
          // Remove from cart
          showToast(`Removed "${existing.product.name}" from cart.`, 'info');
          return prevItems.filter((item) => item.product.id !== productId);
        }

        if (quantity > existing.product.stock) {
          showToast(
            `Cannot add more than ${existing.product.stock} items (available stock).`,
            'warning'
          );
          result = {
            success: false,
            message: `Only ${existing.product.stock} items available in stock`,
          };
          // Set to maximum available stock
          return prevItems.map((item) =>
            item.product.id === productId ? { ...item, quantity: item.product.stock } : item
          );
        }

        return prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      });

      return result;
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prevItems) => {
        const found = prevItems.find((item) => item.product.id === productId);
        if (found) {
          showToast(`Removed "${found.product.name}" from cart.`, 'info');
        }
        return prevItems.filter((item) => item.product.id !== productId);
      });
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const summary = useMemo<CartSummaryData>(() => {
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = itemsCount === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const tax = 0; // Prices are inclusive of GST
    const discount = 0;
    const total = subtotal + shipping;

    return {
      itemsCount,
      subtotal,
      shipping,
      tax,
      discount,
      total,
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        summary,
        toasts,
        removeToast,
        showToast,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
