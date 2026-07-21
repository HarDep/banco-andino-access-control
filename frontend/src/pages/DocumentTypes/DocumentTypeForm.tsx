import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { documentTypesService } from '../../services/documentTypes';
import { countriesService } from '../../services/countries';
import type { CountryRecord } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ArrowLeft, Loader2 } from 'lucide-react';

const schema = z.object({
  identificador: z.string().min(1, 'Requerido'),
  descripcion: z.string().optional(),
  activo: z.boolean(),
  countryId: z.string().min(1, 'Seleccione un país'),
});

type FormData = z.infer<typeof schema>;

export function DocumentTypeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountryRecord[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { activo: true, countryId: '' },
  });

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await countriesService.findAll();
        setCountries(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar países');
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      const loadItem = async () => {
        try {
          const item = await documentTypesService.findOne(id);
          reset({
            identificador: item.identificador,
            descripcion: item.descripcion || '',
            activo: item.activo,
            countryId: item.countryId,
          });
        } catch (err: any) {
          setError(err.message || 'Error al cargar el tipo de documento');
        } finally {
          setInitialLoading(false);
        }
      };
      loadItem();
    } else {
      setInitialLoading(false);
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: FormData) => {
    setError(null);
    setLoading(true);
    try {
      if (isEdit && id) {
        await documentTypesService.update(id, data);
      } else {
        await documentTypesService.create(data);
      }
      navigate('/document-types');
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link to="/document-types" className="btn-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEdit ? 'Editar Tipo de Documento' : 'Nuevo Tipo de Documento'}
        </h1>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="input-label">Identificador *</label>
              <input {...register('identificador')} className="input-field" placeholder="Ej: CEDULA, PASAPORTE" />
              {errors.identificador && <p className="text-xs text-red-600 mt-1">{errors.identificador.message}</p>}
            </div>

            <div>
              <label className="input-label">Descripción</label>
              <input {...register('descripcion')} className="input-field" placeholder="Descripción opcional" />
            </div>

            <div>
              <label className="input-label">País *</label>
              <select {...register('countryId')} className="input-field">
                <option value="">Seleccionar país</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {errors.countryId && <p className="text-xs text-red-600 mt-1">{errors.countryId.message}</p>}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="input-label mb-0">Activo</label>
              <input {...register('activo')} type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
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
              <Link to="/document-types" className="btn-secondary">Cancelar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}