import { prisma } from '@/lib/prisma';
import ReviewActions from '@/components/admin/ReviewActions';

export const dynamic = 'force-dynamic';

function Stars({ rating }) {
  return (
    <span className="text-vestige-accent text-sm">
      {'★'.repeat(rating)}<span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

const STATUS_STYLE = {
  PENDING: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-gray-200 text-gray-600',
};

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: { product: { select: { name: true } }, user: { select: { name: true, email: true } } },
  });

  const pending = reviews.filter((r) => r.status === 'PENDING').length;

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-1">Reviews</h1>
      <p className="text-vestige-gray text-sm mb-6">{reviews.length} total · {pending} awaiting moderation</p>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-vestige-gray text-sm">No reviews yet.</div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Stars rating={r.rating} />
                    <span className={`text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </div>
                  {r.title && <p className="text-sm font-medium">{r.title}</p>}
                  <p className="text-sm text-vestige-gray mt-1">{r.body}</p>
                  <p className="text-xs text-vestige-gray mt-2">
                    {r.product.name} · by {r.user?.name || r.user?.email} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ReviewActions reviewId={r.id} status={r.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
