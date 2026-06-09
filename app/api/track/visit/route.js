import { prisma } from '@/lib/prisma';
import { ensureVisitorId } from '@/lib/tracking';

export async function POST(request) {
  try {
    const { path } = await request.json().catch(() => ({}));
    // Never track the admin area.
    if (!path || path.startsWith('/admin')) {
      return Response.json({ ok: true, skipped: true });
    }

    const visitorId = ensureVisitorId();
    const country =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      null;

    await prisma.pageView.create({
      data: { visitorId, path: path.slice(0, 512), country },
    });

    return Response.json({ ok: true });
  } catch (err) {
    // Tracking must never break the page.
    return Response.json({ ok: false }, { status: 200 });
  }
}
