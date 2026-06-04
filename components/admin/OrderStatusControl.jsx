'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = ['PENDING', 'PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function OrderStatusControl({ orderId, current }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);

  const update = async (newStatus) => {
    setStatus(newStatus);
    setSaving(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => update(e.target.value)}
        disabled={saving}
        className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-vestige-black disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {saving && <span className="text-xs text-vestige-gray">Saving…</span>}
    </div>
  );
}
