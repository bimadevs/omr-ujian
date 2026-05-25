import { TemplateConfig, AnswerKey, ScanResult } from './types';

const API_BASE = '/api';

export async function fetchTemplates(): Promise<TemplateConfig[]> {
  const res = await fetch(`${API_BASE}/templates`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export async function fetchTemplate(id: number): Promise<TemplateConfig> {
  const res = await fetch(`${API_BASE}/templates/${id}`);
  if (!res.ok) throw new Error('Failed to fetch template');
  return res.json();
}

export async function createTemplate(data: FormData): Promise<TemplateConfig> {
  const res = await fetch(`${API_BASE}/templates`, {
    method: 'POST',
    body: data,
  });
  if (!res.ok) throw new Error('Failed to create template');
  return res.json();
}

export async function updateTemplate(id: number, data: Partial<TemplateConfig>): Promise<TemplateConfig> {
  const res = await fetch(`${API_BASE}/templates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update template');
  return res.json();
}

export async function deleteTemplate(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/templates/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete template');
}

export async function fetchAnswerKeys(templateId: number): Promise<AnswerKey[]> {
  const res = await fetch(`${API_BASE}/templates/${templateId}/keys`);
  if (!res.ok) throw new Error('Failed to fetch answer keys');
  return res.json();
}

export async function saveAnswerKeys(templateId: number, keys: AnswerKey[]): Promise<void> {
  const res = await fetch(`${API_BASE}/templates/${templateId}/keys`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keys }),
  });
  if (!res.ok) throw new Error('Failed to save answer keys');
}

export async function submitScan(formData: FormData): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Scan failed');
  return res.json();
}

export async function fetchScanResults(): Promise<ScanResult[]> {
  const res = await fetch(`${API_BASE}/results`);
  if (!res.ok) throw new Error('Failed to fetch results');
  return res.json();
}

export async function deleteScanResult(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/results/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete result');
}
