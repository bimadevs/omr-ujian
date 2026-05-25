'use client';

import { useScanResults } from '@/hooks/useScanResults';
import { deleteScanResult } from '@/lib/api';
import ScanResultTable from '@/components/ScanResultTable';
import { ClipboardList, Trash2 } from 'lucide-react';

export default function ResultsPage() {
  const { results, loading, refreshResults, setResults } = useScanResults();

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus hasil scan ini?')) return;
    try {
      await deleteScanResult(id);
      setResults((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('Gagal menghapus hasil');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Hapus SEMUA hasil scan?')) return;
    try {
      await Promise.all(results.map((r) => deleteScanResult(r.id)));
      setResults([]);
    } catch {
      alert('Gagal menghapus beberapa hasil');
      refreshResults();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hasil Scan</h1>
          <p className="text-slate-500 mt-1">Riwayat koreksi lembar jawaban</p>
        </div>
        {results.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua
          </button>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Belum ada hasil scan</p>
        </div>
      ) : (
        <ScanResultTable results={results} onDelete={handleDelete} />
      )}
    </div>
  );
}
