import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/common/ToastContainer';

export const metadata: Metadata = {
  title: 'ShopEase – Accessible E-Commerce Storefront',
  description:
    'A high-performance, accessible, responsive e-commerce storefront built with Next.js, TypeScript, and Tailwind CSS for the Arrowstack Frontend Development Internship.',
  keywords: ['e-commerce', 'accessible', 'react', 'nextjs', 'arrowstack', 'internship', 'storefront'],
  authors: [{ name: 'ShopEase Frontend Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans antialiased">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
        {/* Skip to main content link for keyboard users */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <CartProvider>
          <Navbar />
          <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
