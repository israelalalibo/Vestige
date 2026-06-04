import { prisma } from '@/lib/prisma';
import CouponManager from '@/components/admin/CouponManager';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-1">Coupons</h1>
      <p className="text-vestige-gray text-sm mb-6">Create and manage promo codes</p>
      <CouponManager initialCoupons={coupons} />
    </div>
  );
}
