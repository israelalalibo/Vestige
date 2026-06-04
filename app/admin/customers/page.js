import { prisma } from '@/lib/prisma';
import { formatCents } from '@/lib/money';

export const dynamic = 'force-dynamic';

const PAID_STATUSES = ['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'];

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: {
      orders: { select: { totalCents: true, status: true } },
    },
  });

  const rows = customers.map((c) => {
    const paid = c.orders.filter((o) => PAID_STATUSES.includes(o.status));
    const ltv = paid.reduce((s, o) => s + o.totalCents, 0);
    return { id: c.id, name: c.name, email: c.email, createdAt: c.createdAt, orderCount: paid.length, ltv };
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-1">Customers</h1>
      <p className="text-vestige-gray text-sm mb-6">{rows.length} registered customer{rows.length !== 1 ? 's' : ''}</p>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-widest uppercase text-vestige-gray border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Lifetime Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-vestige-gray">No customers yet.</td></tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.name || '—'}</td>
                  <td className="px-4 py-3 text-vestige-gray">{c.email}</td>
                  <td className="px-4 py-3 text-vestige-gray">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{c.orderCount}</td>
                  <td className="px-4 py-3 font-medium">{formatCents(c.ltv)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
