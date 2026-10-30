import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act, waitFor } from '@testing-library/react';
import ProductDetailPage from '@/app/products/[id]/page';
import CheckoutPage from '@/app/checkout/page';
import { ProductCard } from '@/components/products/ProductCard';
import { CartProvider, useCart } from '@/context/CartContext';
import { SAMPLE_PRODUCTS } from '@/data/products';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';

// Setup mock for navigation
const mockPush = vi.fn();
let currentMockParamId: string = 'prod-elec-01';

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
      replace: vi.fn(),
    }),
    useParams: () => ({ id: currentMockParamId }),
  };
});

describe('Arrowstack Project 1: Edge Cases & Resilience Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockPush.mockClear();
    vi.restoreAllMocks();
    currentMockParamId = 'prod-elec-01';
  });

  // 1. Invalid Product IDs
  it('handles invalid product IDs gracefully by displaying an ErrorState', () => {
    currentMockParamId = 'invalid-prod-9999';

    render(
      <CartProvider>
        <ProductDetailPage />
      </CartProvider>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/we couldn't locate any product with ID "invalid-prod-9999"/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse products/i })).toBeInTheDocument();
  });

  // 2. Corrupted LocalStorage Data
  it('handles corrupted localStorage JSON data safely without crashing', () => {
    // Inject corrupt JSON into storage
    window.localStorage.setItem(STORAGE_KEYS.CART, '{{corrupted_json_string:::invalid');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    // Should safely fallback to empty array
    expect(result.current.items).toEqual([]);
    expect(result.current.summary.itemsCount).toBe(0);
  });

  it('filters out malformed objects from localStorage data', () => {
    // Array with malformed product entries
    const malformedData = [
      { randomKey: 'missing-product-structure' },
      null,
      { product: { id: 'prod-elec-01', price: 8999 }, quantity: -5 }, // negative qty
      { product: { id: 'prod-elec-02', price: 4499 }, quantity: 2 }, // valid
    ];
    window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(malformedData));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    // Only the valid item should be retained
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product.id).toBe('prod-elec-02');
    expect(result.current.items[0].quantity).toBe(2);
  });

  // 3. LocalStorage Unavailable / Security Error
  it('gracefully handles localStorage when storage access throws an exception', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError: The operation is insecure.');
    });
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError: The operation is insecure.');
    });

    // Storage utility functions should catch error and return fallback
    const fallbackValue = [{ test: 'fallback' }];
    const retrieved = getFromStorage('any_key', fallbackValue);
    expect(retrieved).toBe(fallbackValue);

    const saved = saveToStorage('any_key', { data: 'test' });
    expect(saved).toBe(false);

    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
  });

  // 4. Empty Cart Checkout Prevention
  it('prevents checkout with an empty cart and renders empty state', async () => {
    // Explicitly empty localStorage
    window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));

    render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    );

    // Wait for hydration
    await waitFor(() => {
      expect(screen.getByText(/cannot proceed with an empty cart/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /browse products/i })).toBeInTheDocument();
    // Shipping form must not be present
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
  });

  // 5. Double-Click Order Submission Prevention
  it('prevents duplicate double-click submissions on checkout and only creates one order', async () => {
    // Seed cart with an item
    const cartItems = [{ product: SAMPLE_PRODUCTS[0], quantity: 1 }];
    window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));

    render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    // Fill valid data
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Rohan Mehta' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'rohan@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '101 Lotus Residency' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Bengaluru' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'Karnataka' } });
    fireEvent.change(screen.getByLabelText(/pin code/i), { target: { value: '560001' } });

    const submitBtn = screen.getByRole('button', { name: /place order/i });

    // Simulate double click
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    // Button should become disabled during submission
    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });

    await waitFor(
      () => {
        // Navigation should be called exactly once
        expect(mockPush).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 }
    );
  });

  // 6. Out-of-stock Products
  it('blocks adding out-of-stock products to the cart', () => {
    const outOfStockProduct = {
      ...SAMPLE_PRODUCTS[0],
      id: 'out-of-stock-mock',
      stock: 0,
      name: 'Defunct Vintage Radio',
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    let addResult: any;
    act(() => {
      addResult = result.current.addToCart(outOfStockProduct, 1);
    });

    expect(addResult.success).toBe(false);
    expect(result.current.items.length).toBe(0);

    // Verify ProductCard renders Out of Stock badge & disables button
    render(
      <CartProvider>
        <ProductCard product={outOfStockProduct} />
      </CartProvider>
    );

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /defunct vintage radio is out of stock/i });
    expect(btn).toBeDisabled();
  });

  // 7. Invalid Quantity Handling
  it('clamps invalid or negative quantities to safe limits', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = SAMPLE_PRODUCTS[0]; // stock is 18

    // Adding with negative quantity clamps to at least 1
    act(() => {
      result.current.addToCart(product, -5);
    });
    expect(result.current.items[0].quantity).toBe(1);

    // Setting quantity to 0 removes the item
    act(() => {
      result.current.updateQuantity(product.id, 0);
    });
    expect(result.current.items.length).toBe(0);

    // Adding again and setting to extreme quantity clamps to available stock
    act(() => {
      result.current.addToCart(product, 1);
      result.current.updateQuantity(product.id, 99999);
    });
    expect(result.current.items[0].quantity).toBe(product.stock);
  });

  // 8. Product Image Loading Failure Fallback
  it('gracefully renders fallback placeholder when product image fails to load', () => {
    render(
      <CartProvider>
        <ProductCard product={SAMPLE_PRODUCTS[0]} />
      </CartProvider>
    );

    const img = screen.getByAltText(SAMPLE_PRODUCTS[0].name);

    // Simulate image error event
    fireEvent.error(img);

    // Image error state triggers fallback placeholder
    const matches = screen.getAllByText(SAMPLE_PRODUCTS[0].name);
    // One in the fallback placeholder, one in the title link
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  // 9. Shipping Fee Calculations
  it('correctly calculates tiered shipping charges based on subtotal threshold', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    // Empty cart -> 0 shipping
    expect(result.current.summary.shipping).toBe(0);

    // Item priced under ₹999 (e.g. ₹799 Cleanser)
    const cheapProduct = SAMPLE_PRODUCTS.find((p) => p.price < 999)!;
    act(() => {
      result.current.addToCart(cheapProduct, 1);
    });

    expect(result.current.summary.subtotal).toBe(cheapProduct.price);
    // Shipping is ₹99 standard fee
    expect(result.current.summary.shipping).toBe(99);
    expect(result.current.summary.total).toBe(cheapProduct.price + 99);

    // Increase quantity so subtotal exceeds ₹999
    act(() => {
      result.current.updateQuantity(cheapProduct.id, 2);
    });

    expect(result.current.summary.subtotal).toBe(cheapProduct.price * 2);
    // Shipping becomes FREE (0)
    expect(result.current.summary.shipping).toBe(0);
    expect(result.current.summary.total).toBe(cheapProduct.price * 2);
  });

  // 10. Cart Persistence After Refresh
  it('restores cart state and recalculates correct totals after refresh simulation', () => {
    const storedItems = [
      { product: SAMPLE_PRODUCTS[0], quantity: 1 }, // 8999
      { product: SAMPLE_PRODUCTS[3], quantity: 2 }, // 1899 * 2 = 3798
    ];
    window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(storedItems));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.isHydrated).toBe(true);
    expect(result.current.items.length).toBe(2);
    expect(result.current.summary.itemsCount).toBe(3);
    expect(result.current.summary.subtotal).toBe(8999 + 3798);
    expect(result.current.summary.shipping).toBe(0);
  });
});
