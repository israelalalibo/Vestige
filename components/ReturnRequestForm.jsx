'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReturnRequestForm({ orderId, existingReturn }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (existingReturn) {
    return (
      <div className="mb-10 border border-gray-200 rounded-lg p-5">
        <p className="text-sm font-medium">Return requested</p>
        <p className="text-xs text-vestige-gray mt-1">
          Status: <span className="uppercase tracking-wide">{existingReturn.status}</span> · requested {new Date(existingReturn.createdAt).toLocaleDateString()}
        </p>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit return');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-10 border border-gray-200 rounded-lg p-5">
      {!open ? (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Not quite right?</p>
            <p className="text-xs text-vestige-gray mt-0.5">You can request a return for this delivered order.</p>
          </div>
          <button onClick={() => setOpen(true)} className="px-5 py-2.5 text-xs tracking-widest uppercase border border-vestige-black hover:bg-vestige-black hover:text-white transition-colors flex-shrink-0">
            Request a Return
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <p className="text-sm font-medium">Request a return</p>
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Tell us why you'd like to return this order (sizing, fit, defect…)"
            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-vestige-black resize-none"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="px-5 py-2.5 text-xs tracking-widest uppercase bg-vestige-black text-white hover:bg-vestige-accent hover:text-vestige-black transition-colors disabled:opacity-50">
              {submitting ? 'Submitting…' : 'Submit Return'}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 text-xs tracking-widest uppercase border border-gray-300 hover:border-vestige-black transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
