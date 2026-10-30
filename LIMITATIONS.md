# Limitations and Future Roadmap: ShopEase
**Arrowstack Frontend Development Internship — Project 1**

---

## 1. Current Limitations

### 1. Simulated Checkout & Payment Processing
- **Current Behavior**: Checkout is entirely simulated on the client side. No real credit card or UPI payment gateways are integrated.
- **Reason**: Defined in project specifications as a frontend demonstration project to prioritize UX, accessibility, and client-side validation without requiring active merchant accounts or exposing payment secrets.

### 2. Client-Side Product Storage
- **Current Behavior**: Sample products are stored in a static TypeScript file (`src/data/products.ts`). Adding or modifying products requires editing source code rather than using an administrative dashboard.
- **Reason**: Eliminates complex external database dependencies and hosting costs, while guaranteeing 100% deterministic test execution.

### 3. LocalStorage Single-Device Scope
- **Current Behavior**: The shopping cart and recent order history are persisted in browser `localStorage`.
- **Reason**: Cart items do not synchronize across different browsers or devices for the same user without a backend user account system.

### 4. External Image CDN Dependency
- **Current Behavior**: Product imagery uses high-resolution Unsplash photo URLs. While built-in SVG image fallbacks prevent broken UI when offline, image loading speeds depend on network connectivity.

---

## 2. Realistic Future Improvements

1. **Backend API Integration**:
   - Transition sample data into a headless CMS (Sanity / Strapi) or PostgreSQL database queried via Next.js Server Actions or Route Handlers.
2. **User Authentication & Profiles**:
   - Integrate NextAuth.js or Clerk to enable customer login, saved delivery addresses, and persistent order histories across devices.
3. **Real Payment Gateway Integration**:
   - Add Razorpay / Stripe SDK integration with webhook verification for live INR payment processing.
4. **Product Wishlist & Comparison**:
   - Allow users to favorite items and compare technical specifications side-by-side.
5. **Customer Product Reviews Submission**:
   - Provide interactive review submission forms with star rating pickers and photo upload capabilities.
6. **Dark Mode Toggle**:
   - Add Tailwind dark mode class strategy (`dark:`) with system preference detection for night-time shoppers.

