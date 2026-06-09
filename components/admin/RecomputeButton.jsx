'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecomputeButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      await fetch('/api/cron/daily-rollup', { method: 'POST' });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={run}
      disabled={busy}
      className="px-4 py-2 text-xs tracking-widest uppercase border border-gray-300 hover:border-vestige-black transition-colors disabled:opacity-50"
    >
      {busy ? 'Recomputing…' : 'Recompute today'}
    </button>
  );
}
