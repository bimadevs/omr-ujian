'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTemplates } from '@/hooks/useTemplates';
import { useScanContext } from '@/context/ScanContext';
import { useCameraScanner } from '@/hooks/useCameraScanner';
import CameraPreview from '@/components/CameraPreview';
import ScanResultToast from '@/components/ScanResultToast';
import { ScanLine, Camera, CameraOff, Zap, ZapOff } from 'lucide-react';

function ScanPageContent() {
  const searchParams = useSearchParams();
  const preselectedTemplate = searchParams.get('template');

  const { templates } = useTemplates();
  const { addResult } = useScanContext();

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    preselectedTemplate ? Number(preselectedTemplate) : null
  );

  const handleScanResult = useCallback(
    (result: import('@/lib/types').ScanResult) => {
      addResult(result);
    },
    [addResult]
  );

  const { videoRef, canvasRef, state, startCamera, stopCamera, startScanning, stopScanning, manualScan } =
    useCameraScanner(selectedTemplateId, handleScanResult);

  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    if (!cameraReady) {
      startCamera().then(() => setCameraReady(true));
    }
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera, cameraReady]);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Scan Lembar Jawaban</h1>
        <p className="text-slate-500 mt-1">Arahkan kamera ke lembar jawaban untuk koreksi otomatis</p>
      </div>

      {/* Template selector */}
      <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Template</label>
        <select
          value={selectedTemplateId ?? ''}
          onChange={(e) => setSelectedTemplateId(e.target.value ? Number(e.target.value) : null)}
          className="w-full max-w-md px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="">-- Pilih template --</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.totalQuestions} soal)
            </option>
          ))}
        </select>
        {selectedTemplate && (
          <p className="text-xs text-slate-500 mt-2">
            {selectedTemplate.pgCount} PG + {selectedTemplate.pgkCount} PGK
          </p>
        )}
      </div>

      {/* Camera preview */}
      <div className="mb-6">
        <CameraPreview
          videoRef={videoRef}
          canvasRef={canvasRef}
          isScanning={state.isScanning}
          isLoading={state.isLoading}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {!state.isScanning ? (
          <button
            onClick={startScanning}
            disabled={!selectedTemplateId || !cameraReady}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            Mulai Auto-Scan
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
          >
            <ZapOff className="w-4 h-4" />
            Hentikan Auto-Scan
          </button>
        )}

        <button
          onClick={manualScan}
          disabled={!selectedTemplateId || !cameraReady || state.isLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <ScanLine className="w-4 h-4" />
          Scan Sekarang
        </button>

        {!cameraReady ? (
          <button
            onClick={() => { startCamera().then(() => setCameraReady(true)); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            Aktifkan Kamera
          </button>
        ) : (
          <button
            onClick={() => { stopCamera(); setCameraReady(false); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <CameraOff className="w-4 h-4" />
            Matikan Kamera
          </button>
        )}
      </div>

      {state.error && (
        <p className="text-center text-sm text-red-500 mt-4">{state.error}</p>
      )}

      {/* Result Toast */}
      <ScanResultToast
        result={state.lastResult}
        onClose={() => {}}
      />
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Memuat...</div>}>
      <ScanPageContent />
    </Suspense>
  );
}
