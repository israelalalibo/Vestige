import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { formatCents } from '@/lib/money';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import CompleteOrderButton from '@/components/CompleteOrderButton';
import ReturnRequestForm from '@/components/ReturnRequestForm';

export const dynamic = 'force-dynamic';

const TRACKING_STEPS = ['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'];

export default async function OrderDetailPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, returns: { orderBy: { createdAt: 'desc' } } },
  });

  if (!order || order.userId !== user.id) notFound();

  const currentStep = TRACKING_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen pt-28 lg:pt-32 pb-20 px-6 lg:px-12 max-w-4xl mx-auto">
      <Link href="/account" className="text-xs tracking-widest uppercase text-vestige-gray hover:text-vestige-black transition-colors">
        ← Back to account
      </Link>

      <div className="flex items-center justify-between mt-6 mb-8">
        <div>
          <h1 className="font-display text-3xl font-light">{order.orderNumber}</h1>
          <p className="text-vestige-gray text-sm mt-1">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Awaiting payment — let the customer complete checkout */}
      {order.status === 'PENDING' && (
        <div className="mb-10 border border-amber-200 bg-amber-50 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-amber-900">This order is awaiting payment</p>
            <p className="text-xs text-amber-800 mt-0.5">Complete checkout to confirm your order — total {formatCents(order.totalCents)}.</p>
          </div>
          <CompleteOrderButton orderId={order.id} />
        </div>
      )}

      {/* Returns — available once delivered */}
      {(order.status === 'DELIVERED' || order.returns.length > 0) && (
        <ReturnRequestForm orderId={order.id} existingReturn={order.returns[0] || null} />
      )}

      {/* Tracking timeline */}
      {!['CANCELLED', 'REFUNDED'].includes(order.status) && currentStep >= 0 && (
        <div className="flex items-center justify-between mb-12 max-w-lg">
          {TRACKING_STEPS.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div className={`absolute right-1/2 top-2 h-px w-full ${i <= currentStep ? 'bg-vestige-black' : 'bg-gray-200'}`} />
              )}
              <div className={`relative z-10 w-4 h-4 rounded-full ${i <= currentStep ? 'bg-vestige-black' : 'bg-gray-200'}`} />
              <span className={`mt-2 text-[9px] tracking-widest uppercase ${i <= currentStep ? 'text-vestige-black' : 'text-vestige-gray'}`}>{step}</span>
            </div>
          ))}
        </div>
      )}

      <div className="divide-y divide-gray-100 border-y border-gray-100 mb-8">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 py-5">
            <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-vestige-gray mt-0.5">{item.size} · {item.color}</p>
              <p className="text-xs text-vestige-gray mt-1">Qty {item.quantity}</p>
            </div>
            <p className="text-sm">{formatCents(item.priceCents * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="max-w-xs ml-auto space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-vestige-gray">Subtotal</span><span>{formatCents(order.subtotalCents)}</span></div>
        {order.discountCents > 0 && (
          <div className="flex justify-between text-green-600"><span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span><span>−{formatCents(order.discountCents)}</span></div>
        )}
        <div className="flex justify-between"><span className="text-vestige-gray">Shipping</span><span>{order.shippingCents === 0 ? 'Free' : formatCents(order.shippingCents)}</span></div>
        <div className="flex justify-between border-t border-gray-200 pt-2 font-medium"><span>Total</span><span>{formatCents(order.totalCents)}</span></div>
      </div>
    </div>
  );
}
