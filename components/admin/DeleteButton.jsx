'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ url, label = 'Delete', confirmText = 'Delete this item?', className }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    try {
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      window.alert('Could not delete.');
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className={className || 'text-xs text-red-500 hover:text-red-700 disabled:opacity-50'}
    >
      {busy ? '…' : label}
    </button>
  );
}
