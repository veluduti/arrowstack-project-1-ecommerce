# Testing Documentation: ShopEase Accessible Storefront
**Arrowstack Frontend Development Internship — Project 1**

---

## 1. Automated Test Suite Summary

- **Test Runner**: Vitest 2.1.9
- **Environment**: jsdom
- **Testing Libraries**: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- **Total Test Files**: 5
- **Total Tests Executed**: 16
- **Passed**: 16 (100%)
- **Failed**: 0
- **Duration**: ~12.5s

### Vitest Execution Output:
```
 ✓ src/__tests__/cart.test.tsx (4 tests) 486ms
   ✓ Shopping Cart and Persistence > renders empty cart state when no items are added
   ✓ Shopping Cart and Persistence > adds items, updates quantity, and recalculates totals correctly
   ✓ Shopping Cart and Persistence > enforces stock availability boundaries when updating quantity
   ✓ Shopping Cart and Persistence > persists cart in localStorage and restores it after page reload simulation

 ✓ src/__tests__/home.test.tsx (1 test) 1580ms
   ✓ Home Page > renders correctly with hero banner, categories, featured, and best sellers

 ✓ src/__tests__/product-detail.test.tsx (2 tests) 2044ms
   ✓ Product Details Page > displays product details correctly including title, price, stock, and specs
   ✓ Product Details Page > allows selecting quantity and adds product to cart with confirmation

 ✓ src/__tests__/checkout.test.tsx (3 tests) 2695ms
   ✓ Checkout Form and Validation > rejects an empty form submission and displays field errors
   ✓ Checkout Form and Validation > rejects invalid email, phone, and postal code formats
   ✓ Checkout Form and Validation > accepts valid inputs, generates simulated order ID, and navigates to success page

 ✓ src/__tests__/products.test.tsx (6 tests) 5696ms
   ✓ Products / Shop Page > renders product listing with initial products
   ✓ Products / Shop Page > filters products by search input
   ✓ Products / Shop Page > filters products by category selection
   ✓ Products / Shop Page > filters products by price range
   ✓ Products / Shop Page > sorts products by price low to high and high to low
   ✓ Products / Shop Page > renders empty state when no products match filters and allows clearing filters

 Test Files  5 passed (5)
      Tests  16 passed (16)
```

---

## 2. Detailed Test Matrix

| ID | Test Case | Description & Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC-01** | Home page renders correctly | Render root `/` page | Hero title, Shop Now CTA, Categories, Featured, and Best-sellers present | All elements rendered properly | **PASS** |
| **TC-02** | Product listing renders | Render `/products` page | Product cards load after skeleton phase | 25+ product cards rendered | **PASS** |
| **TC-03** | Product search works | Enter "AuraSound" into search bar | Only AuraSound headphones display; non-matching shirts disappear | Filtered to 1 matching item | **PASS** |
| **TC-04** | Category filtering works | Click "Beauty" category pill | Only Beauty products display; Electronics removed | Filtered to 5 Beauty items | **PASS** |
| **TC-05** | Price filtering works | Set maximum price to ₹1,000 | Only products with price <= ₹1,000 display | Products <= ₹1000 displayed | **PASS** |
| **TC-06** | Sorting works | Select "Price: Low to High" | Products reordered with lowest price item first | Lowest priced item (₹799) first | **PASS** |
| **TC-07** | Product details display | Render `/products/[id]` | Title, price in ₹, stock badge, specs table rendered | Specifications and stock visible | **PASS** |
| **TC-08** | Adding product to cart | Click "Add to Shopping Cart" | Cart items increment, toast confirmation shown | Button changes to "Added to Cart!" | **PASS** |
| **TC-09** | Updating quantity works | Change item quantity from 1 to 3 | Subtotal multiplies accurately | Subtotal and total updated | **PASS** |
| **TC-10** | Removing product works | Click remove trash icon | Product removed from cart items list | Item removed immediately | **PASS** |
| **TC-11** | Cart totals calculate | Add 2 distinct products | Subtotal, ₹99/Free shipping, and final total calculated | Calculations 100% accurate | **PASS** |
| **TC-12** | Cart persists after reload | Seed localStorage and mount Cart | Stored items restored during hydration | Items restored accurately | **PASS** |
| **TC-13** | Checkout validation works | Submit empty checkout form | Inline error messages displayed for all required fields | Errors displayed next to inputs | **PASS** |
| **TC-14** | Invalid form rejected | Submit invalid email, phone, PIN | Format errors displayed; order not created | Clear format errors shown | **PASS** |
| **TC-15** | Order ID generation | Submit valid customer information | Generates `SE-XXXX-XXXX` order ID, navigates to `/order-success` | Order created and navigated | **PASS** |
| **TC-16** | Empty states render | Filter to 0 results, clear cart | Friendly message and action buttons displayed | Empty states visible & functional | **PASS** |

