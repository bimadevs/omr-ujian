'use client';

import Link from 'next/link';
import { useTemplates } from '@/hooks/useTemplates';
import { useScanResults } from '@/hooks/useScanResults';
import { FileText, ScanLine, ClipboardList, Plus, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { templates, loading: tplLoading } = useTemplates();
  const { results, loading: resLoading } = useScanResults();

  const today = new Date().toDateString();
  const todayScans = results.filter((r) => new Date(r.createdAt).toDateString() === today).length;

  const stats = [
    { label: 'Template', value: templates.length, icon: FileText, href: '/templates', color: 'bg-blue-50 text-blue-700' },
    { label: 'Scan Hari Ini', value: todayScans, icon: ScanLine, href: '/scan', color: 'bg-green-50 text-green-700' },
    { label: 'Total Hasil', value: results.length, icon: ClipboardList, href: '/results', color: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Ringkasan sistem koreksi otomatis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Aksi Cepat</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/templates/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Buat Template Baru
          </Link>
          <Link
            href="/scan"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ScanLine className="w-4 h-4" />
            Scan Lembar Jawaban
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Hasil Scan Terbaru</h2>
          <Link href="/results" className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
            Lihat Semua
          </Link>
        </div>
        {resLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">Belum ada hasil scan</p>
        ) : (
          <div className="space-y-2">
            {results.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{r.studentName || 'Tanpa Nama'}</p>
                  <p className="text-xs text-slate-500">{r.templateName}</p>
                </div>
                <span className={`text-sm font-bold ${r.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                  {r.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
