'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton({ className }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={className || 'text-xs tracking-widest uppercase text-vestige-gray hover:text-vestige-black transition-colors'}
    >
      Sign Out
    </button>
  );
}
