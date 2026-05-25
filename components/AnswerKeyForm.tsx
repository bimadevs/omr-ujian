'use client';

import { useState, useCallback } from 'react';
import { Check, Save } from 'lucide-react';

interface AnswerKeyFormProps {
  pgCount?: number;
  pgkCount?: number;
  initialKeys?: Record<number, string[]>;
  onSave: (keys: Record<number, string[]>) => void;
}

const PG_OPTIONS = ['A', 'B', 'C', 'D', 'E'];
const PGK_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export default function AnswerKeyForm({
  pgCount = 35,
  pgkCount = 10,
  initialKeys = {},
  onSave,
}: AnswerKeyFormProps) {
  const [keys, setKeys] = useState<Record<number, string[]>>(initialKeys);
  const [saved, setSaved] = useState(false);

  const handlePGChange = useCallback((questionNumber: number, option: string) => {
    setKeys((prev) => ({
      ...prev,
      [questionNumber]: prev[questionNumber]?.includes(option) ? [] : [option],
    }));
    setSaved(false);
  }, []);

  const handlePGKChange = useCallback((questionNumber: number, option: string) => {
    setKeys((prev) => {
      const current = prev[questionNumber] || [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option].sort();
      return { ...prev, [questionNumber]: updated };
    });
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    onSave(keys);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [keys, onSave]);

  const pgStart = 1;
  const pgEnd = pgCount;
  const pgkStart = pgCount + 1;
  const pgkEnd = pgCount + pgkCount;

  return (
    <div className="space-y-6">
      {/* PG Section */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
          Pilihan Ganda (Soal {pgStart} - {pgEnd})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {Array.from({ length: pgCount }, (_, i) => pgStart + i).map((num) => (
            <div key={num} className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
              <span className="w-8 text-sm font-medium text-slate-500">{num}.</span>
              <div className="flex gap-1">
                {PG_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handlePGChange(num, opt)}
                    className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      keys[num]?.includes(opt)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PGK Section */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
          Pilihan Ganda Kompleks (Soal {pgkStart} - {pgkEnd})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {Array.from({ length: pgkCount }, (_, i) => pgkStart + i).map((num) => (
            <div key={num} className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
              <span className="w-8 text-sm font-medium text-slate-500">{num}.</span>
              <div className="flex gap-1 flex-wrap">
                {PGK_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handlePGKChange(num, opt)}
                    className={`w-7 h-7 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                      keys[num]?.includes(opt)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
      >
        {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? 'Tersimpan' : 'Simpan Semua'}
      </button>
    </div>
  );
}
