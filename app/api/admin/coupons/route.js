import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';
import { couponSchema } from '@/lib/validators';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json({ coupons });
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = couponSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
  }
  const data = parsed.data;

  const exists = await prisma.coupon.findUnique({ where: { code: data.code } });
  if (exists) return Response.json({ error: 'A coupon with this code exists' }, { status: 409 });

  const coupon = await prisma.coupon.create({
    data: {
      code: data.code,
      type: data.type,
      value: data.value,
      minSubtotalCents: data.minSubtotalCents,
      maxUses: data.maxUses ?? null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      active: data.active,
    },
  });
  return Response.json({ coupon }, { status: 201 });
}
