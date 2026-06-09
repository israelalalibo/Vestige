import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getReturnRate } from '@/lib/analytics';
import ReturnActions from '@/components/admin/ReturnActions';
import StatCard from '@/components/admin/StatCard';

export const dynamic = 'force-dynamic';

const STATUS_STYLE = {
  REQUESTED: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-gray-200 text-gray-600',
  RECEIVED: 'bg-indigo-100 text-indigo-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
};

export default async function AdminReturnsPage() {
  const [returns, rate] = await Promise.all([
    prisma.returnRequest.findMany({
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      include: {
        order: { select: { orderNumber: true, id: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    getReturnRate(),
  ]);

  const pending = returns.filter((r) => r.status === 'REQUESTED').length;

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-1">Returns</h1>
      <p className="text-vestige-gray text-sm mb-6">{returns.length} request{returns.length !== 1 ? 's' : ''} · {pending} awaiting review</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Return Rate" value={`${(rate.rate * 100).toFixed(1)}%`} sub={`${rate.returned} returned of ${rate.delivered} delivered`} accent />
        <StatCard label="Awaiting Review" value={pending} />
        <StatCard label="Total Returns" value={returns.length} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-widest uppercase text-vestige-gray border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {returns.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-vestige-gray">No return requests yet.</td></tr>
            ) : (
              returns.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 align-top">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${r.order.id}`} className="font-medium hover:text-vestige-accent">{r.order.orderNumber}</Link>
                    <p className="text-[11px] text-vestige-gray mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3 text-vestige-gray">{r.user?.name || r.user?.email}</td>
                  <td className="px-4 py-3 max-w-xs text-vestige-gray">{r.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right"><ReturnActions returnId={r.id} status={r.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
