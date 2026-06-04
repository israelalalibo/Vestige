import { prisma } from '@/lib/prisma';
import { couponValidateSchema } from '@/lib/validators';
import { evaluateCoupon } from '@/lib/coupon';

export async function POST(request) {
  const parsed = couponValidateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
  const { code, subtotalCents } = parsed.data;

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  const result = evaluateCoupon(coupon, subtotalCents);

  if (!result.ok) {
    return Response.json({ ok: false, error: result.reason }, { status: 200 });
  }
  return Response.json({
    ok: true,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discountCents: result.discountCents,
  });
}
