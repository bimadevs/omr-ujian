'use client';

import Link from 'next/link';
import { useTemplates } from '@/hooks/useTemplates';
import { deleteTemplate } from '@/lib/api';
import { FileText, Plus, Edit3, KeyRound, Trash2, ScanLine } from 'lucide-react';

export default function TemplatesPage() {
  const { templates, loading, refreshTemplates } = useTemplates();

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus template ini?')) return;
    try {
      await deleteTemplate(id);
      refreshTemplates();
    } catch {
      alert('Gagal menghapus template');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Template</h1>
          <p className="text-slate-500 mt-1">Kelola template lembar jawaban</p>
        </div>
        <Link
          href="/templates/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Baru
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Belum ada template</p>
          <Link href="/templates/new" className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block cursor-pointer">
            Buat template pertama
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(template.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>

              <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
              <p className="text-sm text-slate-500 mb-4">
                {template.pgCount} PG + {template.pgkCount} PGK = {template.totalQuestions} soal
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/templates/${template.id}/keys`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Kunci
                </Link>
                <Link
                  href={`/scan?template=${template.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  Scan
                </Link>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors cursor-pointer ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
