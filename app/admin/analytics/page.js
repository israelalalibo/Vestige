import { getDailyStats, getBuyerLocations, getReturnRate } from '@/lib/analytics';
import { formatCents } from '@/lib/money';
import StatCard from '@/components/admin/StatCard';
import { TrafficChart, AbandonedChart } from '@/components/admin/AnalyticsCharts';
import RecomputeButton from '@/components/admin/RecomputeButton';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const [stats, locations, returnRate] = await Promise.all([
    getDailyStats(30),
    getBuyerLocations(),
    getReturnRate(),
  ]);

  // Totals across the window.
  const totals = stats.reduce(
    (a, s) => ({
      visits: a.visits + s.visits,
      unique: a.unique + s.uniqueVisitors,
      orders: a.orders + s.orders,
      abandonedItems: a.abandonedItems + s.abandonedItems,
      abandonedRevenue: a.abandonedRevenue + s.abandonedRevenueCents,
    }),
    { visits: 0, unique: 0, orders: 0, abandonedItems: 0, abandonedRevenue: 0 }
  );

  // Yesterday = the most recent finalized full day (second-to-last row if today is present).
  const today = stats[stats.length - 1];
  const yesterday = stats.length >= 2 ? stats[stats.length - 2] : today;

  const conversion = totals.unique > 0 ? (totals.orders / totals.unique) * 100 : 0;

  const chartData = stats.map((s) => ({
    label: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visits: s.visits,
    uniqueVisitors: s.uniqueVisitors,
    abandonedRevenue: Number((s.abandonedRevenueCents / 100).toFixed(2)),
  }));

  const totalLocationOrders = locations.reduce((s, l) => s + l.orders, 0) || 1;
  const maxLocation = locations[0]?.orders || 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light">Analytics</h1>
          <p className="text-vestige-gray text-sm mt-1">Traffic, abandoned carts, locations & conversion — last 30 days</p>
        </div>
        <RecomputeButton />
      </div>

      {/* Headline cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Visits (30d)" value={totals.visits.toLocaleString()} sub={`${totals.unique.toLocaleString()} unique`} />
        <StatCard label="Conversion Rate" value={`${conversion.toFixed(1)}%`} sub={`${totals.orders} orders`} />
        <StatCard label="Abandoned (yesterday)" value={yesterday ? yesterday.abandonedItems : 0} sub={yesterday ? `${formatCents(yesterday.abandonedRevenueCents)} potential` : ''} accent />
        <StatCard label="Return Rate" value={`${(returnRate.rate * 100).toFixed(1)}%`} sub={`${returnRate.returned} of ${returnRate.delivered} delivered`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <TrafficChart data={chartData} />
        <AbandonedChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Abandoned cart summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-sm font-medium mb-4">Abandoned Carts</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-vestige-gray mb-1">Yesterday</p>
              <p className="text-2xl font-light">{yesterday ? yesterday.abandonedItems : 0} <span className="text-sm text-vestige-gray">items</span></p>
              <p className="text-sm text-vestige-accent mt-1">{yesterday ? formatCents(yesterday.abandonedRevenueCents) : '$0.00'} potential</p>
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-vestige-gray mb-1">Last 30 days</p>
              <p className="text-2xl font-light">{totals.abandonedItems} <span className="text-sm text-vestige-gray">items</span></p>
              <p className="text-sm text-vestige-accent mt-1">{formatCents(totals.abandonedRevenue)} potential</p>
            </div>
          </div>
          <p className="text-xs text-vestige-gray mt-4">Items added to a cart that weren&apos;t checked out by midnight that day.</p>
        </div>

        {/* Buyer locations */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-sm font-medium mb-4">Buyer Locations</p>
          {locations.length === 0 ? (
            <p className="text-sm text-vestige-gray">No shipped orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {locations.slice(0, 8).map((l) => (
                <li key={l.country}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{l.country}</span>
                    <span className="text-vestige-gray">{l.orders} order{l.orders !== 1 ? 's' : ''} · {formatCents(l.revenueCents)}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-vestige-black" style={{ width: `${(l.orders / maxLocation) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
