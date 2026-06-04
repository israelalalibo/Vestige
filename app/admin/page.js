import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCents } from '@/lib/money';
import StatCard from '@/components/admin/StatCard';
import { RevenueChart, OrdersChart } from '@/components/admin/DashboardCharts';
import OrderStatusBadge from '@/components/OrderStatusBadge';

export const dynamic = 'force-dynamic';

const PAID_STATUSES = ['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'];
const LOW_STOCK_THRESHOLD = 5;

export default async function AdminOverview() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [revenueAgg, paidOrders, customerCount, recentOrders, lowStock, paidItemRows] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { in: PAID_STATUSES } },
      _sum: { totalCents: true },
      _count: true,
    }),
    prisma.order.findMany({
      where: { status: { in: PAID_STATUSES }, createdAt: { gte: since } },
      select: { totalCents: true, createdAt: true },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 6, include: { items: true } }),
    prisma.variant.findMany({
      where: { stock: { lte: LOW_STOCK_THRESHOLD } },
      include: { product: { select: { name: true, id: true } } },
      orderBy: { stock: 'asc' },
      take: 8,
    }),
    prisma.orderItem.groupBy({
      by: ['name'],
      where: { order: { status: { in: PAID_STATUSES } } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ]);

  const totalRevenue = revenueAgg._sum.totalCents || 0;
  const orderCount = revenueAgg._count || 0;
  const aov = orderCount ? Math.round(totalRevenue / orderCount) : 0;

  // Build 30-day daily series.
  const days = [];
  const byDay = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    byDay[key] = { revenue: 0, orders: 0 };
    days.push({ key, label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
  }
  for (const o of paidOrders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (byDay[key]) {
      byDay[key].revenue += o.totalCents / 100;
      byDay[key].orders += 1;
    }
  }
  const chartData = days.map((d) => ({ label: d.label, revenue: Number(byDay[d.key].revenue.toFixed(2)), orders: byDay[d.key].orders }));

  const revenue30 = paidOrders.reduce((s, o) => s + o.totalCents, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light">Dashboard</h1>
        <p className="text-vestige-gray text-sm mt-1">Store performance at a glance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={formatCents(totalRevenue)} sub={`${formatCents(revenue30)} last 30d`} accent />
        <StatCard label="Paid Orders" value={orderCount} sub={`${paidOrders.length} last 30d`} />
        <StatCard label="Avg. Order Value" value={formatCents(aov)} />
        <StatCard label="Customers" value={customerCount} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <RevenueChart data={chartData} />
        <OrdersChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">Recent Orders</p>
            <Link href="/admin/orders" className="text-xs text-vestige-gray hover:text-vestige-black">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-vestige-gray">No orders yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((o) => (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{o.orderNumber}</p>
                    <p className="text-xs text-vestige-gray">{o.email} · {o.items.length} item{o.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={o.status} />
                    <span className="text-sm">{formatCents(o.totalCents)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top products + low stock */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm font-medium mb-4">Top Sellers</p>
            {paidItemRows.length === 0 ? (
              <p className="text-sm text-vestige-gray">No sales yet.</p>
            ) : (
              <ol className="space-y-2">
                {paidItemRows.map((row, i) => (
                  <li key={row.name} className="flex items-center justify-between text-sm">
                    <span className="truncate"><span className="text-vestige-gray mr-2">{i + 1}.</span>{row.name}</span>
                    <span className="text-vestige-gray flex-shrink-0">{row._sum.quantity} sold</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm font-medium mb-4">Low Stock Alerts</p>
            {lowStock.length === 0 ? (
              <p className="text-sm text-vestige-gray">All variants healthy.</p>
            ) : (
              <ul className="space-y-2">
                {lowStock.map((v) => (
                  <li key={v.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{v.product.name} <span className="text-vestige-gray">· {v.size}/{v.color}</span></span>
                    <span className={`flex-shrink-0 font-medium ${v.stock === 0 ? 'text-red-500' : 'text-amber-600'}`}>{v.stock}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
