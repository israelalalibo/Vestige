'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not reset password');
      setDone(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-vestige-gray">This reset link is missing its token. Request a new one.</p>
        <Link href="/forgot-password" className="inline-block mt-6 btn-primary text-xs">Request new link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-sm">Your password has been reset. Redirecting you to sign in…</p>
        <Link href="/login" className="inline-block mt-6 text-xs tracking-widest uppercase underline hover:text-vestige-accent">Sign in now</Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-3xl font-light mb-2 text-center">Choose a new password</h1>
      <p className="text-vestige-gray text-sm text-center mb-8">Enter a new password for your account.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs tracking-widest uppercase text-vestige-gray mb-2">New password</label>
          <input
            type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-vestige-black transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-vestige-gray mb-2">Confirm password</label>
          <input
            type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-vestige-black transition-colors"
          />
        </div>
        {error && <p className="text-red-500 text-xs bg-red-50 p-3">{error}</p>}
        <button
          type="submit" disabled={loading}
          className="w-full py-3.5 text-sm tracking-widest uppercase bg-vestige-black text-white hover:bg-vestige-accent hover:text-vestige-black transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <div className="w-full max-w-sm">
        <Suspense fallback={<p className="text-center text-vestige-gray text-sm">Loading…</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
