import { supabase } from './supabase';

interface FetchOptions extends RequestInit {
  // Puedes extender con opciones propias si quieres
}

/**
 * Realiza una petición HTTP incluyendo el token de acceso actual de Supabase.
 * Si no hay sesión, lanza un error. Si la API responde 401, fuerza cierre de sesión.
 */
export async function apiFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  // Obtener la sesión actual (Supabase refresca automáticamente si expiró)
  const apiBaeUrl = import.meta.env.VITE_API_BASE_URL;
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Opcional: redirigir al login o lanzar error
    throw new Error('No hay sesión activa');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${session.access_token}`);

  const response = await fetch(`${apiBaeUrl}${url}`, {
    ...options,
    headers,
  });

  // Si la API externa responde 401, el token puede ser inválido o la sesión expiró.
  // Forzamos un cierre de sesión en el cliente.
  if (response.status === 401) {
    await supabase.auth.signOut();
    throw new Error('Sesión expirada. Vuelve a iniciar sesión.');
  }

  return response;
}

export async function apiFetchJSON<T>(url: string, options?: FetchOptions): Promise<T> {
  const res = await apiFetch(url, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error ${res.status}`);
  }
  return res.json();
}