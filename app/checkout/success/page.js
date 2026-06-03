'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-vestige-black flex items-center justify-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <p className="text-[10px] tracking-widest uppercase text-vestige-gray mb-3">Order confirmed</p>
      <h1 className="font-display text-4xl font-light mb-4">Thank You</h1>
      <p className="text-vestige-gray text-sm leading-relaxed max-w-xs mb-10">
        Your order is on its way. Check your email for a confirmation and tracking details.
      </p>
      <Link href="/products" className="btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
}
