import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { documentTypesService } from '../../services/documentTypes';
import { countriesService } from '../../services/countries';
import type { DocumentTypeRecord, CountryRecord } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Plus, Pencil, Power, PowerOff, FileText, Search, X } from 'lucide-react';

export function DocumentTypeList() {
  const [items, setItems] = useState<DocumentTypeRecord[]>([]);
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadData = async (countryId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [docTypes, countriesData] = await Promise.all([
        documentTypesService.findAll(countryId),
        countriesService.findAll(),
      ]);
      setItems(docTypes);
      setCountries(countriesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = () => {
    loadData(countryFilter || undefined);
  };

  const clearFilter = () => {
    setCountryFilter('');
    loadData();
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    try {
      await documentTypesService.toggleActive(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, activo: !currentActive } : item
        )
      );
    } catch (err: any) {
      setError(err.message || 'Error al cambiar estado');
    } finally {
      setTogglingId(null);
    }
  };

  const getCountryName = (countryId: string) => {
    const c = countries.find((c) => c.id === countryId);
    return c ? c.nombre : countryId;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Tipos de Documentos</h1>
          <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <Link to="/document-types/create" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tipo
        </Link>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="input-label text-sm">País</label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="input-field"
              >
                <option value="">Todos</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleFilter} className="btn-primary">
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </button>
            <button onClick={clearFilter} className="btn-secondary">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Identificador
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                  Descripción
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  País
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No hay tipos de documentos registrados
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{item.identificador}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-slate-600">{item.descripcion || '—'}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-700">{getCountryName(item.countryId)}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.activo
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/document-types/${item.id}/edit`}
                          className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleActive(item.id, item.activo)}
                          disabled={togglingId === item.id}
                          className={`p-1.5 rounded-md transition-colors ${
                            item.activo
                              ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={item.activo ? 'Desactivar' : 'Activar'}
                        >
                          {togglingId === item.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : item.activo ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}