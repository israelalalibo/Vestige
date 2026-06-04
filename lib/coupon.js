// Shared coupon evaluation — used by /api/coupons/validate and /api/checkout
// so the storefront preview and the server-of-record agree exactly.

/**
 * @param {object} coupon  Prisma Coupon record (or null)
 * @param {number} subtotalCents
 * @returns {{ ok: boolean, reason?: string, discountCents: number }}
 */
export function evaluateCoupon(coupon, subtotalCents) {
  if (!coupon) return { ok: false, reason: 'Invalid code', discountCents: 0 };
  if (!coupon.active) return { ok: false, reason: 'This code is no longer active', discountCents: 0 };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
    return { ok: false, reason: 'This code has expired', discountCents: 0 };
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses)
    return { ok: false, reason: 'This code has reached its usage limit', discountCents: 0 };
  if (subtotalCents < coupon.minSubtotalCents)
    return {
      ok: false,
      reason: `Spend at least $${(coupon.minSubtotalCents / 100).toFixed(0)} to use this code`,
      discountCents: 0,
    };

  let discountCents =
    coupon.type === 'PERCENT'
      ? Math.round((subtotalCents * coupon.value) / 100)
      : coupon.value;

  // Never discount more than the subtotal.
  discountCents = Math.min(discountCents, subtotalCents);

  return { ok: true, discountCents };
}
