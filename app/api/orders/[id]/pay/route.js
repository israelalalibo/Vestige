import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

// Create a fresh Stripe Checkout session to complete payment for an existing
// PENDING order. The webhook (metadata.orderId) marks it PAID and decrements
// stock, exactly like a first-time checkout.
export async function POST(_request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order || order.userId !== user.id) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.status !== 'PENDING') {
      return Response.json({ error: 'This order is not awaiting payment' }, { status: 409 });
    }
    if (order.items.length === 0) {
      return Response.json({ error: 'This order has no items' }, { status: 400 });
    }

    // Re-validate stock so we don't sell something that's since sold out.
    for (const item of order.items) {
      if (!item.productId) continue;
      const variant = await prisma.variant.findFirst({
        where: { productId: item.productId, size: item.size, color: item.color },
      });
      if (variant && variant.stock < item.quantity) {
        return Response.json(
          { error: `“${item.name}” (${item.size}/${item.color}) is no longer available in that quantity` },
          { status: 409 }
        );
      }
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `${item.size} · ${item.color}`,
          images: item.image ? [item.image] : [],
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: order.email && order.email.includes('@') ? order.email : user.email,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: order.shippingCents, currency: 'usd' },
            display_name: order.shippingCents === 0 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account/orders/${order.id}`,
      metadata: { orderId: order.id, brand: 'Vestige' },
    };

    if (order.discountCents > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: order.discountCents,
        currency: 'usd',
        duration: 'once',
        name: order.couponCode || 'Discount',
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
    console.error('Resume payment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
