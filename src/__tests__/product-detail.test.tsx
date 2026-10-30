import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetailPage from '@/app/products/[id]/page';
import { CartProvider } from '@/context/CartContext';

// Mock params to return a valid product id
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useParams: () => ({ id: 'prod-elec-01' }),
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  };
});

describe('Product Details Page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('displays product details correctly including title, price, stock, and specs', () => {
    render(
      <CartProvider>
        <ProductDetailPage />
      </CartProvider>
    );

    // Product Title
    expect(screen.getByRole('heading', { level: 1, name: /AuraSound Pro Noise-Cancelling Headphones/i })).toBeInTheDocument();

    // Price
    expect(screen.getByText(/₹8,999/)).toBeInTheDocument();

    // In stock indicator
    expect(screen.getByText(/in stock/i)).toBeInTheDocument();

    // Overview & Specifications
    expect(screen.getByRole('heading', { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /specifications/i })).toBeInTheDocument();
    expect(screen.getByText(/45 Hours/i)).toBeInTheDocument();
  });

  it('allows selecting quantity and adds product to cart with confirmation', () => {
    render(
      <CartProvider>
        <ProductDetailPage />
      </CartProvider>
    );

    // Increase quantity using the increment button
    const increaseBtn = screen.getByLabelText(/increase quantity/i);
    fireEvent.click(increaseBtn);

    const qtyInput = screen.getByRole('spinbutton', { name: /quantity of AuraSound Pro/i }) as HTMLInputElement;
    expect(qtyInput.value).toBe('2');

    // Click Add to Shopping Cart button
    const addToCartBtn = screen.getByRole('button', { name: /add to shopping cart/i });
    fireEvent.click(addToCartBtn);

    // Button updates state to "Added to Cart!"
    expect(screen.getByText(/added to cart!/i)).toBeInTheDocument();
  });
});
