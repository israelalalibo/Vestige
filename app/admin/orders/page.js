import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCents } from '@/lib/money';
import OrderStatusBadge from '@/components/OrderStatusBadge';

export const dynamic = 'force-dynamic';

const STATUSES = ['ALL', 'PENDING', 'PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default async function AdminOrdersPage({ searchParams }) {
  const filter = searchParams.status || 'ALL';
  const where = filter !== 'ALL' ? { status: filter } : {};

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { items: true },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-1">Orders</h1>
      <p className="text-vestige-gray text-sm mb-6">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>

      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === 'ALL' ? '/admin/orders' : `/admin/orders?status=${s}`}
            className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
              filter === s ? 'border-vestige-black bg-vestige-black text-white' : 'border-gray-200 text-vestige-gray hover:border-vestige-black'
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-widest uppercase text-vestige-gray border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-vestige-gray">No orders.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-vestige-accent">{o.orderNumber}</Link></td>
                  <td className="px-4 py-3 text-vestige-gray">{o.email}</td>
                  <td className="px-4 py-3 text-vestige-gray">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{o.items.length}</td>
                  <td className="px-4 py-3">{formatCents(o.totalCents)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
