import axios from "axios";
import { axiosConfig } from "./axios.config";
import { registerInterceptors } from "./interceptors";

const api = axios.create(axiosConfig);

// registrar interceptors de request y response
registerInterceptors(api);

// exporta la instancia
export default api;
