import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { formatCents } from '@/lib/money';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import SignOutButton from '@/components/SignOutButton';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?callbackUrl=/account');

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return (
    <div className="min-h-screen pt-28 lg:pt-32 pb-20 px-6 lg:px-12 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-light">My Account</h1>
          <p className="text-vestige-gray text-sm mt-1">{user.name || user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="border border-gray-200 p-5">
          <p className="text-[10px] tracking-widest uppercase text-vestige-gray mb-1">Email</p>
          <p className="text-sm">{user.email}</p>
        </div>
        <div className="border border-gray-200 p-5">
          <p className="text-[10px] tracking-widest uppercase text-vestige-gray mb-1">Orders</p>
          <p className="text-sm">{orders.length}</p>
        </div>
        <Link href="/wishlist" className="border border-gray-200 p-5 hover:border-vestige-black transition-colors">
          <p className="text-[10px] tracking-widest uppercase text-vestige-gray mb-1">Saved</p>
          <p className="text-sm">View wishlist →</p>
        </Link>
      </div>

      <h2 className="text-sm tracking-widest uppercase mb-5">Order History</h2>
      {orders.length === 0 ? (
        <div className="border border-gray-200 p-10 text-center">
          <p className="text-vestige-gray text-sm mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 border border-gray-200">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{order.orderNumber}</p>
                <p className="text-xs text-vestige-gray mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm font-medium">{formatCents(order.totalCents)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
