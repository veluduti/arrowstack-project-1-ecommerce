'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Search, Menu, X, ArrowRight, Tag } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { summary, isHydrated } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile navigation drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/products' },
    { name: 'Electronics', href: '/products?category=Electronics' },
    { name: 'Fashion', href: '/products?category=Fashion' },
    { name: 'Home & Kitchen', href: '/products?category=Home%20%26%20Kitchen' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Tag className="w-3.5 h-3.5 text-amber-400" />
        <span>Festive Sale: Free Express Shipping on orders over ₹999! Simulated Demo Store.</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
              aria-label="ShopEase Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Shop<span className="text-blue-600">Ease</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                  Storefront
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors hover:text-blue-600 rounded-md py-1 px-2 focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isActive ? 'text-blue-600 font-bold' : 'text-slate-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center relative max-w-xs xl:max-w-sm w-full"
              role="search"
            >
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                aria-label="Search products"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              {searchQuery && (
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-2 text-blue-600 hover:text-blue-700 p-1 rounded-full focus-visible:ring-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Actions: Cart & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Shopping cart with ${isHydrated ? summary.itemsCount : 0} items`}
              >
                <div className="relative">
                  <ShoppingBag className="w-6 h-6" />
                  {isHydrated && summary.itemsCount > 0 && (
                    <span
                      data-testid="cart-badge-count"
                      className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in"
                    >
                      {summary.itemsCount > 99 ? '99+' : summary.itemsCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline-block text-sm font-semibold">Cart</span>
              </Link>

              {/* Mobile menu toggle button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation-menu"
            className="md:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4"
          >
            <form onSubmit={handleSearchSubmit} className="relative" role="search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search products"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </form>

            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/cart"
                className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between focus-visible:ring-2 focus-visible:ring-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Cart</span>
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {isHydrated ? summary.itemsCount : 0}
                </span>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
