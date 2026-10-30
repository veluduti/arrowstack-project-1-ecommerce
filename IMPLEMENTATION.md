# Implementation Guide: ShopEase Accessible E-Commerce Storefront
**Arrowstack Frontend Development Internship — Project 1**

---

## 1. Architectural Overview

ShopEase follows a modern, component-driven client architecture powered by **Next.js 14 App Router**, **React 18**, and **TypeScript**. State management is partitioned into two tiers:
1. **Global Cart & Feedback State**: Handled by a custom React Context (`CartContext`) backed by a fault-tolerant `localStorage` persistence layer.
2. **Local Component & URL State**: Filter and search queries are synchronized with URL search parameters (`useSearchParams`), allowing deep-linking and bookmarkable search results while maintaining instantaneous client-side interactivity.

```
                              ┌─────────────────────────┐
                              │    Next.js App Router   │
                              │       Root Layout       │
                              └────────────┬────────────┘
                                           │
                         ┌─────────────────┴─────────────────┐
                         ▼                                   ▼
               ┌──────────────────┐                ┌──────────────────┐
               │   CartProvider   │                │  ToastContainer  │
               │ (Context State)  │                │  (ARIA Live Reg) │
               └─────────┬────────┘                └──────────────────┘
                         │
      ┌──────────────────┼──────────────────┬──────────────────┐
      ▼                  ▼                  ▼                  ▼
┌───────────┐      ┌───────────┐      ┌───────────┐      ┌───────────┐
│ Home Page │      │ Shop Page │      │  Details  │      │ Cart/Flow │
│  (Hero,   │      │(Multi-fac.│      │  (Specs,  │      │(Checkout, │
│Featured)  │      │ Filtering)│      │ Reviews)  │      │ Success)  │
└───────────┘      └───────────┘      └───────────┘      └───────────┘
```

---

## 2. Component Hierarchy and Responsibility

### A. Layout Components (`src/components/layout/`)
- **`Navbar.tsx`**: Contains the brand identity, desktop navigation links, integrated search bar, mobile navigation drawer, and an animated shopping bag button displaying the live badge count.
- **`Footer.tsx`**: Provides customer trust points (Free Shipping, 7-Day Returns, 100% Genuine, 24/7 Support), newsletter subscription form with simulated instant confirmation, category links, and payment method badges.

### B. Product Components (`src/components/products/`)
- **`ProductCard.tsx`**: Renders individual product information:
  - Responsive image with graceful fallback (`imageError` state) preventing broken image icons.
  - Calculated discount badge and stock status warning (Out of Stock / Low Stock).
  - Indian Rupee (`₹`) price formatting using `Intl.NumberFormat('en-IN')`.
  - Star rating with simulated review count.
  - Interactive "Details" link and accessible "Add to Cart" button with immediate feedback.
