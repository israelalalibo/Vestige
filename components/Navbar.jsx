'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-vestige-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-px bg-vestige-black transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-px bg-vestige-black transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-px bg-vestige-black transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-10">
              <Link href="/products" className="text-xs tracking-widest uppercase hover:text-vestige-accent transition-colors">
                Shop
              </Link>
              <Link href="/products?category=New+Arrivals" className="text-xs tracking-widest uppercase hover:text-vestige-accent transition-colors">
                New Arrivals
              </Link>
              <Link href="/products?category=Sale" className="text-xs tracking-widest uppercase hover:text-vestige-accent transition-colors">
                Sale
              </Link>
            </nav>

            {/* Logo */}
            <Link href="/" className="font-display text-2xl lg:text-3xl font-light tracking-[0.2em] uppercase">
              Vestige
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-5">
              <Link href="/products" className="hidden lg:block text-xs tracking-widest uppercase hover:text-vestige-accent transition-colors">
                Search
              </Link>
              <button
                onClick={toggleCart}
                className="relative p-1"
                aria-label={`Cart (${itemCount} items)`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-vestige-accent text-vestige-black text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 bg-vestige-white border-t border-gray-100 ${menuOpen ? 'max-h-64' : 'max-h-0'}`}>
          <nav className="flex flex-col px-6 py-4 gap-5">
            {['Shop', 'New Arrivals', 'Sale'].map((item) => (
              <Link
                key={item}
                href={item === 'Shop' ? '/products' : `/products?category=${encodeURIComponent(item)}`}
                className="text-xs tracking-widest uppercase"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
