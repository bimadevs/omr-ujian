'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, Award } from 'lucide-react';
import { ScanResult } from '@/lib/types';

interface ScanResultToastProps {
  result: ScanResult | null;
  onClose: () => void;
}

export default function ScanResultToast({ result, onClose }: ScanResultToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [result, onClose]);

  if (!result) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Hasil Koreksi</h3>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="p-1 rounded-lg hover:bg-gray-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-3 p-3 bg-blue-50 rounded-lg">
          <span className="text-sm text-slate-600">Nilai Akhir</span>
          <span className="text-2xl font-bold text-blue-700">{result.score}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-slate-500 text-xs">PG Benar</p>
              <p className="font-semibold text-green-700">{result.pgCorrect} / {result.pgTotal}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
            <XCircle className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-slate-500 text-xs">PGK Benar</p>
              <p className="font-semibold text-amber-700">{result.pgkCorrect} / {result.pgkTotal}</p>
            </div>
          </div>
        </div>

        {result.studentName && (
          <p className="mt-3 text-xs text-slate-500">Siswa: {result.studentName}</p>
        )}
      </div>
    </div>
  );
}
