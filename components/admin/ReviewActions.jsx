'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewActions({ reviewId, status }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const act = async (method, body) => {
    setBusy(true);
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {status !== 'APPROVED' && (
        <button disabled={busy} onClick={() => act('PATCH', { status: 'APPROVED' })} className="text-xs text-green-600 hover:text-green-800 disabled:opacity-50">Approve</button>
      )}
      {status !== 'REJECTED' && (
        <button disabled={busy} onClick={() => act('PATCH', { status: 'REJECTED' })} className="text-xs text-amber-600 hover:text-amber-800 disabled:opacity-50">Reject</button>
      )}
      <button disabled={busy} onClick={() => { if (confirm('Delete this review?')) act('DELETE'); }} className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50">Delete</button>
    </div>
  );
}
