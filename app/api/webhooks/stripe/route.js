import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

// Stripe needs the raw request body to verify the signature.
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Fallback for local dev without a configured signing secret.
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await fulfillOrder(orderId, session);
      } catch (err) {
        console.error('Order fulfillment error:', err);
        return Response.json({ error: 'Fulfillment failed' }, { status: 500 });
      }
    }
  }

  return Response.json({ received: true });
}

async function fulfillOrder(orderId, session) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order || order.status !== 'PENDING') return; // idempotent

  const shipping = session.shipping_details || session.customer_details;

  await prisma.$transaction(async (tx) => {
    // Mark paid + capture the shipping address.
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        email: session.customer_details?.email || order.email,
        shippingName: shipping?.name || order.shippingName,
        shippingAddress: shipping?.address ? shipping.address : undefined,
      },
    });

    // Decrement inventory per ordered variant.
    for (const item of order.items) {
      if (!item.productId) continue;
      await tx.variant.updateMany({
        where: { productId: item.productId, size: item.size, color: item.color },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Count coupon usage.
    if (order.couponCode) {
      await tx.coupon.updateMany({
        where: { code: order.couponCode },
        data: { usedCount: { increment: 1 } },
      });
    }
  });
}
