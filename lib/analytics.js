import { prisma } from '@/lib/prisma';

export const PAID_STATUSES = ['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'];
const RETURNED_STATUSES = ['APPROVED', 'RECEIVED', 'REFUNDED'];

// UTC day boundaries for a given date.
export function dayBounds(date) {
  const d = new Date(date);
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

/**
 * Compute the finalized metrics for a single day. Abandonment = add-to-cart
 * events that day from visitors/users who did NOT complete a paid order that day.
 */
export async function computeDailyStat(date) {
  const { start, end } = dayBounds(date);
  const range = { gte: start, lt: end };

  const [pageViews, cartEvents, paidOrders, returnsCount] = await Promise.all([
    prisma.pageView.findMany({ where: { createdAt: range }, select: { visitorId: true } }),
    prisma.cartEvent.findMany({
      where: { createdAt: range },
      select: { visitorId: true, userId: true, priceCents: true, quantity: true },
    }),
    prisma.order.findMany({
      where: { createdAt: range, status: { in: PAID_STATUSES } },
      select: { totalCents: true, userId: true, trackingId: true },
    }),
    prisma.returnRequest.count({ where: { createdAt: range } }),
  ]);

  const visits = pageViews.length;
  const uniqueVisitors = new Set(pageViews.map((p) => p.visitorId)).size;

  const convertedUsers = new Set(paidOrders.map((o) => o.userId).filter(Boolean));
  const convertedVisitors = new Set(paidOrders.map((o) => o.trackingId).filter(Boolean));

  let addToCarts = 0;
  let abandonedItems = 0;
  let abandonedRevenueCents = 0;
  for (const e of cartEvents) {
    addToCarts += e.quantity;
    const converted =
      (e.userId && convertedUsers.has(e.userId)) || convertedVisitors.has(e.visitorId);
    if (!converted) {
      abandonedItems += e.quantity;
      abandonedRevenueCents += e.priceCents * e.quantity;
    }
  }

  return {
    visits,
    uniqueVisitors,
    addToCarts,
    abandonedItems,
    abandonedRevenueCents,
    orders: paidOrders.length,
    revenueCents: paidOrders.reduce((s, o) => s + o.totalCents, 0),
    returns: returnsCount,
  };
}

// Upsert the DailyStat row for a given date.
export async function rollupDay(date) {
  const { start } = dayBounds(date);
  const metrics = await computeDailyStat(date);
  return prisma.dailyStat.upsert({
    where: { date: start },
    update: metrics,
    create: { date: start, ...metrics },
  });
}

// Last N days of finalized stats (ascending by date).
export async function getDailyStats(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const { start } = dayBounds(since);
  return prisma.dailyStat.findMany({ where: { date: { gte: start } }, orderBy: { date: 'asc' } });
}

// Buyer locations aggregated from paid orders' shipping addresses.
export async function getBuyerLocations() {
  const orders = await prisma.order.findMany({
    where: { status: { in: PAID_STATUSES }, NOT: { shippingAddress: { equals: null } } },
    select: { shippingAddress: true, totalCents: true },
  });

  const byCountry = {};
  for (const o of orders) {
    const addr = o.shippingAddress || {};
    const country = addr.country || 'Unknown';
    if (!byCountry[country]) byCountry[country] = { country, orders: 0, revenueCents: 0 };
    byCountry[country].orders += 1;
    byCountry[country].revenueCents += o.totalCents;
  }
  return Object.values(byCountry).sort((a, b) => b.orders - a.orders);
}

// Return rate = returned orders ÷ orders that reached the customer.
export async function getReturnRate() {
  const [returned, delivered] = await Promise.all([
    prisma.returnRequest.count({ where: { status: { in: RETURNED_STATUSES } } }),
    prisma.order.count({ where: { status: { in: ['DELIVERED', 'REFUNDED'] } } }),
  ]);
  const rate = delivered > 0 ? returned / delivered : 0;
  return { returned, delivered, rate };
}
