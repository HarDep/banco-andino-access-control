import { apiFetchJSON, createSSEConnection } from '../lib/apiFetch';
import type { CapacityResultRecord } from '../types';

export interface CapacityQuery {
  locationId?: string;
  startDate?: string;   // ISO date
  endDate?: string;     // ISO date
  tipo?: 'day' | 'month' | 'range';
}

const capacityBaseUrl = '/capacity';

export const capacityService = {
  /**
   * Obtiene los eventos y aforo mediante GET (con filtros de fecha).
   */
  findAll: (query: CapacityQuery): Promise<CapacityResultRecord> => {
    const params = new URLSearchParams();
    if (query.locationId) params.append('locationId', query.locationId);
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);
    if (query.tipo) params.append('tipo', query.tipo);
    const url = `${capacityBaseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    return apiFetchJSON<CapacityResultRecord>(url);
  },

  /**
   * Abre una conexión SSE para recibir actualizaciones en tiempo real.
   * Nota: el backend ignora las fechas en el SSE, solo usa locationId.
   */
  streamEvents: (
    query: CapacityQuery,
    onMessage: (data: CapacityResultRecord) => void,
    onError?: (error: any) => void
  ) => {
    const params = new URLSearchParams();
    if (query.locationId) params.append('locationId', query.locationId);
    // No enviamos fechas al SSE
    const url = `${capacityBaseUrl}/stream${params.toString() ? `?${params.toString()}` : ''}`;
    return createSSEConnection<CapacityResultRecord>(url, onMessage, onError);
  },
};