'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setJoined(true);
        setEmail('');
      }
    } catch {
      /* swallow — non-critical */
    }
  };

  return (
    <footer className="bg-vestige-black text-vestige-white mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-display text-2xl font-light tracking-[0.2em] uppercase mb-4">Vestige</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Timeless pieces for the modern wardrobe. Designed with intention, made to last.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-5 text-gray-300">Shop</p>
            <ul className="space-y-3 text-gray-400 text-sm">
              {['All Products', 'New Arrivals', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'].map((item) => (
                <li key={item}>
                  <Link href={`/products?category=${encodeURIComponent(item)}`} className="hover:text-vestige-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-5 text-gray-300">Help</p>
            <ul className="space-y-3 text-gray-400 text-sm">
              {['Sizing Guide', 'Shipping & Returns', 'Care Instructions', 'FAQ', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-vestige-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-5 text-gray-300">Stay in Touch</p>
            <p className="text-gray-400 text-sm mb-4">Early access to new arrivals, restocks, and archive sales.</p>
            {joined ? (
              <p className="text-sm text-vestige-accent">You&apos;re on the list.</p>
            ) : (
              <form className="flex" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent border border-gray-600 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-vestige-accent transition-colors"
                />
                <button
                  type="submit"
                  className="bg-vestige-accent text-vestige-black px-5 py-2.5 text-xs tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Vestige. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
