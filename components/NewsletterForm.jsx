'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setStatus('done');
      setMessage("You're on the list.");
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  if (status === 'done') {
    return <p className="text-sm text-vestige-accent max-w-sm mx-auto">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-transparent border border-gray-600 px-4 py-3.5 text-sm placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-vestige-accent text-vestige-black px-6 py-3.5 text-xs tracking-widest uppercase font-semibold hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-50"
      >
        {status === 'loading' ? '…' : 'Join'}
      </button>
    </form>
  );
}
