'use client';

import { useState } from 'react';
import { ScanResult } from '@/lib/types';
import { Trash2, Eye, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';

interface ScanResultTableProps {
  results: ScanResult[];
  onDelete: (id: number) => void;
}

export default function ScanResultTable({ results, onDelete }: ScanResultTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {results.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">Belum ada hasil scan</div>
      )}

      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900 truncate">
                  {result.studentName || 'Tanpa Nama'}
                </h3>
                <span className="text-xs text-slate-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {result.templateName}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {new Date(result.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500">Nilai</p>
                <p className={`text-lg font-bold ${result.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                  {result.score}
                </p>
              </div>
              <button
                onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                className="p-2 rounded-lg hover:bg-gray-100 text-slate-500 cursor-pointer"
              >
                {expandedId === result.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => onDelete(result.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {expandedId === result.id && (
            <div className="border-t border-gray-100 p-4 bg-gray-50/50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-slate-500 mb-1">PG</p>
                  <p className="text-sm font-medium text-slate-900">
                    Benar {result.pgCorrect} / {result.pgTotal}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-slate-500 mb-1">PGK</p>
                  <p className="text-sm font-medium text-slate-900">
                    Benar {result.pgkCorrect} / {result.pgkTotal}
                  </p>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 border-b border-gray-200">
                      <th className="pb-2 font-medium">No</th>
                      <th className="pb-2 font-medium">Tipe</th>
                      <th className="pb-2 font-medium">Terdeteksi</th>
                      <th className="pb-2 font-medium">Kunci</th>
                      <th className="pb-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.details.map((detail) => (
                      <tr key={detail.questionNumber} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 font-medium">{detail.questionNumber}</td>
                        <td className="py-2">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              detail.type === 'PG'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {detail.type}
                          </span>
                        </td>
                        <td className="py-2 text-slate-600">{detail.detected.join(', ') || '-'}</td>
                        <td className="py-2 text-slate-600">{detail.correct.join(', ')}</td>
                        <td className="py-2 text-right">
                          {detail.isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-green-500 inline" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 inline" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
