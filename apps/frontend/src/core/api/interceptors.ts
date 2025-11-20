/**
 * Interceptors
 * request son los que se envian antes de la petición http
 * response en base a la respuesta de la petición http
 * con los interceptors de axios antes de cada request obtenemos el token del localstorage y le enviamos a la peticion http la configuración con headers
 */
import { clearAuth, getAuthToken } from "@/core/helpers/storage"; // ver abajo: helper de storage
import type { AxiosInstance } from "axios";

export function registerInterceptors(api: AxiosInstance) {
  // Request interceptor: añade token si existe
  api.interceptors.request.use(
    config => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // config.headers = {
        //   ...(config.headers ?? {}),
        //   Authorization: `Bearer ${token}`,
        // };
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Response interceptor: manejo centralizado de errores (401, logging)
  api.interceptors.response.use(
    response => response,
    async error => {
      const status = error?.response?.status;
      if (status === 401) {
        // intentar refresh token o limpiar credenciales y redirigir a login
        clearAuth();
        // opcional: window.location.href = '/login';
      }
      // aquí puedes conectar telemetry/logging
      return Promise.reject(error);
    }
  );
}
