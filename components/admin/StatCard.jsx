export default function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-[10px] tracking-widest uppercase text-vestige-gray mb-2">{label}</p>
      <p className={`text-2xl font-light ${accent ? 'text-vestige-accent' : ''}`}>{value}</p>
      {sub && <p className="text-xs text-vestige-gray mt-1">{sub}</p>}
    </div>
  );
}
