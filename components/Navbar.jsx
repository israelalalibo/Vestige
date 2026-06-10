'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import AccountMenu from './AccountMenu';
import Logo from './Logo';

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };

  const isAdmin = session?.user?.role === 'ADMIN';

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
              <Link href="/products" className="text-xs tracking-widest uppercase hover:text-vestige-accent transition-colors">Shop</Link>
              <Link href="/products?sort=new" className="text-xs tracking-widest uppercase hover:text-vestige-accent transition-colors">New Arrivals</Link>
              {isAdmin && (
                <Link href="/admin" className="text-xs tracking-widest uppercase text-vestige-accent hover:opacity-80 transition-opacity">Admin</Link>
              )}
            </nav>

            {/* Logo */}
            <Link href="/" aria-label="Vestige — home">
              <Logo tone="light" className="h-11 lg:h-14 w-auto" priority />
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-5">
              <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="p-1 hover:text-vestige-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>

              <Link href={session ? '/wishlist' : '/login'} aria-label="Wishlist" className="hidden sm:block p-1 hover:text-vestige-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </Link>

              <AccountMenu />

              <button onClick={toggleCart} className="relative p-1" aria-label={`Cart (${itemCount} items)`}>
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

        {/* Search bar */}
        {searchOpen && (
          <div className="bg-vestige-white border-t border-gray-100">
            <form onSubmit={submitSearch} className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex gap-3">
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products…"
                className="flex-1 border-b border-gray-300 bg-transparent py-2 text-sm focus:outline-none focus:border-vestige-black"
              />
              <button type="submit" className="text-xs tracking-widest uppercase hover:text-vestige-accent transition-colors">Go</button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 bg-vestige-white border-t border-gray-100 ${menuOpen ? 'max-h-72' : 'max-h-0'}`}>
          <nav className="flex flex-col px-6 py-4 gap-5">
            <Link href="/products" className="text-xs tracking-widest uppercase" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link href="/products?sort=new" className="text-xs tracking-widest uppercase" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
            <Link href={session ? '/account' : '/login'} className="text-xs tracking-widest uppercase" onClick={() => setMenuOpen(false)}>{session ? 'Account' : 'Sign In'}</Link>
            {isAdmin && <Link href="/admin" className="text-xs tracking-widest uppercase text-vestige-accent" onClick={() => setMenuOpen(false)}>Admin</Link>}
          </nav>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
