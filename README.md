# ShopEase – Accessible E-Commerce Storefront
**Arrowstack Frontend Development Internship — Project 1**

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black)
![React 18](https://img.shields.io/badge/React-18.3-cyan)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)
![Tests: Vitest](https://img.shields.io/badge/Tests-27%2F27%20Passing-emerald)
![A11y: WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-blue)

ShopEase is a commercial-grade, accessible, and fully responsive e-commerce storefront built from scratch for the **Arrowstack Frontend Development Internship**. The application enables users to discover curated products across multiple lifestyle categories, perform real-time multi-facet searching and filtering, inspect comprehensive product specifications, manage shopping cart quantities with strict stock boundary protection, and execute simulated checkout flows with client-side form validation.

---

## 🌟 Key Features

- **Responsive Commercial UI/UX**: Crafted with a clean aesthetic, subtle elevation shadows, smooth micro-interactions, and mobile-first responsiveness (Desktop, Laptop, Tablet, Mobile).
- **Comprehensive Product Catalog**: 25+ realistic products across 5 primary categories (Electronics, Fashion, Home & Kitchen, Accessories, Beauty) with Indian Rupee (₹) pricing, realistic ratings, and stock tracking.
- **Dynamic Search & Multi-Faceted Filters**: Real-time keyword search, category switching, min/max price range sliders, and multiple sorting presets (popularity, price low-to-high, price high-to-low, alphabetical, rating).
- **Rich Product Detail Pages (`/products/[id]`)**: Deep-dive product views with responsive image zoom/fallback, live stock status indicators, customer reviews breakdown, and related category products.
- **Robust Shopping Cart System**:
  - Live navbar item counter badge.
  - Increment/decrement quantity controls with strict stock boundary clamping.
  - Automatic calculation of subtotal, tiered free delivery threshold (Free above ₹999), and final total.
  - Resilient `localStorage` persistence with SSR hydration safeguards and corrupted JSON recovery.
  - Animated toast notifications on cart updates with screen reader live regions.
- **Simulated Checkout with Zod Validation (`/checkout`)**:
  - Validated shipping address form powered by React Hook Form and Zod schemas.
  - Full Name, Email, 10-digit Indian Mobile, Street Address, City, State, and 6-digit PIN Code validation.
  - Double-click submission prevention and realistic processing feedback.
  - Empty cart guard preventing orders without items.
- **Order Success Page (`/order-success`)**:
  - Generates unique order identifier (e.g. `SE-XXXX-XXXX`).
  - Summarizes purchased products, total paid, and shipping recipient details.
  - Automatic cart cleanup after confirmed orders.
  - One-click order ID copy button.
- **Full State Handling**: Dedicated Loading Skeletons, Empty States (empty cart, no matching search/filters), Error States with retry mechanisms, and Success banners.
- **Accessibility (a11y) First**:
  - Semantic HTML elements (`<header>`, `<main>`, `<nav>`, `<aside>`, `<article>`, `<footer>`).
  - Skip-to-main-content keyboard bypass link.
  - Complete keyboard navigation with `Escape` dismiss for drawers and dialogs.
  - Explicit `aria-label`, `role`, `aria-checked`, and `aria-live` regions for toasts.
  - High-contrast visual focus rings for all interactive elements.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server-side rendering, file-based routing, client components |
| **Language** | TypeScript 5.6 | Strict static typing, custom interfaces, compile-time safety |
| **Styling** | Tailwind CSS 3.4 + PostCSS | Utility-first CSS, modern design system, responsive breakpoints |
| **Icons** | Lucide React | Clean, lightweight SVG iconography |
| **Forms** | React Hook Form | High-performance uncontrolled form state management |
| **Validation** | Zod + Hookform Resolvers | Type-safe schema validation and error messaging |
| **Persistence** | LocalStorage API | Client-side cart and order persistence with SSR fallback |
| **Testing** | Vitest 2.1 + Testing Library | Fast unit and integration tests with jsdom environment |

---

## 📋 Prerequisites

Before getting started, make sure you have:
- **Node.js**: v18.17.0 or newer (tested on Node v24.x)
- **npm**: v9.0.0 or newer

---

## 🚀 Installation and Setup

1. **Clone or open the project directory**:
   ```bash
   cd ShopEase
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run TypeScript type checking**:
   ```bash
   npx tsc --noEmit
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Start production server**:
   ```bash
   npm start
   ```

---

## 🧪 Running Automated Tests

ShopEase includes 27 comprehensive automated tests across 6 test suites covering core functionality and edge cases:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Suite Summary (27/27 Passing):
- `home.test.tsx`: Hero banner, category highlights, featured products, and trust badges rendering.
- `products.test.tsx`: Catalog rendering, real-time search, category filtering, price bounds, sorting, and empty states.
- `product-detail.test.tsx`: Individual product rendering, specifications, stock checks, and cart integration.
- `cart.test.tsx`: Cart actions, quantity updates, stock cap enforcement, totals calculation, and `localStorage` persistence.
- `checkout.test.tsx`: Zod form validation, rejection of invalid inputs, and order ID generation.
- `edge-cases.test.tsx`: Invalid product IDs, corrupted LocalStorage data, SecurityError handling, double-click order prevention, out-of-stock items, negative quantities, image load failure fallback, tiered shipping calculation, and refresh state restoration.

---

## 📁 Project Folder Structure

```
ShopEase/
├── public/                     # Static assets and public images
├── screenshots/                # Real screenshots captured from running app
│   ├── 01-homepage.png
│   ├── 02-products-listing.png
│   ├── 03-product-details.png
│   ├── 04-shopping-cart.png
│   ├── 05-checkout.png
│   ├── 06-order-success.png
│   ├── 07-mobile-homepage.png
│   ├── 08-mobile-products-page.png
│   ├── 09-mobile-cart.png
│   └── 10-mobile-checkout.png
├── scripts/
│   └── capture-screenshots.js  # Automated real screenshot capture tool
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── cart/               # /cart - Shopping cart page
│   │   ├── checkout/           # /checkout - Checkout form & summary
│   │   ├── order-success/      # /order-success - Order confirmation page
│   │   ├── products/           # /products - Shop catalog & search/filter
│   │   │   └── [id]/           # /products/[id] - Product detail page
│   │   ├── globals.css         # Global Tailwind styles & a11y focus rings
│   │   ├── layout.tsx          # Root layout with CartProvider & ToastContainer
│   │   └── page.tsx            # / - Homepage (Hero, Categories, Best-sellers)
│   ├── components/             # Reusable UI component architecture
│   │   ├── cart/               # CartItemRow, CartSummaryCard
│   │   ├── checkout/           # CheckoutForm
│   │   ├── common/             # ToastContainer, EmptyState, LoadingSkeleton, ErrorState, QuantitySelector
│   │   ├── layout/             # Navbar, Footer
│   │   └── products/           # ProductCard, ProductGrid, ProductFilters
│   ├── context/                # CartContext (State, Cart Reducers, Toasts, Persistence)
│   ├── data/                   # products.ts (25+ sample products with images & specs)
│   ├── lib/                    # Utilities: utils.ts, storage.ts, validation.ts
│   ├── types/                  # TypeScript interfaces: product.ts, cart.ts, order.ts
│   └── __tests__/              # 6 Vitest test suites (27 automated tests)
├── DECISION-LOG.md             # Architecture & design decisions
├── IMPLEMENTATION.md           # Deep dive into components and logic
├── LIMITATIONS.md              # Current limitations & future enhancements
├── PROJECT-1-SUBMISSION.md     # Final Internship submission summary report
├── REQUIREMENTS.md             # Project requirements and acceptance checklist
├── TESTING.md                  # Complete test cases, actual results, checklists
├── next.config.js              # Next.js image domain configuration
├── tailwind.config.ts          # Tailwind color tokens and theme setup
├── tsconfig.json               # TypeScript path alias (@/*) and options
├── vitest.config.ts            # Vitest configuration
└── vitest.setup.ts             # Testing setup & Next.js mocks
```

---

## 🗺️ Application Routes

| Path | Purpose | Key Functionality |
|---|---|---|
| `/` | Home Page | Hero banner, popular category cards, featured items, deals |
| `/products` | Shop Catalog | Search, filter by category/price, sort, product count, empty state |
| `/products/[id]` | Product Details | High-res imagery, specs table, verified reviews, quantity picker, add to cart |
| `/cart` | Shopping Cart | Line items, stock boundary enforcement, delivery progress bar, subtotal |
| `/checkout` | Checkout Form | Zod-validated shipping form, demo disclaimer, order placement |
| `/order-success` | Order Confirmation | Generated order ID, customer details, purchased items receipt |

---

## 📦 Assumed Shipping Policy & Product Data

- **Currency**: All prices are specified in Indian Rupees (₹).
- **Free Delivery Policy**: Orders with subtotal **₹999 or higher** qualify for Free Express Shipping. Orders below ₹999 are charged a flat standard shipping fee of **₹99**. An empty cart has ₹0 shipping.
- **Taxes**: All prices are inclusive of applicable GST.
- **Simulated Reviews**: Product detail pages include simulated verified customer ratings, comments, and purchase timestamps.
- **Simulated Checkout**: All payments are simulated in demo mode and persist to local storage without real financial charges.