- **`ProductGrid.tsx`**: A responsive CSS grid container (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`).
- **`ProductFilters.tsx`**: Handles category selection pills, min/max price inputs with live boundary clamping, sorting preset dropdown, and responsive mobile filter drawer.

### C. Cart Components (`src/components/cart/`)
- **`CartItemRow.tsx`**: Renders cart items with quantity adjustment controls, line item price calculation, and removal trigger.
- **`CartSummaryCard.tsx`**: Calculates subtotal, shipping fee logic, dynamic free shipping milestone progress bar, and checkout CTA.

### D. Checkout Components (`src/components/checkout/`)
- **`CheckoutForm.tsx`**: A validated shipping form built with `react-hook-form` and `@hookform/resolvers/zod`. Includes demo disclaimer banner, double-click protection, and automatic order creation.

### E. Common / Shared Components (`src/components/common/`)
- **`QuantitySelector.tsx`**: Accessible +/- numeric stepper with input bounds (`1` to `stock`), manual text input parsing, and keyboard navigation.
- **`ToastContainer.tsx`**: Accessible toast notification banner manager using `role="status"` and `aria-live="polite"`.
- **`EmptyState.tsx`**: Reusable empty state with icon, title, description, and action button.
- **`LoadingSkeleton.tsx`**: Tailwind-animated pulse skeletons for cards and detail views.
- **`ErrorState.tsx`**: Error presentation with retry actions.

---

## 3. Data Structure

All product models and categories are strongly typed in `src/types/product.ts`:

```typescript
export type ProductCategory =
  | 'Electronics'
  | 'Fashion'
  | 'Home & Kitchen'
  | 'Accessories'
  | 'Beauty';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;              // in INR (₹)
  originalPrice?: number;     // for discount calculation
  discountPercentage?: number;
  image: string;
  rating: number;             // 0.0 to 5.0
  reviewCount: number;
  stock: number;              // available inventory
  popularity: number;         // sorting metric
  featured?: boolean;
  bestSeller?: boolean;
  brand?: string;
  specs?: Record<string, string>;
}
```

The catalog (`src/data/products.ts`) contains 25+ diverse, realistic items across all 5 categories.

---

## 4. Shopping Cart & Inventory Logic

The shopping cart implementation (`src/context/CartContext.tsx`) enforces strict business constraints:

1. **Stock Boundary Clamping**:
   - When adding an item, if `currentQuantity + requestedQuantity > product.stock`, the item is capped at `product.stock`, and a warning toast is dispatched.
   - If `product.stock === 0`, adding to cart is blocked entirely.
2. **Quantity Bounds**:
   - Decrementing below `1` removes the item from the cart.
   - Incrementing past available stock is disabled and clamped.
3. **Shipping Calculation**:
   - Orders above ₹999 qualify for **Free Express Shipping** (`₹0`).
   - Orders below ₹999 incur a standard fee of `₹99`.
   - Empty cart has `₹0` shipping.
4. **Toast Feedback**:
   - Adding, modifying, or removing items dispatches non-blocking notifications auto-dismissed after 3.5 seconds.

---

## 5. Filtering and Searching Engine

In `src/app/products/page.tsx`, filtering runs reactively via `useMemo`:

```typescript
const filteredProducts = useMemo(() => {
  return SAMPLE_PRODUCTS.filter((product) => {
    // 1. Text Search across Name, Description, Brand, and Category
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      const matches =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query);
      if (!matches) return false;
    }

    // 2. Category Filter
    if (category !== 'All' && product.category !== category) {
      return false;
    }

    // 3. Price Filter Bounds
    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // 4. Sorting Presets
    switch (sortBy) {
      case 'price-low-to-high': return a.price - b.price;
      case 'price-high-to-low': return b.price - a.price;
      case 'alphabetical': return a.name.localeCompare(b.name);
      case 'rating': return b.rating - a.rating;
      case 'popularity': default: return b.popularity - a.popularity;
    }
  });
}, [search, category, minPrice, maxPrice, sortBy]);
```

---

## 6. Form Validation Engine

Form validation is handled through **Zod** (`src/lib/validation.ts`) and **React Hook Form**:

```typescript
export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters.')
    .max(60)
    .regex(/^[a-zA-Z\s.]+$/, 'Full name should only contain letters, spaces, and periods.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address (e.g., alex@example.com).'),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number starting with 6-9.'),
  address: z
    .string()
    .trim()
    .min(5, 'Street address must be at least 5 characters.'),
  city: z.string().trim().min(2, 'City must be at least 2 characters.'),
  state: z.string().trim().min(2, 'Please specify your state/province.'),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Please enter a valid 6-digit postal PIN code (e.g., 500081).'),
});
```

All fields feature `aria-invalid` and `aria-describedby` bound directly to error message elements for accessibility.

---

## 7. LocalStorage Resilience & SSR Hydration

Direct access to `window.localStorage` in Next.js causes hydration mismatch warnings if server-rendered HTML diverges from client storage. ShopEase solves this with two mechanisms:

1. **Hydration Guard Pattern**:
   ```typescript
   const [isHydrated, setIsHydrated] = useState(false);
   useEffect(() => {
     const saved = getFromStorage(STORAGE_KEYS.CART, []);
     setItems(saved);
     setIsHydrated(true);
   }, []);
   ```
   UI elements depending on local storage (such as the navbar badge and cart list) only render after `isHydrated` is `true`.
2. **Safe Storage Wrapper (`src/lib/storage.ts`)**:
   `getFromStorage` and `saveToStorage` wrap all browser storage calls in `try...catch` blocks to protect against Private Browsing restrictions, quota exceeded errors, or malformed JSON.

---

## 8. Accessibility (a11y) Implementation

- **Keyboard Focus Management**: Configured in `globals.css` with `:focus-visible { @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background; }`.
- **Skip Link**: `<a href="#main-content" className="skip-to-content">` positioned offscreen and animated into view upon initial Tab press.
- **ARIA Semantics**:
  - `role="radiogroup"` and `role="radio"` with `aria-checked` for category selection.
  - `aria-live="polite"` and `role="status"` for non-disruptive toast alerts.
  - Explicit `aria-label` tags for all icon-only buttons (cart count, quantity steppers, dismiss buttons).
- **Graceful Image Fallbacks**: Built-in SVG package fallback when external CDN images fail to load or are blocked.

---

## 9. Performance Considerations

- **Next.js Production Prerendering**: 7 of 8 pages are statically pre-rendered (`○ Static`), ensuring instant TTFB (Time to First Byte).
- **Zero Heavy Runtime Libraries**: Clean native React state without Redux or external state engines.
- **Next/Image Optimization**: High-resolution imagery configured with responsive `sizes` attributes for minimal mobile data usage.
- **Offline Font Stack**: Utilizes modern system font fallback (`font-sans`), eliminating blocking third-party web font downloads.

