import axios from "axios";
import { axiosConfig } from "../config/axios";

const api = axios.create(axiosConfig);

/**
 * Interceptors
 * request son los que se envian antes de la petición http
 * response en base a la respuesta de la petición http
 * con los interceptors de axios antes de cada request obtenemos el token del localstorage y le enviamos a la peticion http la configuración con headers
 */

api.interceptors.request.use(config => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
