import { apiFetchJSON } from '../lib/apiFetch';
import type { DocumentTypeRecord, CreateDocumentTypeDto, UpdateDocumentTypeDto } from '../types';

const documentTypeBaseUrl = '/document-types';

export const documentTypesService = {
  findAll: (countryId?: string) => {
    const url = countryId ? `${documentTypeBaseUrl}?countryId=${countryId}` : documentTypeBaseUrl;
    return apiFetchJSON<DocumentTypeRecord[]>(url);
  },
  findOne: (id: string) => apiFetchJSON<DocumentTypeRecord>(`${documentTypeBaseUrl}/${id}`),
  create: (data: CreateDocumentTypeDto) =>
    apiFetchJSON<DocumentTypeRecord>(documentTypeBaseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }),
  update: (id: string, data: UpdateDocumentTypeDto) =>
    apiFetchJSON<DocumentTypeRecord>(`${documentTypeBaseUrl}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }),
  toggleActive: (id: string) =>
    apiFetchJSON<DocumentTypeRecord>(`${documentTypeBaseUrl}/${id}/toggle-active`, {
      method: 'PATCH',
    }),
};