'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

export default function AccountMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Not signed in (or still loading) → plain link to login.
  if (status !== 'authenticated') {
    return (
      <Link href="/login" aria-label="Sign in" className="p-1 hover:text-vestige-accent transition-colors">
        <UserIcon />
      </Link>
    );
  }

  const user = session.user;
  const isAdmin = user?.role === 'ADMIN';
  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-vestige-black text-white text-xs font-medium hover:bg-vestige-accent hover:text-vestige-black transition-colors"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium truncate">{user?.name || 'My Account'}</p>
            <p className="text-xs text-vestige-gray truncate">{user?.email}</p>
            {isAdmin && (
              <span className="inline-block mt-1.5 text-[9px] tracking-widest uppercase bg-vestige-accent/20 text-vestige-accent px-2 py-0.5 rounded-full">Admin</span>
            )}
          </div>

          <nav className="py-1 text-sm">
            <Link href="/account" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-50 transition-colors">My Account</Link>
            <Link href="/account" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-50 transition-colors">Order History</Link>
            <Link href="/wishlist" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-50 transition-colors">Wishlist</Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 text-vestige-accent hover:bg-gray-50 transition-colors">Admin Dashboard</Link>
            )}
          </nav>

          <div className="border-t border-gray-100">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
