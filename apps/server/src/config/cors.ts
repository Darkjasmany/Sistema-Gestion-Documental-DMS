import type { CorsOptions } from "cors";
import { FRONTEND_URL } from "./env.js";

export const corsConfig: CorsOptions = {
  // cors recibe un origin y un callback para realizar la validacion
  origin: function (origin, callback) {
    const whitelist = [FRONTEND_URL, "http://localhost:3000"];

    // Permitir peticiones sin origin solo en desarrollo con --api
    // const isDevApi = process.argv.includes("--api");
    // if (isDevApi) whitelist.push("");

    // Permite el origen del frontend, peticiones sin origin y en desarrollo
    // if (!origin && isDevApi) {
    if (!origin) {
      callback(null, true);
    } else if (origin && whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};
