# Testing Documentation: ShopEase Accessible Storefront
**Arrowstack Frontend Development Internship — Project 1**

---

## 1. Automated Testing Suite

- **Test Runner**: Vitest 2.1.9
- **Environment**: jsdom
- **Testing Libraries**: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- **Total Test Files**: 6
- **Total Tests Executed**: 27
- **Passed**: 27 (100%)
- **Failed**: 0
- **Duration**: ~7.44s

### Actual Vitest Output:
```
 RUN  v2.1.9 C:/Users/veluduti venkatesh/OneDrive/Desktop/ShopEase

 ✓ src/__tests__/cart.test.tsx (4 tests) 217ms
   ✓ Shopping Cart and Persistence > renders empty cart state when no items are added
   ✓ Shopping Cart and Persistence > adds items, updates quantity, and recalculates totals correctly
   ✓ Shopping Cart and Persistence > enforces stock availability boundaries when updating quantity
   ✓ Shopping Cart and Persistence > persists cart in localStorage and restores it after page reload simulation

 ✓ src/__tests__/home.test.tsx (1 test) 1004ms
   ✓ Home Page > renders correctly with hero banner, categories, featured, and best sellers

 ✓ src/__tests__/product-detail.test.tsx (2 tests) 1135ms
   ✓ Product Details Page > displays product details correctly including title, price, stock, and specs
   ✓ Product Details Page > allows selecting quantity and adds product to cart with confirmation

 ✓ src/__tests__/edge-cases.test.tsx (11 tests) 1688ms
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > handles invalid product IDs gracefully by displaying an ErrorState
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > handles corrupted localStorage JSON data safely without crashing
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > filters out malformed objects from localStorage data
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > gracefully handles localStorage when storage access throws an exception
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > prevents checkout with an empty cart and renders empty state
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > prevents duplicate double-click submissions on checkout and only creates one order
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > blocks adding out-of-stock products to the cart
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > clamps invalid or negative quantities to safe limits
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > gracefully renders fallback placeholder when product image fails to load
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > correctly calculates tiered shipping charges based on subtotal threshold
   ✓ Arrowstack Project 1: Edge Cases & Resilience Tests > restores cart state and recalculates correct totals after refresh simulation

 ✓ src/__tests__/checkout.test.tsx (3 tests) 1873ms
   ✓ Checkout Form and Validation > rejects an empty form submission and displays field errors
   ✓ Checkout Form and Validation > rejects invalid email, phone, and postal code formats
   ✓ Checkout Form and Validation > accepts valid inputs, generates simulated order ID, and navigates to success page

 ✓ src/__tests__/products.test.tsx (6 tests) 3394ms
   ✓ Products / Shop Page > renders product listing with initial products
   ✓ Products / Shop Page > filters products by search input
   ✓ Products / Shop Page > filters products by category selection
   ✓ Products / Shop Page > filters products by price range
   ✓ Products / Shop Page > sorts products by price low to high and high to low
   ✓ Products / Shop Page > renders empty state when no products match filters and allows clearing filters

 Test Files  6 passed (6)
      Tests  27 passed (27)
```

---

## 2. Automated Test Matrix

