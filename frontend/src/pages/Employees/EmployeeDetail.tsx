import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { peopleService } from '../../services/people';
import { locationsService } from '../../services/locations';
import { citiesService } from '../../services/cities';
import type { PersonRecord, LocationRecord, CityRecord } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ArrowLeft, User, Mail, Building, MapPin, FileText, BadgeCheck } from 'lucide-react';

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<PersonRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [cities, setCities] = useState<CityRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [empData, locsData, citiesData] = await Promise.all([
          peopleService.findOne(id),
          locationsService.findAll(),
          citiesService.findAll(),
        ]);
        setEmployee(empData);
        setLocations(locsData);
        setCities(citiesData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el empleado');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const getCityName = (cityId: string) => {
    const c = cities.find((c) => c.id === cityId);
    return c ? c.nombre : cityId;
  };

  if (loading) return <LoadingSpinner />;

  if (error || !employee) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <p className="text-red-600">{error || 'Empleado no encontrado'}</p>
          <Link to="/employees" className="btn-secondary mt-4 inline-flex">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/employees" className="btn-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Detalle del Empleado</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Información Personal
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Nombres</p>
                <p className="text-slate-900 font-medium">{employee.primerNombre} {employee.segundoNombre}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Apellidos</p>
                <p className="text-slate-900 font-medium">{employee.primerApellido} {employee.segundoApellido}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Tipo de Persona</p>
                <p className="text-slate-900 font-medium">{employee.tipoPersona}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Estado</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {employee.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-600" />
              Contacto
            </h2>
          </div>
          <div className="card-body space-y-3">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
              <p className="text-slate-900">{employee.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Teléfono</p>
              <p className="text-slate-900">{employee.telefono}</p>
            </div>
          </div>
        </div>

        {/* Employment Info */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Building className="h-5 w-5 text-indigo-600" />
              Información Laboral
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Código Empleado</p>
                <p className="text-slate-900 font-medium">{employee.codigoEmpleado}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Cargo</p>
                <p className="text-slate-900">{employee.cargo}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Área</p>
                <p className="text-slate-900">{employee.area}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Centro de Costo</p>
                <p className="text-slate-900">{employee.centroCosto}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Jornada</p>
                <p className="text-slate-900">{employee.jornada}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Tipo de Contrato</p>
                <p className="text-slate-900">{employee.tipoContrato}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Nivel de Acceso</p>
                <p className="text-slate-900">{employee.nivelAcceso}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Fecha Ingreso</p>
                <p className="text-slate-900">{employee.fechaIngreso ? new Date(employee.fechaIngreso).toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Fecha Retiro</p>
                <p className="text-slate-900">{employee.fechaRetiro ? new Date(employee.fechaRetiro).toLocaleDateString() : '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Documentos
            </h2>
          </div>
          <div className="card-body">
            {employee.documents && employee.documents.length > 0 ? (
              <ul className="divide-y divide-slate-200">
                {employee.documents.map((doc, idx) => (
                  <li key={idx} className="py-2 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {doc.documentType?.identificador || doc.idDocumento}
                        </p>
                        <p className="text-sm text-slate-600">{doc.numeroDocumento}</p>
                      </div>
                      {doc.esPrincipal && (
                        <BadgeCheck className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Sin documentos registrados</p>
            )}
          </div>
        </div>

        {/* Locations */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              Sedes
            </h2>
          </div>
          <div className="card-body">
            {employee.locations && employee.locations.length > 0 ? (
              <ul className="divide-y divide-slate-200">
                {employee.locations.map((loc, idx) => {
                  const location = locations.find(l => l.id === loc.locationId);
                  return (
                    <li key={idx} className="py-2 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {location ? location.nombre : loc.locationId}
                          </p>
                          {location && (
                            <p className="text-xs text-slate-500">
                              {getCityName(location.cityId)}
                            </p>
                          )}
                        </div>
                        {loc.esPrincipal && (
                          <BadgeCheck className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Sin sedes registradas</p>
            )}
          </div>
        </div>

        {/* Biostar */}
        {employee.credencialesBiostar && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-indigo-600" />
                Credenciales Biostar
              </h2>
            </div>
            <div className="card-body space-y-2">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Biostar ID</p>
                <p className="text-slate-900">{employee.credencialesBiostar.biostarId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Tarjeta RFID</p>
                <p className="text-slate-900">{employee.credencialesBiostar.tarjetaRfid}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Sincronizado</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.credencialesBiostar.estaSincronizado
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {employee.credencialesBiostar.estaSincronizado ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}