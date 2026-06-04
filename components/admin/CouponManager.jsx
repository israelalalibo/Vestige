'use client';

import { useState } from 'react';
import { formatCents } from '@/lib/money';

export default function CouponManager({ initialCoupons }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [form, setForm] = useState({ code: '', type: 'PERCENT', value: '', minSubtotal: '', maxUses: '', expiresAt: '' });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const create = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: form.type === 'PERCENT' ? Number(form.value) : Math.round(Number(form.value) * 100),
        minSubtotalCents: form.minSubtotal ? Math.round(Number(form.minSubtotal) * 100) : 0,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        active: true,
      };
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create coupon');
      setCoupons((c) => [data.coupon, ...c]);
      setForm({ code: '', type: 'PERCENT', value: '', minSubtotal: '', maxUses: '', expiresAt: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (c) => {
    const res = await fetch(`/api/admin/coupons/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !c.active }),
    });
    if (res.ok) setCoupons((list) => list.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
  };

  const remove = async (c) => {
    if (!confirm(`Delete coupon ${c.code}?`)) return;
    const res = await fetch(`/api/admin/coupons/${c.id}`, { method: 'DELETE' });
    if (res.ok) setCoupons((list) => list.filter((x) => x.id !== c.id));
  };

  const input = 'border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-vestige-black';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Create */}
      <form onSubmit={create} className="bg-white border border-gray-200 rounded-lg p-5 space-y-3 h-fit">
        <p className="text-sm font-medium">New Coupon</p>
        <input className={`${input} w-full uppercase`} placeholder="CODE" value={form.code} required onChange={(e) => set('code', e.target.value)} />
        <select className={`${input} w-full`} value={form.type} onChange={(e) => set('type', e.target.value)}>
          <option value="PERCENT">Percent off (%)</option>
          <option value="FIXED">Fixed amount off ($)</option>
        </select>
        <input className={`${input} w-full`} type="number" step="0.01" min="0" placeholder={form.type === 'PERCENT' ? 'e.g. 10 (%)' : 'e.g. 15.00 ($)'} value={form.value} required onChange={(e) => set('value', e.target.value)} />
        <input className={`${input} w-full`} type="number" step="0.01" min="0" placeholder="Min subtotal $ (optional)" value={form.minSubtotal} onChange={(e) => set('minSubtotal', e.target.value)} />
        <input className={`${input} w-full`} type="number" min="1" placeholder="Max uses (optional)" value={form.maxUses} onChange={(e) => set('maxUses', e.target.value)} />
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-vestige-gray mb-1">Expires (optional)</label>
          <input className={`${input} w-full`} type="datetime-local" value={form.expiresAt} onChange={(e) => set('expiresAt', e.target.value)} />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button type="submit" disabled={saving} className="w-full py-2.5 text-xs tracking-widest uppercase bg-vestige-black text-white hover:bg-vestige-accent hover:text-vestige-black transition-colors disabled:opacity-50">
          {saving ? 'Creating…' : 'Create Coupon'}
        </button>
      </form>

      {/* List */}
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden h-fit">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-widest uppercase text-vestige-gray border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Used</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-vestige-gray">No coupons yet.</td></tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.type === 'PERCENT' ? `${c.value}%` : formatCents(c.value)}{c.minSubtotalCents > 0 && <span className="text-xs text-vestige-gray"> · min {formatCents(c.minSubtotalCents)}</span>}</td>
                  <td className="px-4 py-3 text-vestige-gray">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(c)} className={`text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(c)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
