'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

// Aggregate an array of {date, ...} daily rows into ISO-week buckets.
function toWeekly(data) {
  const buckets = {};
  for (const d of data) {
    const dt = new Date(d.date);
    const onejan = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((dt - onejan) / 86400000 + onejan.getUTCDay() + 1) / 7);
    const key = `${dt.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
    if (!buckets[key]) buckets[key] = { label: key.slice(5), visits: 0, uniqueVisitors: 0, abandonedRevenue: 0 };
    buckets[key].visits += d.visits;
    buckets[key].uniqueVisitors += d.uniqueVisitors;
    buckets[key].abandonedRevenue += d.abandonedRevenue;
  }
  return Object.values(buckets);
}

export function TrafficChart({ data }) {
  const [view, setView] = useState('daily');
  const series = view === 'weekly' ? toWeekly(data) : data;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium">Traffic</p>
        <div className="flex gap-1 text-[10px] tracking-widest uppercase">
          {['daily', 'weekly'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2 py-1 border transition-colors ${view === v ? 'border-vestige-black bg-vestige-black text-white' : 'border-gray-200 text-vestige-gray hover:border-vestige-black'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={series} margin={{ left: -10, right: 10, top: 5 }}>
          <defs>
            <linearGradient id="v1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="v2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a227" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#c9a227" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#999" interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} stroke="#999" allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" name="Visits" dataKey="visits" stroke="#1a1a1a" strokeWidth={2} fill="url(#v1)" />
          <Area type="monotone" name="Unique visitors" dataKey="uniqueVisitors" stroke="#c9a227" strokeWidth={2} fill="url(#v2)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AbandonedChart({ data }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-sm font-medium mb-4">Abandoned cart value — last 30 days</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: -10, right: 10, top: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#999" interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} stroke="#999" tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Potential revenue']} />
          <Bar dataKey="abandonedRevenue" fill="#c9a227" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
