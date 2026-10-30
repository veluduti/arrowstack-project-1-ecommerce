import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutPage from '@/app/checkout/page';
import { CartProvider, useCart } from '@/context/CartContext';
import { SAMPLE_PRODUCTS } from '@/data/products';
import { STORAGE_KEYS } from '@/lib/storage';

const mockPush = vi.fn();

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
      replace: vi.fn(),
    }),
  };
});

describe('Checkout Form and Validation', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockPush.mockClear();
  });

  it('rejects an empty form submission and displays field errors', async () => {
    // Seed cart with an item so checkout form is visible
    const initialItems = [{ product: SAMPLE_PRODUCTS[0], quantity: 1 }];
    window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(initialItems));

    render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    );

    // Wait for hydration
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /shipping information/i })).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitBtn);

    // Should display validation errors
    await waitFor(() => {
      expect(screen.getByText(/full name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/street address must be at least 5 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/postal code is required/i)).toBeInTheDocument();
    });
  });

  it('rejects invalid email, phone, and postal code formats', async () => {
    const initialItems = [{ product: SAMPLE_PRODUCTS[0], quantity: 1 }];
    window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(initialItems));

    render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /shipping information/i })).toBeInTheDocument();
    });

    // Fill invalid data
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Rahul Sharma' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid-email-format' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123' } }); // invalid phone
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '123 Tech Park Road' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Hyderabad' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'Telangana' } });
    fireEvent.change(screen.getByLabelText(/pin code/i), { target: { value: '99' } }); // invalid 2-digit PIN

    const submitBtn = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid 10-digit mobile number/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid 6-digit postal pin code/i)).toBeInTheDocument();
    });
  });

  it('accepts valid inputs, generates simulated order ID, and navigates to success page', async () => {
    const initialItems = [{ product: SAMPLE_PRODUCTS[0], quantity: 1 }];
    window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(initialItems));

    render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /shipping information/i })).toBeInTheDocument();
    });

    // Fill valid data
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Siddharth Rao' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'siddharth@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: 'Flat 402, Green Meadows, HITEC City' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Hyderabad' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'Telangana' } });
    fireEvent.change(screen.getByLabelText(/pin code/i), { target: { value: '500081' } });

    const submitBtn = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/order-success?orderId=SE-'));
      },
      { timeout: 3000 }
    );

    // Verify order was saved to localStorage
    const savedOrder = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.LAST_ORDER) || '{}');
    expect(savedOrder.id).toMatch(/^SE-/);
    expect(savedOrder.customer.fullName).toBe('Siddharth Rao');
    expect(savedOrder.customer.city).toBe('Hyderabad');
  });
});
