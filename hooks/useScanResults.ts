'use client';

import { useEffect } from 'react';
import { useScanContext } from '@/context/ScanContext';

export function useScanResults() {
  const { results, loading, refreshResults, addResult, setResults } = useScanContext();

  useEffect(() => {
    if (results.length === 0) {
      refreshResults();
    }
  }, [results.length, refreshResults]);

  return { results, loading, refreshResults, addResult, setResults };
}
