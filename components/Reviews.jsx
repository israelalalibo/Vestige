'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function Stars({ rating, onSelect, interactive }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onSelect(n) : undefined}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <svg viewBox="0 0 20 20" className={`w-4 h-4 ${n <= rating ? 'text-vestige-accent' : 'text-gray-300'}`} fill="currentColor">
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function Reviews({ productId, reviews: initialReviews, averageRating }) {
  const { status } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit review');
      setDone(true);
      setTitle('');
      setBody('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-gray-100 max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-display text-2xl font-light">Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(averageRating)} />
            <span className="text-sm text-vestige-gray">{averageRating.toFixed(1)} · {reviews.length}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-sm text-vestige-gray">No reviews yet. Be the first.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-100 pb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <Stars rating={r.rating} />
                  <span className="text-xs text-vestige-gray">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.title && <p className="text-sm font-medium">{r.title}</p>}
                <p className="text-sm text-vestige-gray mt-1 leading-relaxed">{r.body}</p>
                <p className="text-xs text-vestige-gray mt-2">— {r.author || 'Verified buyer'}</p>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        <div>
          {status !== 'authenticated' ? (
            <div className="border border-gray-200 p-6 text-center">
              <p className="text-sm text-vestige-gray mb-4">Sign in to leave a review.</p>
              <Link href="/login" className="btn-primary text-xs">Sign In</Link>
            </div>
          ) : done ? (
            <div className="border border-gray-200 p-6">
              <p className="text-sm">Thanks! Your review has been submitted and will appear once approved.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-gray-200 p-6 space-y-4">
              <p className="text-sm tracking-widest uppercase">Write a review</p>
              <div>
                <label className="block text-xs text-vestige-gray mb-2">Rating</label>
                <Stars rating={rating} onSelect={setRating} interactive />
              </div>
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-vestige-black"
              />
              <textarea
                required value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your thoughts…" rows={4}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-vestige-black resize-none"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" disabled={submitting} className="btn-primary w-full text-xs disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
