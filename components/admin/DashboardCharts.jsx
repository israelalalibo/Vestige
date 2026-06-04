'use client';

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export function RevenueChart({ data }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-sm font-medium mb-4">Revenue — last 30 days</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ left: -10, right: 10, top: 5 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a227" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#c9a227" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#999" interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} stroke="#999" tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
          <Area type="monotone" dataKey="revenue" stroke="#c9a227" strokeWidth={2} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersChart({ data }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-sm font-medium mb-4">Orders — last 30 days</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ left: -20, right: 10, top: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#999" interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} stroke="#999" allowDecimals={false} />
          <Tooltip formatter={(v) => [v, 'Orders']} />
          <Bar dataKey="orders" fill="#1a1a1a" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
