'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-light mb-2 text-center">Reset password</h1>

        {sent ? (
          <div className="text-center mt-6">
            <p className="text-sm text-vestige-gray leading-relaxed">
              If an account exists for <span className="text-vestige-black">{email}</span>, we&apos;ve sent a link to reset your password. Check your inbox.
            </p>
            <Link href="/login" className="inline-block mt-8 text-xs tracking-widest uppercase text-vestige-black underline hover:text-vestige-accent">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="text-vestige-gray text-sm text-center mb-8">Enter your email and we&apos;ll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-vestige-gray mb-2">Email</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-vestige-black transition-colors"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 text-sm tracking-widest uppercase bg-vestige-black text-white hover:bg-vestige-accent hover:text-vestige-black transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
            <p className="text-center text-sm text-vestige-gray mt-6">
              Remembered it?{' '}
              <Link href="/login" className="text-vestige-black underline hover:text-vestige-accent">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
