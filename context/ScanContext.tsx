'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ScanResult } from '@/lib/types';
import { fetchScanResults } from '@/lib/api';

interface ScanContextType {
  results: ScanResult[];
  loading: boolean;
  refreshResults: () => Promise<void>;
  addResult: (result: ScanResult) => void;
  setResults: React.Dispatch<React.SetStateAction<ScanResult[]>>;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshResults = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchScanResults();
      setResults(data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const addResult = useCallback((result: ScanResult) => {
    setResults((prev) => [result, ...prev]);
  }, []);

  return (
    <ScanContext.Provider value={{ results, loading, refreshResults, addResult, setResults }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScanContext() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScanContext must be used within ScanProvider');
  return ctx;
}
