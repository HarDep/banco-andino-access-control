import { apiFetchJSON } from '../lib/apiFetch';
import type { LocationRecord } from '../types';

const locationBaseUrl = '/locations';

export const locationsService = {
  findAll: (cityId?: string) => {
    const url = cityId ? `${locationBaseUrl}?cityId=${cityId}` : locationBaseUrl;
    return apiFetchJSON<LocationRecord[]>(url);
  },
  findOne: (id: string) => apiFetchJSON<LocationRecord>(`${locationBaseUrl}/${id}`),
};