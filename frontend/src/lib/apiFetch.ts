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

/**
 * Crea una conexión SSE (Server‑Sent Events) con autenticación.
 * @param url         URL del endpoint (sin base, se usará VITE_API_BASE_URL)
 * @param onMessage   Callback invocado por cada mensaje 'data:' recibido (objeto parseado)
 * @param onError     Callback opcional para errores
 * @param options     Opciones adicionales para fetch
 * @returns           Objeto con método close() para terminar la conexión
 */
export function createSSEConnection<T>(
  url: string,
  onMessage: (data: T) => void,
  onError?: (error: any) => void,
  options: FetchOptions = {}
): () => void {
  const abortController = new AbortController();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const connect = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No hay sesión activa');
      }

      const headers = new Headers(options.headers);
      headers.set('Authorization', `Bearer ${session.access_token}`);

      const response = await fetch(`${apiBaseUrl}${url}`, {
        ...options,
        headers,
        signal: abortController.signal,
      });

      if (!response.ok) {
        if (response.status === 401) {
          await supabase.auth.signOut();
          throw new Error('Sesión expirada');
        }
        throw new Error(`Error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No se pudo leer el stream');

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // guarda el fragmento incompleto

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr) {
              try {
                const data = JSON.parse(jsonStr) as T;
                onMessage(data);
              } catch (parseError) {
                if (onError) onError(parseError);
              }
            }
          }
        }
      }
    } catch (error) {
      if ((error as any).name !== 'AbortError') {
        if (onError) onError(error);
      }
    }
  };

  connect();

  return () => abortController.abort()
}