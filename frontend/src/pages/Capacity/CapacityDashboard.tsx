import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { locationsService } from '../../services/locations';
import type { CapacityQuery } from '../../services/capacityService';
import { capacityService } from '../../services/capacityService';
import type { CapacityResultRecord, LocationRecord, EventAccessRecord } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Search, X, DoorOpen, DoorClosed, Activity } from 'lucide-react';

type FilterState = {
  locationId: string;
  startDate: string;
  endDate: string;
};

export function CapacityDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [capacityData, setCapacityData] = useState<CapacityResultRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros locales (vinculados a inputs)
  const [filters, setFilters] = useState<FilterState>({
    locationId: searchParams.get('locationId') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  });

  // Referencia para cerrar la conexión SSE
  const sseCloseRef = useRef<(() => void) | null>(null);

  // Cargar lista de sedes al montar
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const [data, caps] = await Promise.all([locationsService.findAll(), 
          capacityService.findAll(filters.locationId || filters.startDate || filters.endDate ? filters : {})]);
        setLocations(data);
        setCapacityData(caps);
      } catch (err: any) {
        setError(err.message || 'Error al cargar sedes');
      }
    };
    loadLocations();
  }, []);

  // Función para obtener datos (GET o SSE)
  const fetchData = async (query: CapacityQuery) => {
    setLoading(true);
    setError(null);

    // Si hay fechas, usamos GET; si no, SSE
    const hasDate = query.startDate || query.endDate;

    // Cerramos cualquier SSE previo
    if (sseCloseRef.current) {
      sseCloseRef.current();
      sseCloseRef.current = null;
    }

    if (hasDate) {
      // Modo GET
      try {
        const data = await capacityService.findAll(query);
        setCapacityData(data);
      } catch (err: any) {
        setError(err.message || 'Error al obtener datos');
      } finally {
        setLoading(false);
      }
    } else {
      // Modo SSE
      try {
        const close = capacityService.streamEvents(
          query,
          (data) => {
            // Cada mensaje reemplaza completamente el estado
            setCapacityData(data);
            setLoading(false);
          },
          (err) => {
            setError(err.message || 'Error en la conexión SSE');
            setLoading(false);
          }
        );
        sseCloseRef.current = close;
        // El loading se mantiene hasta el primer mensaje
      } catch (err: any) {
        setError(err.message || 'Error al iniciar SSE');
        setLoading(false);
      }
    }
  };

  // Efecto que se ejecuta cuando cambian los filtros (o al montar)
  useEffect(() => {
    const query: CapacityQuery = {};
    if (filters.locationId) query.locationId = filters.locationId;
    if (filters.startDate) query.startDate = filters.startDate;
    if (filters.endDate) query.endDate = filters.endDate;
    // tipo puede ser 'day' o 'range', lo dejamos fijo como 'range' si hay ambas fechas
    if (filters.startDate && filters.endDate) query.tipo = 'range';
    else if (filters.startDate) query.tipo = 'day';

    fetchData(query);

    // Cleanup: cerrar SSE al desmontar
    return () => {
      if (sseCloseRef.current) {
        sseCloseRef.current();
        sseCloseRef.current = null;
      }
    };
  }, [filters.locationId, filters.startDate, filters.endDate]);

  // Actualizar search params al aplicar filtros (opcional)
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.locationId) params.set('locationId', filters.locationId);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ locationId: '', startDate: '', endDate: '' });
    setSearchParams({});
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getFullName = (person: EventAccessRecord['person']) => {
    return `${person.primerNombre} ${person.primerApellido}`.trim();
  };

  // Extraer datos para renderizar
  const eventos = capacityData?.eventos || [];
  const aforoPorSede = capacityData?.aforoPorSede; // puede ser objeto o array

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Control de Acceso</h1>
          <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {eventos.length} eventos
          </span>
        </div>
        <div className="text-sm text-slate-500">
          {capacityData?.aforoPorSede ? 'Tiempo real' : 'Histórico'}
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="input-label text-sm">Sede</label>
              <select
                value={filters.locationId}
                onChange={(e) => handleFilterChange('locationId', e.target.value)}
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
              <label className="input-label text-sm">Fecha inicio</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label text-sm">Fecha fin</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={applyFilters} className="btn-primary flex-1">
                <Search className="h-4 w-4 mr-2" />
                Aplicar
              </button>
              <button onClick={clearFilters} className="btn-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {filters.startDate || filters.endDate
              ? '📋 Modo histórico (consulta GET)'
              : '⚡ Modo tiempo real (SSE)'}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Cards de aforo por sede */}
      {capacityData?.aforoPorSede && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Si aforoPorSede es un array, mapearlo; si es un objeto, meterlo en array */}
          {Array.isArray(aforoPorSede) && aforoPorSede.length > 1 ? (
            aforoPorSede.map((item) => (
              <div key={item.sede.id} className="card hover:shadow-md transition-shadow">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.sede.nombre}</h3>
                      <p className="text-xs text-slate-500">Código: {item.sede.codigoSede}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.aforo > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.aforo} ocupantes
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-slate-500">Ingresos</p>
                      <p className="font-bold text-emerald-600">{item.totalIngresos}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Salidas</p>
                      <p className="font-bold text-rose-600">{item.totalSalidas}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Aforo</p>
                      <p className="font-bold text-indigo-600">{item.aforo}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Si es un solo objeto
            <>
            { aforoPorSede && aforoPorSede.length && (<div className="card hover:shadow-md transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900">{aforoPorSede[0].sede.nombre}</h3>
                    <p className="text-xs text-slate-500">Código: {aforoPorSede[0].sede.codigoSede}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    aforoPorSede[0].aforo > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {aforoPorSede[0].aforo} ocupantes
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="text-slate-500">Ingresos</p>
                    <p className="font-bold text-emerald-600">{aforoPorSede[0].totalIngresos}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Salidas</p>
                    <p className="font-bold text-rose-600">{aforoPorSede[0].totalSalidas}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Aforo</p>
                    <p className="font-bold text-indigo-600">{aforoPorSede[0].aforo}</p>
                  </div>
                </div>
              </div>
            </div>)}
            </>
          )}
        </div>
      )}

      {/* Tabla de eventos */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha / Hora
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Sede
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading && eventos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : eventos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No hay eventos registrados
                  </td>
                </tr>
              ) : (
                eventos.map((event, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.tipo === 'ENTRADA'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {event.tipo === 'ENTRADA' ? (
                          <DoorOpen className="h-3 w-3 mr-1" />
                        ) : (
                          <DoorClosed className="h-3 w-3 mr-1" />
                        )}
                        {event.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {getFullName(event.person)}
                        </span>
                        <span className="text-xs text-slate-500">
                          Código: {event.person.codigoEmpleado}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-slate-700">
                      {event.sede.nombre}
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