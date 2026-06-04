const STYLES = {
  PENDING: 'bg-amber-100 text-amber-800',
  PAID: 'bg-blue-100 text-blue-800',
  FULFILLED: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-200 text-gray-700',
  REFUNDED: 'bg-red-100 text-red-800',
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase ${STYLES[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
