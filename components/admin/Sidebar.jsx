'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';
import Logo from '@/components/Logo';

const NAV = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/returns', label: 'Returns' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/subscribers', label: 'Subscribers' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-vestige-black text-white min-h-screen flex flex-col fixed lg:static inset-y-0 left-0 z-40">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" aria-label="Vestige — home"><Logo tone="dark" className="h-7 w-auto" /></Link>
        <p className="text-[10px] tracking-widest uppercase text-gray-500 mt-2">Admin</p>
      </div>

      <nav className="flex-1 py-4">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-2.5 text-sm transition-colors ${
                active ? 'bg-white/10 text-white border-l-2 border-vestige-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-white/10 space-y-3">
        <Link href="/" className="block text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors">← View Store</Link>
        <SignOutButton className="text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors" />
      </div>
    </aside>
  );
}
