import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { evaluateCoupon } from '@/lib/coupon';
import { getVisitorId } from '@/lib/tracking';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

function orderNumber() {
  return `VST-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;
}

export async function POST(request) {
  try {
    const { items, couponCode } = await request.json();

    if (!items || items.length === 0) {
      return Response.json({ error: 'No items in cart' }, { status: 400 });
    }

    const user = await getCurrentUser();

    // ---- Re-price from the database; never trust client prices ----
    const productIds = [...new Set(items.map((i) => i.id))];
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const lineItems = [];
    const orderItems = [];
    let subtotalCents = 0;

    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product || !product.active) {
        return Response.json({ error: `“${item.name}” is no longer available` }, { status: 400 });
      }
      const variant = product.variants.find((v) => v.size === item.size && v.color === item.color);
      if (variant && variant.stock < item.quantity) {
        return Response.json(
          { error: `Only ${variant.stock} of “${product.name}” (${item.size}/${item.color}) left` },
          { status: 409 }
        );
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      subtotalCents += product.priceCents * qty;

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: `${item.size} · ${item.color}`,
            images: product.images?.[0] ? [product.images[0]] : [],
          },
          unit_amount: product.priceCents,
        },
        quantity: qty,
      });

      orderItems.push({
        productId: product.id,
        name: product.name,
        size: item.size,
        color: item.color,
        priceCents: product.priceCents,
        quantity: qty,
        image: product.images?.[0] || null,
      });
    }

    // ---- Coupon (re-evaluated server-side) ----
    let discountCents = 0;
    let appliedCode = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      const result = evaluateCoupon(coupon, subtotalCents);
      if (result.ok) {
        discountCents = result.discountCents;
        appliedCode = coupon.code;
      }
    }

    const shippingCents = subtotalCents >= 15000 ? 0 : 999;
    const totalCents = subtotalCents - discountCents + shippingCents;

    // ---- Persist a PENDING order ----
    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber(),
        userId: user?.id || null,
        email: user?.email || 'guest@checkout',
        status: 'PENDING',
        subtotalCents,
        shippingCents,
        discountCents,
        totalCents,
        couponCode: appliedCode,
        trackingId: getVisitorId(),
        items: { create: orderItems },
      },
    });

    // ---- Stripe session ----
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: user?.email || undefined,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingCents, currency: 'usd' },
            display_name: shippingCents === 0 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: { orderId: order.id, brand: 'Vestige' },
    };

    if (discountCents > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: discountCents,
        currency: 'usd',
        duration: 'once',
        name: appliedCode || 'Discount',
      });
      sessionConfig.discounts = [{ coupon: stripeCoupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
