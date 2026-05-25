'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createTemplate } from '@/lib/api';
import TemplateConfigForm from '@/components/TemplateConfigForm';
import { BoxCoordinates } from '@/lib/types';
import { Upload, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<BoxCoordinates[]>([]);
  const [pgCount, setPgCount] = useState(35);
  const [pgkCount, setPgkCount] = useState(10);
  const [saving, setSaving] = useState(false);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(async () => {
    if (!name.trim() || !imageFile) {
      alert('Nama template dan foto wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', imageFile);
      formData.append('pgCount', String(pgCount));
      formData.append('pgkCount', String(pgkCount));
      formData.append('coordinates', JSON.stringify(coordinates));
      await createTemplate(formData);
      router.push('/templates');
    } catch {
      alert('Gagal menyimpan template');
      setSaving(false);
    }
  }, [name, imageFile, pgCount, pgkCount, coordinates, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/templates" className="p-2 rounded-lg hover:bg-gray-100 text-slate-500 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Buat Template Baru</h1>
          <p className="text-slate-500 text-sm">Upload foto lembar jawaban kosong dan konfigurasi area kotak</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Image upload + basic info */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Nama Template</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Contoh: Ujian Matematika Kelas 10"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Jumlah PG</label>
                <input
                  type="number"
                  min={1}
                  value={pgCount}
                  onChange={(e) => setPgCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Jumlah PGK</label>
                <input
                  type="number"
                  min={1}
                  value={pgkCount}
                  onChange={(e) => setPgkCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Foto Lembar Jawaban</label>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img src={imagePreview} alt="Preview" className="w-full object-contain max-h-96" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500">Klik untuk upload foto</span>
                <span className="text-xs text-slate-400 mt-1">JPG, PNG</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        {/* Right: Coordinate config */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <TemplateConfigForm
            imageUrl={imagePreview}
            coordinates={coordinates}
            onChange={setCoordinates}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan...' : 'Simpan Template'}
        </button>
      </div>
    </div>
  );
}
