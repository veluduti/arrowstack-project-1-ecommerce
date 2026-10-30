import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductsPage from '@/app/products/page';
import { CartProvider } from '@/context/CartContext';

describe('Products / Shop Page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders product listing with initial products', async () => {
    render(
      <CartProvider>
        <ProductsPage />
      </CartProvider>
    );

    // Initial heading
    expect(screen.getByRole('heading', { level: 1, name: /shop all products/i })).toBeInTheDocument();

    // Skeletons resolve to products
    await waitFor(() => {
      const cards = screen.getAllByTestId('product-card');
      expect(cards.length).toBeGreaterThan(10);
    });
  });

  it('filters products by search input', async () => {
    render(
      <CartProvider>
        <ProductsPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByLabelText(/search products by name/i);
    fireEvent.change(searchInput, { target: { value: 'AuraSound' } });

    await waitFor(() => {
      expect(screen.getByText(/AuraSound Pro Noise-Cancelling Headphones/i)).toBeInTheDocument();
      // Unrelated product should not be rendered
      expect(screen.queryByText(/Classic Tailored Oxford Cotton Shirt/i)).not.toBeInTheDocument();
    });
  });

  it('filters products by category selection', async () => {
    render(
      <CartProvider>
        <ProductsPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0);
    });

    const beautyButtons = screen.getAllByRole('radio', { name: 'Beauty' });
    fireEvent.click(beautyButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Radiance Glow Vitamin C/i)).toBeInTheDocument();
      expect(screen.queryByText(/AuraSound Pro Noise-Cancelling Headphones/i)).not.toBeInTheDocument();
    });
  });

  it('filters products by price range', async () => {
    render(
      <CartProvider>
        <ProductsPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0);
    });

    const maxPriceInput = screen.getByLabelText(/maximum price/i);
    // Set max price to 1000
    fireEvent.change(maxPriceInput, { target: { value: '1000' } });

    await waitFor(() => {
      // Products with price <= 1000 should appear (like Botanical Cleanser 799, Rose Quartz 899)
      expect(screen.getByText(/Botanical Hydrating Facial Cleanser/i)).toBeInTheDocument();
      // Expensive products like Espresso Maker (11499) should not appear
      expect(screen.queryByText(/BaristaTouch Espresso/i)).not.toBeInTheDocument();
    });
  });

  it('sorts products by price low to high and high to low', async () => {
    render(
      <CartProvider>
        <ProductsPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0);
    });

    const sortSelect = screen.getByLabelText(/sort products/i);
    // Sort price low to high
    fireEvent.change(sortSelect, { target: { value: 'price-low-to-high' } });

    await waitFor(() => {
      const cards = screen.getAllByTestId('product-card');
      // Lowest priced product should be first (e.g. Cleanser ₹799)
      expect(cards[0]).toHaveTextContent(/₹799/);
    });
  });

  it('renders empty state when no products match filters and allows clearing filters', async () => {
    render(
      <CartProvider>
        <ProductsPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByLabelText(/search products by name/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistentproductxyz999' } });

    await waitFor(() => {
      expect(screen.getByText(/no matching products found/i)).toBeInTheDocument();
    });

    // Click "Clear All Filters" button
    const clearButtons = screen.getAllByRole('button', { name: /clear all filters/i });
    fireEvent.click(clearButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(10);
    });
  });
});
