'use client';

import { useState } from 'react';

export default function PasscodeForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Incorrect passcode');
      }
      // Cookie is set — reload into the full site.
      window.location.assign('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto">
      <div className="flex">
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter access passcode"
          className="flex-1 bg-transparent border border-gray-600 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-vestige-accent transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-vestige-accent text-vestige-black px-5 py-3 text-xs tracking-widest uppercase font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? '…' : 'Enter'}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
    </form>
  );
}
