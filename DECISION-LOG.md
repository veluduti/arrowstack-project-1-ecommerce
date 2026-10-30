# Architectural Decision Log: ShopEase
**Arrowstack Frontend Development Internship — Project 1**

---

## Decision 1: Next.js App Router over Pages Router

- **Context**: Choosing the application routing architecture for the e-commerce storefront.
- **Alternatives Considered**:
  1. Next.js Pages Router
  2. Next.js App Router (Selected)
  3. Single-Page Application with Vite + React Router
- **Reasoning**: Next.js App Router provides superior nested layout support (`layout.tsx`), seamless static site generation (prerendering), dynamic route handling (`/products/[id]`), and built-in Suspense support for URL search parameter streaming. This matches modern enterprise frontend standards.

---

## Decision 2: React Context with Hydration Guard for Cart State

- **Context**: Selecting state management for shopping cart items, persistence, and toast feedback.
- **Alternatives Considered**:
  1. Redux Toolkit
  2. Zustand
  3. Native React Context API with Hydration Protection (Selected)
- **Reasoning**: External state libraries (Redux, Zustand) add bundle overhead and boilerplate for a single-store client app. React Context with a custom `isHydrated` flag provides native React 18 integration, zero third-party dependencies, and completely avoids Next.js SSR hydration mismatch errors when reading from `localStorage`.

---

## Decision 3: React Hook Form + Zod for Client-Side Validation

- **Context**: Choosing form handling and validation mechanism for the checkout experience.
- **Alternatives Considered**:
  1. Plain React state with manual `if...else` checks
  2. Formik + Yup
  3. React Hook Form + Zod (Selected)
- **Reasoning**: React Hook Form uses uncontrolled components with register refs, avoiding unnecessary re-renders upon every keystroke. Pairing it with Zod schemas provides strict TypeScript type inference (`z.infer<typeof checkoutFormSchema>`), clean regex rules for Indian PIN codes (6 digits) and mobile numbers (10 digits), and descriptive localized validation messages.

---

## Decision 4: Vitest & React Testing Library for Automated Testing

- **Context**: Selecting testing framework for unit and integration tests.
- **Alternatives Considered**:
  1. Jest + Babel/ts-jest
  2. Vitest + jsdom (Selected)
  3. Playwright/Cypress exclusively
- **Reasoning**: Vitest executes natively with Vite's esbuild transform, running TypeScript test suites in seconds without complex Babel configuration. Combined with `@testing-library/react`, it enables testing user-centric behavior (accessible names, roles, and visual text) rather than fragile implementation details.

---

## Decision 5: Offline-First System Font Stack over Google Fonts Download

- **Context**: Typography loading strategy for reliable local compilation and test execution.
- **Alternatives Considered**:
  1. `next/font/google` with Inter
  2. Modern System Font Stack via Tailwind (`font-sans`) (Selected)
- **Reasoning**: `next/font/google` attempts to fetch font definitions from Google's servers during `next build`. In corporate firewalls, isolated CI environments, or sandboxed developer setups, external network requests fail with `EACCES` or network timeouts. Using Tailwind's modern sans-serif system font stack (`ui-sans-serif, system-ui, sans-serif`) guarantees 100% offline compilation, zero render-blocking layout shifts (CLS), and top-tier rendering speed.

---

## Decision 6: Multi-Criteria Filtering with React useMemo

- **Context**: Product filtering and sorting strategy for the catalog.
- **Alternatives Considered**:
  1. Server-side query parameter refetching
  2. Client-side state filtering with `useMemo` (Selected)
- **Reasoning**: Since this is a simulated e-commerce frontend with a realistic sample dataset of 25+ items, client-side filtering via `useMemo` provides instantaneous sub-millisecond responsiveness as users type in the search bar or move the price sliders, delivering a superior user experience with zero server roundtrips.
