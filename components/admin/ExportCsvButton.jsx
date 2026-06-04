'use client';

export default function ExportCsvButton({ rows, filename = 'export.csv', headers }) {
  const download = () => {
    const cols = headers || Object.keys(rows[0] || {});
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => escape(r[c])).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      disabled={!rows.length}
      className="px-5 py-2.5 text-xs tracking-widest uppercase border border-vestige-black hover:bg-vestige-black hover:text-white transition-colors disabled:opacity-40"
    >
      Export CSV
    </button>
  );
}
