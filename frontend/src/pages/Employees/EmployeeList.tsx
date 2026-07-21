import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { peopleService } from '../../services/people';
import { locationsService } from '../../services/locations';
import type { PersonRecord, LocationRecord, DocumentTypeRecord } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Plus,
  Eye,
  Pencil,
  Power,
  PowerOff,
  Search,
  X,
  Users,
} from 'lucide-react';
import { documentTypesService } from '../../services/documentTypes';

type FilterState = {
  sedeId: string;
  active: string;
  idDocumento: string;
};

export function EmployeeList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState<PersonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [docsTypes, setDocsTypes] = useState<DocumentTypeRecord[]>([]);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    sedeId: searchParams.get('sedeId') || '',
    active: searchParams.get('active') ?? '',
    idDocumento: searchParams.get('idDocumento') || '',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [employeesData, locationsData, docsTypes] = await Promise.all([
        peopleService.findAll(filters.sedeId || undefined, filters.active !== '' ? filters.active === 'true' : undefined, filters.idDocumento || undefined),
        locationsService.findAll(),
        documentTypesService.findAll(),
      ]);
      setEmployees(employeesData);
      setLocations(locationsData);
      setDocsTypes(docsTypes);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.sedeId) params.append('sedeId', filters.sedeId);
    if (filters.active !== '') params.append('active', filters.active);
    if (filters.idDocumento) params.append('idDocumento', filters.idDocumento);
    setSearchParams(params);
    loadData();
  };

  const clearFilters = () => {
    setFilters({ sedeId: '', active: '', idDocumento: '' });
    setSearchParams({});
    loadData();
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    try {
      await peopleService.toggleActive(id);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, activo: !currentActive } : emp
        )
      );
    } catch (err: any) {
      setError(err.message || 'Error al cambiar estado');
    } finally {
      setTogglingId(null);
    }
  };

  const getLocationName = (locationId: string) => {
    const loc = locations.find((l) => l.id === locationId);
    return loc ? loc.nombre : locationId;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Empleados</h1>
          <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {employees.length}
          </span>
        </div>
        <Link to="/employees/create" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Empleado
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="input-label text-sm">Sede</label>
              <select
                value={filters.sedeId}
                onChange={(e) => handleFilterChange('sedeId', e.target.value)}
                className="input-field"
              >
                <option value="">Todas</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label text-sm">Estado</label>
              <select
                value={filters.active}
                onChange={(e) => handleFilterChange('active', e.target.value)}
                className="input-field"
              >
                <option value="">Todos</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <div>
              <label className="input-label text-sm">Tipo de Documento</label>
              <select
                value={filters.idDocumento}
                onChange={(e) => handleFilterChange('idDocumento', e.target.value)}
                className="input-field"
              >
                <option value="">Todas</option>
                {docsTypes.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.identificador} - {tp.country?.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={applyFilters} className="btn-primary flex-1">
                <Search className="h-4 w-4 mr-2" />
                Filtrar
              </button>
              <button onClick={clearFilters} className="btn-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Documento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Sede
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
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No hay empleados registrados
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const primaryDoc = emp.documents?.find((d) => d.esPrincipal);
                  const primaryLocation = emp.locations?.find((l) => l.esPrincipal);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {emp.primerNombre} {emp.primerApellido}
                          </span>
                          <span className="text-xs text-slate-500 sm:hidden">
                            {primaryDoc?.numeroDocumento || 'Sin documento'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {emp.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-700">
                            {primaryDoc?.numeroDocumento || '—'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {primaryDoc?.documentType?.identificador || ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm text-slate-700">
                          {primaryLocation ? getLocationName(primaryLocation.locationId) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            emp.activo
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {emp.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/employees/${emp.id}`}
                            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/employees/${emp.id}/edit`}
                            className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleActive(emp.id, emp.activo)}
                            disabled={togglingId === emp.id}
                            className={`p-1.5 rounded-md transition-colors ${
                              emp.activo
                                ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={emp.activo ? 'Desactivar' : 'Activar'}
                          >
                            {togglingId === emp.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : emp.activo ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}