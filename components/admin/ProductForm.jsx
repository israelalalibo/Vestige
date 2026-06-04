'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const blankVariant = () => ({ size: '', color: '', stock: 0 });

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProductForm({ product }) {
  const router = useRouter();
  const editing = !!product;

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product ? (product.priceCents / 100).toString() : '',
    category: product?.category || '',
    featured: product?.featured || false,
    isNew: product?.isNew || false,
    active: product?.active ?? true,
    details: (product?.details || []).join('\n'),
    images: (product?.images || []).join('\n'),
  });
  const [variants, setVariants] = useState(
    product?.variants?.length ? product.variants.map((v) => ({ size: v.size, color: v.color, stock: v.stock })) : [blankVariant()]
  );
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setVariant = (i, k, v) => setVariants((vs) => vs.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      priceCents: Math.round(parseFloat(form.price || '0') * 100),
      category: form.category,
      featured: form.featured,
      isNew: form.isNew,
      active: form.active,
      details: form.details.split('\n').map((s) => s.trim()).filter(Boolean),
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      variants: variants
        .filter((v) => v.size && v.color)
        .map((v) => ({ size: v.size.trim(), color: v.color.trim(), stock: Number(v.stock) || 0 })),
    };

    try {
      const res = await fetch(editing ? `/api/products/${product.id}` : '/api/products', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save product');
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const input = 'w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-vestige-black';
  const label = 'block text-xs tracking-widest uppercase text-vestige-gray mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Name</label>
          <input className={input} value={form.name} required
            onChange={(e) => { set('name', e.target.value); if (!editing) set('slug', slugify(e.target.value)); }} />
        </div>
        <div>
          <label className={label}>Slug</label>
          <input className={input} value={form.slug} required onChange={(e) => set('slug', e.target.value)} />
        </div>
        <div>
          <label className={label}>Price (USD)</label>
          <input className={input} type="number" step="0.01" min="0" value={form.price} required onChange={(e) => set('price', e.target.value)} />
        </div>
        <div>
          <label className={label}>Category</label>
          <input className={input} value={form.category} required onChange={(e) => set('category', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={label}>Description</label>
        <textarea className={`${input} resize-none`} rows={3} value={form.description} required onChange={(e) => set('description', e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Image URLs (one per line)</label>
          <textarea className={`${input} resize-none`} rows={3} value={form.images} onChange={(e) => set('images', e.target.value)} placeholder="https://…" />
        </div>
        <div>
          <label className={label}>Details (one per line)</label>
          <textarea className={`${input} resize-none`} rows={3} value={form.details} onChange={(e) => set('details', e.target.value)} />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNew} onChange={(e) => set('isNew', e.target.checked)} /> New</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} /> Active</label>
      </div>

      {/* Variants / inventory */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={label}>Variants & Stock</label>
          <button type="button" onClick={() => setVariants((vs) => [...vs, blankVariant()])} className="text-xs text-vestige-accent hover:underline">+ Add variant</button>
        </div>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input className={`${input} flex-1`} placeholder="Size" value={v.size} onChange={(e) => setVariant(i, 'size', e.target.value)} />
              <input className={`${input} flex-1`} placeholder="Color" value={v.color} onChange={(e) => setVariant(i, 'color', e.target.value)} />
              <input className={`${input} w-24`} type="number" min="0" placeholder="Stock" value={v.stock} onChange={(e) => setVariant(i, 'stock', e.target.value)} />
              <button type="button" onClick={() => setVariants((vs) => vs.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 px-2" aria-label="Remove">✕</button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 p-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-6 py-3 text-sm tracking-widest uppercase bg-vestige-black text-white hover:bg-vestige-accent hover:text-vestige-black transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 text-sm tracking-widest uppercase border border-gray-300 hover:border-vestige-black transition-colors">Cancel</button>
      </div>
    </form>
  );
}
