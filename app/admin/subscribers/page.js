import { prisma } from '@/lib/prisma';
import ExportCsvButton from '@/components/admin/ExportCsvButton';

export const dynamic = 'force-dynamic';

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
  const rows = subscribers.map((s) => ({ email: s.email, subscribed: new Date(s.createdAt).toISOString().slice(0, 10) }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-light mb-1">Subscribers</h1>
          <p className="text-vestige-gray text-sm">{subscribers.length} newsletter subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        </div>
        <ExportCsvButton rows={rows} filename="vestige-subscribers.csv" headers={['email', 'subscribed']} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-widest uppercase text-vestige-gray border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers.length === 0 ? (
              <tr><td colSpan={2} className="px-4 py-10 text-center text-vestige-gray">No subscribers yet.</td></tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3 text-vestige-gray">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
