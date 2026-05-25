'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { submitScan } from '@/lib/api';
import { ScanResult } from '@/lib/types';

export interface ScannerState {
  isScanning: boolean;
  isLoading: boolean;
  lastResult: ScanResult | null;
  error: string | null;
}

export function useCameraScanner(templateId: number | null, onResult?: (r: ScanResult) => void) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingRef = useRef(false);

  const [state, setState] = useState<ScannerState>({
    isScanning: false,
    isLoading: false,
    lastResult: null,
    error: null,
  });

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setState((s) => ({ ...s, error: 'Tidak dapat mengakses kamera' }));
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setState((s) => ({ ...s, isScanning: false }));
  }, []);

  const captureAndScan = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !templateId) return;
    if (isProcessingRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isProcessingRef.current = true;
    setState((s) => ({ ...s, isLoading: true }));

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.85)
      );
      if (!blob) return;

      const formData = new FormData();
      formData.append('image', blob, 'scan.jpg');
      formData.append('templateId', String(templateId));

      const result = await submitScan(formData);
      setState((s) => ({ ...s, lastResult: result, isLoading: false }));
      onResult?.(result);
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    } finally {
      isProcessingRef.current = false;
    }
  }, [templateId, onResult]);

  const startScanning = useCallback(() => {
    setState((s) => ({ ...s, isScanning: true, error: null }));
    intervalRef.current = setInterval(captureAndScan, 500);
  }, [captureAndScan]);

  const stopScanning = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState((s) => ({ ...s, isScanning: false }));
  }, []);

  const manualScan = useCallback(async () => {
    await captureAndScan();
  }, [captureAndScan]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    state,
    startCamera,
    stopCamera,
    startScanning,
    stopScanning,
    manualScan,
  };
}
