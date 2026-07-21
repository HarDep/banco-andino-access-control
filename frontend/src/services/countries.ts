import { apiFetchJSON } from '../lib/apiFetch';
import type { CountryRecord } from '../types';

const countryBaseUrl = '/countries';

export const countriesService = {
  findAll: () => apiFetchJSON<CountryRecord[]>(countryBaseUrl),
  findOne: (id: string) => apiFetchJSON<CountryRecord>(`${countryBaseUrl}/${id}`),
};