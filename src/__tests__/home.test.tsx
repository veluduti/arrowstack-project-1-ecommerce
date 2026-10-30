import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { CartProvider } from '@/context/CartContext';

describe('Home Page', () => {
  it('renders correctly with hero banner, categories, featured, and best sellers', () => {
    render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );

    // Hero title and CTA
    expect(screen.getByRole('heading', { level: 1, name: /discover quality/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /shop now/i })).toBeInTheDocument();

    // Popular categories heading
    expect(screen.getByRole('heading', { level: 2, name: /popular categories/i })).toBeInTheDocument();

    // Featured products heading
    expect(screen.getByRole('heading', { level: 2, name: /featured products/i })).toBeInTheDocument();

    // Best-selling products heading
    expect(screen.getByRole('heading', { level: 2, name: /best-selling products/i })).toBeInTheDocument();

    // Promotional banner text
    expect(screen.getByText(/upgrade your everyday essentials/i)).toBeInTheDocument();
  });
});

