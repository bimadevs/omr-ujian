'use client';

import { useEffect } from 'react';
import { useTemplateContext } from '@/context/TemplateContext';

export function useTemplates() {
  const { templates, loading, refreshTemplates, setTemplates } = useTemplateContext();

  useEffect(() => {
    if (templates.length === 0) {
      refreshTemplates();
    }
  }, [templates.length, refreshTemplates]);

  return { templates, loading, refreshTemplates, setTemplates };
}
