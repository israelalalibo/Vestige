import { prisma } from '@/lib/prisma';
import { rollupDay } from '@/lib/analytics';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function authorize(request) {
  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get('authorization');
  if (secret && header === `Bearer ${secret}`) return true;
  // Allow an admin to trigger a manual recompute from the dashboard.
  const admin = await requireAdmin();
  return !!admin;
}

async function run() {
  const now = Date.now();
  const yesterday = new Date(now - 24 * 60 * 60 * 1000);
  const today = new Date(now);

  // Finalize yesterday and refresh today's partial figures.
  const [y, t] = await Promise.all([rollupDay(yesterday), rollupDay(today)]);

  // Housekeeping: prune raw events older than 90 days.
  const cutoff = new Date(now - 90 * 24 * 60 * 60 * 1000);
  await Promise.all([
    prisma.pageView.deleteMany({ where: { createdAt: { lt: cutoff } } }),
    prisma.cartEvent.deleteMany({ where: { createdAt: { lt: cutoff } } }),
  ]);

  return { yesterday: y, today: t };
}

export async function GET(request) {
  if (!(await authorize(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await run();
  return Response.json({ ok: true, ...result });
}

export async function POST(request) {
  return GET(request);
}
