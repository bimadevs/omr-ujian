'use client';

import { RefObject } from 'react';
import { ScanLine } from 'lucide-react';

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isScanning: boolean;
  isLoading: boolean;
}

export default function CameraPreview({ videoRef, canvasRef, isScanning, isLoading }: CameraPreviewProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanner overlay guide */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-3/4 h-3/4 border-2 border-white/40 rounded-lg">
            {/* Corner markers */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-md" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-md" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-md" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-md" />

            {/* Scan line animation */}
            {isScanning && (
              <div className="absolute left-0 right-0 h-0.5 bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-[scan_2s_linear_infinite]" />
            )}
          </div>
        </div>

        {/* Status indicators */}
        {isScanning && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            Auto-scan aktif
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-lg">
              <ScanLine className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-sm font-medium text-slate-700">Memproses...</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
