import { apiFetchJSON } from '../lib/apiFetch';
import type { CityRecord } from '../types';

const cityBaseUrl = '/cities';

export const citiesService = {
  findAll: (countryId?: string) => {
    const url = countryId ? `${cityBaseUrl}/?countryId=${countryId}` : cityBaseUrl;
    return apiFetchJSON<CityRecord[]>(url);
  },
  findOne: (id: string) => apiFetchJSON<CityRecord>(`${cityBaseUrl}/${id}`),
};