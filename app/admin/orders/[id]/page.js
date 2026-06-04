import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCents } from '@/lib/money';
import OrderStatusControl from '@/components/admin/OrderStatusControl';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetail({ params }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, user: { select: { name: true, email: true } } },
  });
  if (!order) notFound();

  const addr = order.shippingAddress;

  return (
    <div>
      <Link href="/admin/orders" className="text-xs tracking-widest uppercase text-vestige-gray hover:text-vestige-black">← Orders</Link>

      <div className="flex items-start justify-between mt-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-light">{order.orderNumber}</h1>
          <p className="text-vestige-gray text-sm mt-1">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <OrderStatusControl orderId={order.id} current={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium mb-4">Items</p>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                <div className="relative w-14 h-16 bg-gray-100 flex-shrink-0 overflow-hidden rounded">
                  {item.image && <Image src={item.image} alt="" fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-vestige-gray mt-0.5">{item.size} · {item.color} · Qty {item.quantity}</p>
                </div>
                <p className="text-sm">{formatCents(item.priceCents * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 max-w-xs ml-auto space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-vestige-gray">Subtotal</span><span>{formatCents(order.subtotalCents)}</span></div>
            {order.discountCents > 0 && <div className="flex justify-between text-green-600"><span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span><span>−{formatCents(order.discountCents)}</span></div>}
            <div className="flex justify-between"><span className="text-vestige-gray">Shipping</span><span>{order.shippingCents === 0 ? 'Free' : formatCents(order.shippingCents)}</span></div>
            <div className="flex justify-between font-medium border-t border-gray-100 pt-1.5"><span>Total</span><span>{formatCents(order.totalCents)}</span></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm font-medium mb-3">Customer</p>
            <p className="text-sm">{order.user?.name || order.shippingName || '—'}</p>
            <p className="text-sm text-vestige-gray">{order.email}</p>
            <p className="text-xs text-vestige-gray mt-2">{order.userId ? 'Registered account' : 'Guest checkout'}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm font-medium mb-3">Shipping Address</p>
            {addr ? (
              <div className="text-sm text-vestige-gray space-y-0.5">
                {order.shippingName && <p>{order.shippingName}</p>}
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postal_code}</p>
                <p>{addr.country}</p>
              </div>
            ) : (
              <p className="text-sm text-vestige-gray">Not yet captured.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