| ID | Test Suite | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **AT-01** | `home.test.tsx` | Home page structure & sections | Hero banner, categories, featured, and best sellers render properly | All sections rendered with semantic headings | **PASS** |
| **AT-02** | `products.test.tsx` | Initial product listing | Resolves skeletons and renders full catalog cards | 25+ product cards rendered | **PASS** |
| **AT-03** | `products.test.tsx` | Product search filter | Typing query filters to matching titles and hides non-matches | Filtered to matching products accurately | **PASS** |
| **AT-04** | `products.test.tsx` | Category radio filter | Clicking category shows only products in that category | Filtered to selected category | **PASS** |
| **AT-05** | `products.test.tsx` | Price boundary filter | Setting max price removes products with higher price tags | Only affordable products displayed | **PASS** |
| **AT-06** | `products.test.tsx` | Sorting presets | Price low-to-high arranges items in ascending order | Sorted with lowest price first | **PASS** |
| **AT-07** | `products.test.tsx` | Empty search state & reset | Non-existent search shows friendly message & clear button | Empty state displayed & resets cleanly | **PASS** |
| **AT-08** | `product-detail.test.tsx` | Product specifications | Title, price in ₹, specs table, and ratings render | All specifications rendered | **PASS** |
| **AT-09** | `product-detail.test.tsx` | Quantity & Add to Cart | Stepper increments value, button dispatches cart action | Quantity increments and added feedback shown | **PASS** |
| **AT-10** | `cart.test.tsx` | Empty cart state | Zero items in storage displays empty cart CTA | EmptyState component displayed | **PASS** |
| **AT-11** | `cart.test.tsx` | Add, update quantity, remove | Cart totals calculate line items and summary accurately | Subtotal and total calculated accurately | **PASS** |
| **AT-12** | `cart.test.tsx` | Stock limits enforcement | Requesting more than stock caps item at available stock | Quantity clamped to available inventory | **PASS** |
| **AT-13** | `cart.test.tsx` | LocalStorage hydration | Cart restores saved items upon mount | Restored correctly with SSR hydration protection | **PASS** |
| **AT-14** | `checkout.test.tsx` | Mandatory fields validation | Submitting empty form rejects submission and shows errors | Inline errors displayed for all empty fields | **PASS** |
| **AT-15** | `checkout.test.tsx` | Regex format validation | Invalid email, 3-digit phone, 2-digit PIN rejected | Format-specific error messages displayed | **PASS** |
| **AT-16** | `checkout.test.tsx` | Successful order generation | Valid inputs generate `SE-XXXX-XXXX` order ID | Order created, cart emptied, redirected | **PASS** |
| **AT-17** | `edge-cases.test.tsx` | Invalid product ID route | Non-existent product ID renders ErrorState alert | ErrorState displayed with "Browse Products" link | **PASS** |
| **AT-18** | `edge-cases.test.tsx` | Corrupted LocalStorage JSON | Malformed JSON in storage does not crash CartProvider | Safe fallback to empty array | **PASS** |
| **AT-19** | `edge-cases.test.tsx` | Malformed storage objects | Objects without IDs or negative quantities are purged | Malformed items filtered out safely | **PASS** |
| **AT-20** | `edge-cases.test.tsx` | LocalStorage SecurityError | Storage access exception caught safely | Safe fallback returned without crashing | **PASS** |
| **AT-21** | `edge-cases.test.tsx` | Empty cart checkout block | Directly opening `/checkout` with empty cart blocked | Empty cart state shown, form blocked | **PASS** |
| **AT-22** | `edge-cases.test.tsx` | Double-click prevention | Clicking "Place Order" twice triggers handler only once | Button disabled on submission, 1 order created | **PASS** |
| **AT-23** | `edge-cases.test.tsx` | Out-of-stock items | Items with stock: 0 cannot be added to cart | Add to cart rejected, Sold Out badge shown | **PASS** |
| **AT-24** | `edge-cases.test.tsx` | Invalid quantity handling | Negative numbers clamped to 1, 0 removes, max clamped | Strict mathematical limits enforced | **PASS** |
| **AT-25** | `edge-cases.test.tsx` | Image error fallback | Image `onError` triggers package icon with title | Graceful fallback rendered without broken image | **PASS** |
| **AT-26** | `edge-cases.test.tsx` | Tiered shipping policy | < ₹999 has ₹99 fee; >= ₹999 has ₹0 (FREE) fee | Policy applied dynamically to all subtotals | **PASS** |
| **AT-27** | `edge-cases.test.tsx` | Refresh state restoration | Cart restores exact quantities and totals after reload | Full session continuity verified | **PASS** |

---