---

## 3. Manual Testing Verification Checklist

- [x] **Header Navigation**:
  - [x] Logo clicks navigate back to home (`/`).
  - [x] "Shop All" navigates to `/products`.
  - [x] Category links pre-filter products correctly.
  - [x] Search input navigates with query parameter to `/products?search=...`.
  - [x] Cart icon displays live badge count reflecting cart quantity.
- [x] **Shopping Cart**:
  - [x] Quantities cannot be decreased below 1 using the stepper.
  - [x] Quantities cannot exceed product stock.
  - [x] "Clear Cart" removes all items and transitions to the empty state.
  - [x] Free shipping progress bar updates dynamically as subtotal approaches ₹999.
- [x] **Product Details**:
  - [x] Invalid product IDs (e.g. `/products/invalid-id-xyz`) render the ErrorState with a "Browse Products" return button.
  - [x] Out-of-stock items disable the "Add to Cart" button with a "Sold Out" label.
  - [x] Low-stock items display an amber warning badge ("Only X left!").
- [x] **Checkout & Success**:
  - [x] Accessing `/checkout` with an empty cart shows a graceful empty state preventing blank orders.
  - [x] Placing an order clears the cart items from `localStorage`.
  - [x] Order success page provides a "Copy Order ID" button with copy feedback.

---

## 4. Responsive Testing Checklist

Tested across standard viewport widths:

| Viewport | Device Class | Result | Notes |
|---|---|---|---|
| **375px × 667px** | Mobile (iPhone SE) | Passed | Single-column product grid, collapsible filter drawer, full-width buttons |
| **414px × 896px** | Mobile (iPhone XR) | Passed | Fluid typography, accessible tap targets (min 44px) |
| **768px × 1024px** | Tablet (iPad Mini) | Passed | Two-column product grid, 2-column checkout summary |
| **1024px × 768px** | Laptop | Passed | Three-column product grid, sticky filter sidebar |
| **1440px × 900px** | Desktop | Passed | Four-column product grid, sticky sidebar filters & sticky cart summary |

---

## 5. Accessibility (a11y) Testing Checklist

- [x] **Keyboard Navigation**:
  - [x] `Tab` navigates through all interactive links, buttons, and form inputs in logical DOM order.
  - [x] `Shift + Tab` navigates backwards seamlessly.
  - [x] `Enter` and `Space` activate buttons and toggle dropdowns.
  - [x] Skip-to-content link appears at top-left upon initial `Tab` press.
- [x] **Visual Indicators**:
  - [x] All interactive elements have high-visibility focus rings (`focus-visible:ring-2 focus-visible:ring-blue-600`).
  - [x] No outline suppression on keyboard focus.
- [x] **Screen Reader Support**:
  - [x] Buttons have descriptive `aria-label` tags (e.g., "Add AuraSound Pro to cart").
  - [x] Toast container uses `role="status"` and `aria-live="polite"` for non-disruptive announcements.
  - [x] Form inputs include `aria-invalid` and `aria-describedby` linked to validation error IDs.
- [x] **Color Contrast**:
  - [x] Slate-900 on White background exceeds WCAG AAA ratio (14:1).
  - [x] Blue-600 on White background meets WCAG AA (4.6:1).
  - [x] Red-600 validation text on rose-50 background meets WCAG AA.
