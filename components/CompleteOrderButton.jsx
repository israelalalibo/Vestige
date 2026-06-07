'use client';

import { useState } from 'react';

export default function CompleteOrderButton({ orderId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start payment');
      window.location.href = data.url; // redirect to Stripe Checkout
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3.5 text-sm tracking-widest uppercase bg-vestige-black text-white hover:bg-vestige-accent hover:text-vestige-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirecting to payment…' : 'Complete Payment'}
      </button>
      {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
    </div>
  );
}
