'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchTemplate, fetchAnswerKeys, saveAnswerKeys } from '@/lib/api';
import AnswerKeyForm from '@/components/AnswerKeyForm';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function KeysPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [template, setTemplate] = useState<{ name: string; pgCount: number; pgkCount: number } | null>(null);
  const [keys, setKeys] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id || isNaN(id)) return;

    async function load() {
      try {
        const [tpl, serverKeys] = await Promise.all([
          fetchTemplate(id),
          fetchAnswerKeys(id),
        ]);
        setTemplate(tpl);
        const mapped: Record<number, string[]> = {};
        serverKeys.forEach((k) => {
          mapped[k.questionNumber] = k.correctAnswers;
        });
        setKeys(mapped);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async (newKeys: Record<number, string[]>) => {
    if (!id || isNaN(id)) return;
    setSaving(true);
    try {
      const payload = Object.entries(newKeys).map(([questionNumber, correctAnswers]) => ({
        id: 0,
        templateId: id,
        questionNumber: Number(questionNumber),
        type: Number(questionNumber) <= (template?.pgCount || 35) ? ('PG' as const) : ('PGK' as const),
        correctAnswers,
      }));
      await saveAnswerKeys(id, payload);
    } catch {
      alert('Gagal menyimpan kunci jawaban');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/templates" className="p-2 rounded-lg hover:bg-gray-100 text-slate-500 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kunci Jawaban</h1>
          <p className="text-slate-500 text-sm">{template?.name || 'Template'}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <AnswerKeyForm
          pgCount={template?.pgCount || 35}
          pgkCount={template?.pgkCount || 10}
          initialKeys={keys}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
