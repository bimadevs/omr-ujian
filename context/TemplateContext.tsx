'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { TemplateConfig } from '@/lib/types';
import { fetchTemplates } from '@/lib/api';

interface TemplateContextType {
  templates: TemplateConfig[];
  loading: boolean;
  refreshTemplates: () => Promise<void>;
  setTemplates: React.Dispatch<React.SetStateAction<TemplateConfig[]>>;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<TemplateConfig[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTemplates();
      setTemplates(data);
    } catch {
      // Silently fail, user can retry
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TemplateContext.Provider value={{ templates, loading, refreshTemplates, setTemplates }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplateContext() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error('useTemplateContext must be used within TemplateProvider');
  return ctx;
}
