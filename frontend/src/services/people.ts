import { apiFetchJSON } from '../lib/apiFetch';
import type { PersonRecord, CreatePersonRecord, UpdatePersonRecord } from '../types';

const personBaseUrl = '/people';

export const peopleService = {
  findAll: (sedeId?: string, active?: boolean, idDocumento?: string) => {
    const params = new URLSearchParams();
    if (sedeId) params.append('sedeId', sedeId);
    if (active !== undefined) params.append('active', String(active));
    if (idDocumento) params.append('idDocumento', idDocumento);
    const url = `${personBaseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    return apiFetchJSON<PersonRecord[]>(url);
  },
  findOne: (id: string) => apiFetchJSON<PersonRecord>(`${personBaseUrl}/${id}`),
  create: (data: CreatePersonRecord) =>
    apiFetchJSON<PersonRecord>(personBaseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }),
  update: (id: string, data: UpdatePersonRecord) =>
    apiFetchJSON<PersonRecord>(`${personBaseUrl}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }),
  toggleActive: (id: string) =>
    apiFetchJSON<PersonRecord>(`${personBaseUrl}/${id}/toggle-active`, {
      method: 'PATCH',
    }),
};