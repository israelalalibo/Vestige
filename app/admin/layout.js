import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';
import Sidebar from '@/components/admin/Sidebar';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Vestige Admin',
};

export default async function AdminLayout({ children }) {
  // Defense in depth: middleware already gates /admin, re-check on the server.
  const admin = await requireAdmin();
  if (!admin) redirect('/login?callbackUrl=/admin');

  return (
    <div className="flex min-h-screen bg-gray-50 text-vestige-black">
      <Sidebar />
      <div className="flex-1 lg:ml-0 ml-60 min-w-0">
        <main className="p-6 lg:p-10 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
