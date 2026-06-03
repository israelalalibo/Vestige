'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shipping = subtotal >= 150 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-vestige-gray text-sm mb-6">Your cart is empty.</p>
        <Link href="/products" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl font-light mb-10">Your Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
        {/* Order summary */}
        <div className="lg:col-span-3 space-y-0 divide-y divide-gray-100">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 py-5">
              <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-vestige-gray mt-0.5">{item.size} · {item.color}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-vestige-gray">Qty: {item.quantity}</p>
                  <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price breakdown + CTA */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-6 space-y-4">
            <h2 className="text-sm tracking-widest uppercase mb-5">Summary</h2>

            <div className="flex justify-between text-sm">
              <span className="text-vestige-gray">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-vestige-gray">Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-vestige-gray">
                Add ${(150 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 p-3 rounded">{error}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 text-sm tracking-widest uppercase bg-vestige-black text-white hover:bg-vestige-accent hover:text-vestige-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Redirecting...' : 'Proceed to Payment'}
            </button>

            <div className="flex items-center justify-center gap-4 pt-2">
              {['visa', 'mastercard', 'amex', 'apple-pay'].map((brand) => (
                <div key={brand} className="bg-white border border-gray-200 rounded px-2 py-1 text-[9px] tracking-widest uppercase text-vestige-gray">
                  {brand}
                </div>
              ))}
            </div>

            <p className="text-[10px] text-center text-vestige-gray">
              Secured by Stripe · SSL encrypted
            </p>
          </div>

          <Link href="/products" className="block mt-4 text-center text-xs tracking-widest uppercase text-vestige-gray hover:text-vestige-black transition-colors py-2">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
