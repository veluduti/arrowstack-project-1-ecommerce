import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import CartPage from '@/app/cart/page';
import { CartProvider, useCart } from '@/context/CartContext';
import { SAMPLE_PRODUCTS } from '@/data/products';
import { STORAGE_KEYS } from '@/lib/storage';

describe('Shopping Cart and Persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders empty cart state when no items are added', () => {
    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    expect(screen.getByText(/your shopping cart is currently empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore all products/i })).toBeInTheDocument();
  });

  it('adds items, updates quantity, and recalculates totals correctly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    const productA = SAMPLE_PRODUCTS[0]; // AuraSound Pro: ₹8,999
    const productB = SAMPLE_PRODUCTS[3]; // ApexGlide Mouse: ₹1,899

    act(() => {
      result.current.addToCart(productA, 1);
      result.current.addToCart(productB, 2);
    });

    expect(result.current.items.length).toBe(2);
    expect(result.current.summary.itemsCount).toBe(3);

    // Subtotal: 8999 + (1899 * 2) = 8999 + 3798 = 12797
    expect(result.current.summary.subtotal).toBe(12797);
    // Since subtotal > 999, shipping is FREE (0)
    expect(result.current.summary.shipping).toBe(0);
    expect(result.current.summary.total).toBe(12797);

    // Update quantity
    act(() => {
      result.current.updateQuantity(productB.id, 3);
    });

    expect(result.current.summary.itemsCount).toBe(4);
    expect(result.current.summary.subtotal).toBe(8999 + 1899 * 3);

    // Remove product
    act(() => {
      result.current.removeFromCart(productA.id);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product.id).toBe(productB.id);
  });

  it('enforces stock availability boundaries when updating quantity', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    // Pick product with limited stock, e.g. stock: 6 (ChronosLux Watch)
    const limitedProduct = SAMPLE_PRODUCTS.find((p) => p.stock === 6)!;

    act(() => {
      result.current.addToCart(limitedProduct, 1);
    });

    // Attempt to set quantity higher than available stock (e.g., 20)
    act(() => {
      result.current.updateQuantity(limitedProduct.id, 20);
    });

    // Should cap to available stock (6)
    const cartItem = result.current.items.find((i) => i.product.id === limitedProduct.id);
    expect(cartItem?.quantity).toBe(6);
  });

  it('persists cart in localStorage and restores it after page reload simulation', () => {
    const savedInitialItems = [
      {
        product: SAMPLE_PRODUCTS[1], // VoltTrack Smartwatch: ₹4,499
        quantity: 2,
      },
    ];

    // Seed localStorage
    window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(savedInitialItems));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    // Should restore the seeded items from localStorage
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product.id).toBe('prod-elec-02');
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.summary.subtotal).toBe(4499 * 2);
  });
});

