'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReturnActions({ returnId, status }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const setStatus = async (newStatus) => {
    setBusy(true);
    try {
      await fetch(`/api/admin/returns/${returnId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {status === 'REQUESTED' && (
        <>
          <button disabled={busy} onClick={() => setStatus('APPROVED')} className="text-xs text-green-600 hover:text-green-800 disabled:opacity-50">Approve</button>
          <button disabled={busy} onClick={() => setStatus('REJECTED')} className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50">Reject</button>
        </>
      )}
      {status === 'APPROVED' && (
        <button disabled={busy} onClick={() => setStatus('RECEIVED')} className="text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-50">Mark received</button>
      )}
      {(status === 'RECEIVED' || status === 'APPROVED') && (
        <button disabled={busy} onClick={() => setStatus('REFUNDED')} className="text-xs text-purple-600 hover:text-purple-800 disabled:opacity-50">Refund</button>
      )}
      {(status === 'REJECTED' || status === 'REFUNDED') && (
        <span className="text-xs text-vestige-gray">No further action</span>
      )}
    </div>
  );
}