## 3. Manual Testing Verification

The complete customer journey was manually tested and verified end-to-end:
```
Home (/) ──► Shop (/products) ──► Search & Filter ──► Details (/products/[id])
  │                                                            │
  └───────────────────────────◄────────────────────────────────┘
                               │
                          Add to Cart
                               │
                               ▼
   Order Success (/order-success) ◄── Checkout (/checkout) ◄── Cart (/cart)
```

### Manual Verification Checklist:
1. **Homepage**:
   - Navigation links (`Home`, `Shop All`, categories) navigate smoothly.
   - Search bar in navbar filters when pressing `Enter` or clicking the search icon.
   - Live badge counter updates immediately when items are added from anywhere in the app.
2. **Product Catalog**:
   - Category selection filters instantly with zero delay.
   - Min and max price sliders update the results count.
   - Sorting by Price Low to High, High to Low, and Alphabetical orders products accurately.
   - Clearing filters restores the full 25+ product list.
3. **Product Detail**:
   - Out of stock items disable the Add to Cart button and display "Currently Out of Stock".
   - Items with stock <= 5 display an amber warning ("Only X left!").
   - Reviews tab shows simulated buyer feedback with verified badges.
4. **Cart & Shipping**:
   - Stepper +/- buttons increment and decrement within bounds.
   - Adding ₹999 or more fills the progress bar and switches delivery fee to **FREE**.
   - Trash icon removes items immediately with an informative toast notification.
5. **Checkout & Validation**:
   - Empty input fields highlight with red borders and show accessible error messages.
   - Entering invalid emails or letters in phone/PIN inputs displays immediate format corrections.
   - Submitting valid details displays the loading spinner and redirects to `/order-success`.
6. **Order Confirmation**:
   - Displays the generated Order ID with a one-click clipboard copy button.
   - Accurately summarizes customer name, address, phone, and purchased item receipt.
   - Shopping cart is confirmed empty after order placement.

---

## 4. Responsive Device Testing

Verified across standard viewport resolutions:

| Viewport | Device Class | Observations & Verification | Status |
|---|---|---|---|
| **375px × 812px** | Mobile (iPhone X / 12 / 13) | Single-column product cards, sticky announcement bar, hamburger drawer with smooth animations, mobile filter slide-over with clean touch targets (min 44px). | **PASS** |
| **768px × 1024px** | Tablet (iPad Mini / Air) | 2-column product grid, 2-column checkout summary, fluid category pills. | **PASS** |
| **1366px × 768px** | Laptop | 3-column product grid, sticky sidebar filters, sticky order summary card. | **PASS** |
| **1920px × 1080px** | Desktop (FHD) | 4-column product grid, spacious typography, constrained max-width containers (`max-w-7xl`). | **PASS** |

No horizontal scrollbars or element collisions were observed at any breakpoint.

---

## 5. Accessibility (a11y) Verification

- **Keyboard-Only Navigation**:
  - `Tab` navigates through every interactive element in sequential DOM order.
  - `Shift + Tab` navigates backwards seamlessly.
  - `Enter` and `Space` activate buttons and toggle dropdowns.
  - `Escape` closes mobile navigation drawer and mobile filter slide-overs.
  - **Skip Link**: `<a href="#main-content">Skip to main content</a>` appears at the top upon initial `Tab` press.
- **Focus Indicators**: Visible blue outline ring (`focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`) on all interactive buttons, links, inputs, and steppers.
- **Screen Reader Semantics**:
  - ARIA attributes: `role="radiogroup"`, `role="radio"`, `aria-checked`, `aria-expanded`, `aria-controls`.
  - ARIA Live Regions: Toasts announced via `role="status"` and `aria-live="polite"`.
  - Form validation errors linked via `aria-describedby` and `aria-invalid="true"`.
- **Contrast Ratios**: Body text (slate-900 on white) exceeds 14:1 (surpassing WCAG AAA 7:1 standard).
