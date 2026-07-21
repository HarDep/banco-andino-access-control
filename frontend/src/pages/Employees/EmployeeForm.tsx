import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { peopleService } from '../../services/people';
import { documentTypesService } from '../../services/documentTypes';
import { locationsService } from '../../services/locations';
import type { DocumentTypeRecord, LocationRecord } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';

const employeeSchema = z.object({
  tipoPersona: z.enum(['EMPLEADO', 'VISITANTE', 'CONTRATISTA']),
  primerNombre: z.string().min(1, 'Requerido'),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().min(1, 'Requerido'),
  segundoApellido: z.string().optional(),
  telefono: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido'),
  codigoEmpleado: z.string().min(1, 'Requerido'),
  fechaIngreso: z.string().optional(),
  fechaRetiro: z.string().optional(),
  activo: z.boolean(),
  nivelAcceso: z.string().min(1, 'Requerido'),
  jornada: z.string().min(1, 'Requerido'),
  cargo: z.string().min(1, 'Requerido'),
  area: z.string().min(1, 'Requerido'),
  centroCosto: z.string().min(1, 'Requerido'),
  tipoContrato: z.string().min(1, 'Requerido'),
  biostarId: z.string().optional(),
  tarjetaRfid: z.string().optional(),
  documents: z.array(z.object({
    documentTypeId: z.string().min(1, 'Seleccione un tipo'),
    numeroDocumento: z.string().min(1, 'Requerido'),
    esPrincipal: z.boolean(),
  })),
  locations: z.array(z.object({
    locationId: z.string().min(1, 'Seleccione una sede'),
    esPrincipal: z.boolean(),
  })),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export function EmployeeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  const [documentTypes, setDocumentTypes] = useState<DocumentTypeRecord[]>([]);
  const [locations, setLocations] = useState<LocationRecord[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      tipoPersona: 'EMPLEADO',
      activo: true,
      documents: [{ documentTypeId: '', numeroDocumento: '', esPrincipal: false }],
      locations: [{ locationId: '', esPrincipal: false }],
    },
  });

  const { fields: docFields, append: appendDoc, remove: removeDoc } = useFieldArray({
    control,
    name: 'documents',
  });

  const { fields: locFields, append: appendLoc, remove: removeLoc } = useFieldArray({
    control,
    name: 'locations',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [docTypes, locs] = await Promise.all([
          documentTypesService.findAll(),
          locationsService.findAll()
        ]);
        setDocumentTypes(docTypes);
        setLocations(locs);
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos');
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      const loadEmployee = async () => {
        try {
          const emp = await peopleService.findOne(id);
          reset({
            tipoPersona: emp.tipoPersona,
            primerNombre: emp.primerNombre,
            segundoNombre: emp.segundoNombre || '',
            primerApellido: emp.primerApellido,
            segundoApellido: emp.segundoApellido || '',
            telefono: emp.telefono,
            email: emp.email,
            codigoEmpleado: emp.codigoEmpleado,
            fechaIngreso: emp.fechaIngreso ? new Date(emp.fechaIngreso).toISOString().split('T')[0] : '',
            fechaRetiro: emp.fechaRetiro ? new Date(emp.fechaRetiro).toISOString().split('T')[0] : '',
            activo: emp.activo,
            nivelAcceso: emp.nivelAcceso,
            jornada: emp.jornada,
            cargo: emp.cargo,
            area: emp.area,
            centroCosto: emp.centroCosto,
            tipoContrato: emp.tipoContrato,
            biostarId: emp.credencialesBiostar?.biostarId || '',
            tarjetaRfid: emp.credencialesBiostar?.tarjetaRfid || '',
            documents: emp.documents && emp.documents.length > 0
              ? emp.documents.map(d => ({
                  documentTypeId: d.idDocumento,
                  numeroDocumento: d.numeroDocumento,
                  esPrincipal: d.esPrincipal,
                }))
              : [{ documentTypeId: '', numeroDocumento: '', esPrincipal: false }],
            locations: emp.locations && emp.locations.length > 0
              ? emp.locations.map(l => ({
                  locationId: l.locationId,
                  esPrincipal: l.esPrincipal,
                }))
              : [{ locationId: '', esPrincipal: false }],
          });
        } catch (err: any) {
          setError(err.message || 'Error al cargar el empleado');
        } finally {
          setInitialLoading(false);
        }
      };
      loadEmployee();
    } else {
      setInitialLoading(false);
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        ...data,
        fechaIngreso: data.fechaIngreso ? new Date(data.fechaIngreso) : undefined,
        fechaRetiro: data.fechaRetiro ? new Date(data.fechaRetiro) : undefined,
        credencialesBiostar: data.biostarId || data.tarjetaRfid
          ? { biostarId: data.biostarId || '', tarjetaRfid: data.tarjetaRfid || '' }
          : undefined,
        documents: data.documents.filter(d => d.documentTypeId && d.numeroDocumento),
        locations: data.locations.filter(l => l.locationId),
      };

      if (isEdit && id) {
        await peopleService.update(id, payload);
      } else {
        await peopleService.create(payload as any);
      }
      navigate('/employees');
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/employees" className="btn-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
        </h1>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-slate-900">Información Personal</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="input-label">Primer Nombre *</label>
                <input {...register('primerNombre')} className="input-field" />
                {errors.primerNombre && <p className="text-xs text-red-600 mt-1">{errors.primerNombre.message}</p>}
              </div>
              <div>
                <label className="input-label">Segundo Nombre</label>
                <input {...register('segundoNombre')} className="input-field" />
              </div>
              <div>
                <label className="input-label">Primer Apellido *</label>
                <input {...register('primerApellido')} className="input-field" />
                {errors.primerApellido && <p className="text-xs text-red-600 mt-1">{errors.primerApellido.message}</p>}
              </div>
              <div>
                <label className="input-label">Segundo Apellido</label>
                <input {...register('segundoApellido')} className="input-field" />
              </div>
              <div>
                <label className="input-label">Teléfono *</label>
                <input {...register('telefono')} className="input-field" />
                {errors.telefono && <p className="text-xs text-red-600 mt-1">{errors.telefono.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Email *</label>
                <input {...register('email')} type="email" className="input-field" />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Employment Info */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-slate-900">Información Laboral</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="input-label">Código Empleado *</label>
                <input {...register('codigoEmpleado')} className="input-field" />
                {errors.codigoEmpleado && <p className="text-xs text-red-600 mt-1">{errors.codigoEmpleado.message}</p>}
              </div>
              <div>
                <label className="input-label">Cargo *</label>
                <input {...register('cargo')} className="input-field" />
                {errors.cargo && <p className="text-xs text-red-600 mt-1">{errors.cargo.message}</p>}
              </div>
              <div>
                <label className="input-label">Área *</label>
                <input {...register('area')} className="input-field" />
                {errors.area && <p className="text-xs text-red-600 mt-1">{errors.area.message}</p>}
              </div>
              <div>
                <label className="input-label">Centro de Costo *</label>
                <input {...register('centroCosto')} className="input-field" />
                {errors.centroCosto && <p className="text-xs text-red-600 mt-1">{errors.centroCosto.message}</p>}
              </div>
              <div>
                <label className="input-label">Jornada *</label>
                <input {...register('jornada')} className="input-field" />
                {errors.jornada && <p className="text-xs text-red-600 mt-1">{errors.jornada.message}</p>}
              </div>
              <div>
                <label className="input-label">Tipo de Contrato *</label>
                <input {...register('tipoContrato')} className="input-field" />
                {errors.tipoContrato && <p className="text-xs text-red-600 mt-1">{errors.tipoContrato.message}</p>}
              </div>
              <div>
                <label className="input-label">Nivel de Acceso *</label>
                <input {...register('nivelAcceso')} className="input-field" />
                {errors.nivelAcceso && <p className="text-xs text-red-600 mt-1">{errors.nivelAcceso.message}</p>}
              </div>
              <div>
                <label className="input-label">Fecha Ingreso</label>
                <input {...register('fechaIngreso')} type="date" className="input-field" />
              </div>
              <div>
                <label className="input-label">Fecha Retiro</label>
                <input {...register('fechaRetiro')} type="date" className="input-field" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <label className="input-label mb-0">Activo</label>
                <input {...register('activo')} type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Documentos</h2>
            <button
              type="button"
              onClick={() => appendDoc({ documentTypeId: '', numeroDocumento: '', esPrincipal: false })}
              className="btn-secondary text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </button>
          </div>
          <div className="card-body space-y-4">
            {docFields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-end gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1 min-w-[120px]">
                  <label className="input-label text-sm">Tipo de Documento *</label>
                  <select {...register(`documents.${index}.documentTypeId`)} className="input-field">
                    <option value="">Seleccionar</option>
                    {documentTypes.map(dt => (
                      <option key={dt.id} value={dt.id}>{dt.identificador}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="input-label text-sm">Número *</label>
                  <input {...register(`documents.${index}.numeroDocumento`)} className="input-field" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <label className="text-sm text-slate-700">Principal</label>
                  <input {...register(`documents.${index}.esPrincipal`)} type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
                </div>
                {docFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDoc(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {errors.documents && <p className="text-xs text-red-600">{errors.documents.message}</p>}
          </div>
        </div>

        {/* Locations */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Sedes</h2>
            <button
              type="button"
              onClick={() => appendLoc({ locationId: '', esPrincipal: false })}
              className="btn-secondary text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </button>
          </div>
          <div className="card-body space-y-4">
            {locFields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-end gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1 min-w-[180px]">
                  <label className="input-label text-sm">Sede *</label>
                  <select {...register(`locations.${index}.locationId`)} className="input-field">
                    <option value="">Seleccionar</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <label className="text-sm text-slate-700">Principal</label>
                  <input {...register(`locations.${index}.esPrincipal`)} type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
                </div>
                {locFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLoc(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {errors.locations && <p className="text-xs text-red-600">{errors.locations.message}</p>}
          </div>
        </div>

        {/* Biostar */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-slate-900">Credenciales Biostar</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Biostar ID</label>
                <input {...register('biostarId')} className="input-field" />
              </div>
              <div>
                <label className="input-label">Tarjeta RFID</label>
                <input {...register('tarjetaRfid')} className="input-field" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={isSubmitting || loading} className="btn-primary">
            {isSubmitting || loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
          <Link to="/employees" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}